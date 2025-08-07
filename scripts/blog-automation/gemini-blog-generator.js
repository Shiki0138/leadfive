#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');
const { randomUUID } = require('crypto');

class GeminiBlogGenerator {
  constructor(config) {
    this.apiKey = config.geminiApiKey || process.env.GEMINI_API_KEY;
    this.keyword = config.keyword;
    this.targetLength = config.targetLength || 3000;
    this.category = config.category || 'AIマーケティング';
    this.customTitle = config.customTitle || null;
    this.postsDir = path.join(__dirname, '../../_posts');
    this.imagesDir = path.join(__dirname, '../../assets/images/blog');
    this.dataDir = path.join(__dirname, '../../_data/blog');
  }

  async generateBlogPost() {
    console.log(`🚀 Gemini ブログ記事生成開始: ${this.keyword}`);
    
    try {
      // 1. 過去の記事を分析してコンテキストを構築
      const context = await this.buildContext();
      
      // 2. 高品質なコンテンツを生成
      const content = await this.generateContent(context);
      
      // 3. 内部リンクを挿入
      const linkedContent = await this.insertInternalLinks(content);
      
      // 4. 画像プレースホルダーを配置
      const finalContent = await this.insertImagePlaceholders(linkedContent);
      
      // 5. ファイルを保存
      const filename = await this.savePost(finalContent);
      
      // 6. 統計を更新
      await this.updateStats(filename, finalContent.title);
      
      console.log(`✅ Gemini ブログ記事生成完了: ${filename}`);
      return { success: true, filename, title: finalContent.title };
      
    } catch (error) {
      console.error('❌ Gemini ブログ生成エラー:', error.message);
      if (error.response && error.response.data) {
        console.error('API エラー詳細:', JSON.stringify(error.response.data, null, 2));
      }
      return { success: false, error: error.message };
    }
  }

  async buildContext() {
    console.log('📚 コンテキスト構築中...');
    
    try {
      const posts = await fs.readdir(this.postsDir);
      const recentPosts = posts.filter(f => f.endsWith('.md')).slice(-10);
      
      const summaries = [];
      for (const post of recentPosts) {
        const content = await fs.readFile(path.join(this.postsDir, post), 'utf-8');
        const title = content.match(/^title:\s*"(.*)"/m)?.[1] || 'タイトルなし';
        summaries.push(`- ${title}`);
      }
      
      return {
        recentTopics: summaries,
        totalPosts: posts.length
      };
    } catch (error) {
      return { recentTopics: [], totalPosts: 0 };
    }
  }

  async generateContent(context) {
    console.log('✍️ Gemini SEO最適化コンテンツ生成中...');
    
    const { generateSEOPrompt } = require('./seo-writing-prompts.js');
    const systemPrompt = generateSEOPrompt(this.keyword, {
      targetAudience: '企業の意思決定者、マーケティング担当者',
      contentType: this.detectContentType(this.keyword),
      wordCount: this.targetLength
    });
    
    const userPrompt = `
キーワード: ${this.keyword}
カテゴリー: ${this.category}
文字数: ${this.targetLength}文字

既存記事のトピック:
${context.recentTopics.join('\n')}

重要な指示:
- 「[以下、同様のフォーマットで3000文字まで続く...]」のような省略表現は絶対に使用しない
- 完全な記事を最後まで書き切る
- 各セクションは具体的な内容で充実させる
- 画像の位置には{{IMAGE:説明}}を使用

以下の形式で出力してください：
1. タイトル候補5つ（SEOスコア付き）
2. 検索意図の分析
3. 選択タイトル: [最高スコアのタイトル]
4. メタディスクリプション: [120-150文字]
5. 記事本文（2500-3000文字、完全版、省略なし）`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`,
      {
        contents: [{
          parts: [{
            text: systemPrompt + '\n\n' + userPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 8192,
          topP: 0.9,
          topK: 40
        }
      }
    );

    const generatedText = response.data.candidates[0].content.parts[0].text;
    
    // SEO最適化された出力を解析
    const sections = this.parseGeneratedContent(generatedText);
    
    // タイトル選択
    let selectedTitle = sections.selectedTitle || `${this.keyword}完全ガイド`;
    
    if (this.customTitle) {
      selectedTitle = this.customTitle;
    }
    
    const description = sections.metaDescription || selectedTitle.substring(0, 150);
    const content = sections.articleContent || generatedText;
    
    return { 
      title: selectedTitle, 
      description, 
      content,
      rawContent: generatedText
    };
  }

  detectContentType(keyword) {
    if (/比較|選び方|おすすめ|ランキング/.test(keyword)) {
      return 'comparison';
    } else if (/方法|やり方|手順|ガイド/.test(keyword)) {
      return 'how-to';
    } else if (/とは|意味|解説|基礎/.test(keyword)) {
      return 'explanation';
    }
    return 'general';
  }

  parseGeneratedContent(text) {
    const sections = {
      titleCandidates: [],
      searchIntent: '',
      selectedTitle: '',
      metaDescription: '',
      articleContent: ''
    };
    
    // タイトル候補を抽出
    const titleMatch = text.match(/タイトル候補[：:]([\s\S]*?)(?=検索意図|2\.|$)/);
    if (titleMatch) {
      sections.titleCandidates = titleMatch[1]
        .split('\n')
        .filter(line => line.includes('スコア') || line.includes('点'))
        .map(line => line.trim());
    }
    
    // 選択タイトルを抽出
    const selectedMatch = text.match(/選択タイトル[：:]\s*(.+)/);
    if (selectedMatch) {
      sections.selectedTitle = selectedMatch[1].trim();
    }
    
    // メタディスクリプションを抽出
    const metaMatch = text.match(/メタディスクリプション[：:]\s*(.+)/);
    if (metaMatch) {
      sections.metaDescription = metaMatch[1].trim();
    }
    
    // 記事本文を抽出
    const contentMatch = text.match(/記事本文[：:]?([\s\S]*?)$/);
    if (contentMatch) {
      sections.articleContent = contentMatch[1].trim();
    } else {
      sections.articleContent = text;
    }
    
    return sections;
  }

  async insertInternalLinks(content) {
    console.log('🔗 内部リンク挿入中...');
    
    const internalLinks = [
      { text: 'AI活用の基礎知識', url: '/blog/ai-basics-guide/' },
      { text: 'マーケティング成功事例', url: '/blog/marketing-success-cases/' },
      { text: '最新AIツール比較', url: '/blog/ai-tools-comparison/' },
      { text: 'お問い合わせはこちら', url: '/contact/' },
      { text: '無料相談を申し込む', url: '/consultation/' }
    ];
    
    let modifiedContent = content.content;
    
    // {{INTERNAL_LINK:xxx}}形式を実際のリンクに変換
    modifiedContent = modifiedContent.replace(/\{\{INTERNAL_LINK:([^}]+)\}\}/g, (match, linkText) => {
      const link = internalLinks.find(l => l.text.includes(linkText)) || internalLinks[0];
      return `[${link.text}](${link.url})`;
    });
    
    return { ...content, content: modifiedContent };
  }

  async insertImagePlaceholders(content) {
    console.log('🖼️ 画像プレースホルダー挿入中...');
    
    let finalContent = content.content;
    
    // プレースホルダー画像のURLリスト
    const placeholderImages = [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&h=630&fit=crop', // レストラン内装
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=630&fit=crop', // レストランインテリア
      'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200&h=630&fit=crop', // 料理
      'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200&h=630&fit=crop', // シェフ
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&h=630&fit=crop'  // 食材
    ];
    
    // {{IMAGE:xxx}}形式を実際の画像URLに変換
    let imageCount = 0;
    finalContent = finalContent.replace(/\{\{IMAGE:([^}]+)\}\}/g, (match, altText) => {
      const imageUrl = placeholderImages[imageCount % placeholderImages.length];
      imageCount++;
      return `\n\n![${altText}](${imageUrl})\n\n`;
    });
    
    // 各h2の後に画像がない場合は自動挿入
    finalContent = finalContent.replace(/^## (.+)$/gm, (match, heading) => {
      const nextLineMatch = finalContent.substring(finalContent.indexOf(match) + match.length).match(/^\n*!\[/);
      if (!nextLineMatch) {
        const imageUrl = placeholderImages[imageCount % placeholderImages.length];
        imageCount++;
        return `${match}\n\n![${heading}のイメージ画像](${imageUrl})`;
      }
      return match;
    });
    
    return { ...content, content: finalContent };
  }

  async savePost(content) {
    const date = new Date();
    const dateStr = date.toISOString().split('T')[0];
    const slug = this.keyword
      .replace(/[【】「」『』（）]/g, '')
      .replace(/\s+/g, '-')
      .toLowerCase()
      .substring(0, 50);
    
    const filename = `${dateStr}-gemini-${slug}.md`;
    const filepath = path.join(this.postsDir, filename);
    
    const frontMatter = `---
layout: blog-post
title: "${content.title}"
date: ${date.toISOString()}
categories: [${this.category}]
tags: [${this.keyword}, Gemini生成, SEO最適化]
description: "${content.description}"
author: "Gemini Generator"
image: "/assets/images/blog/placeholder-1.jpg"
featured: false
reading_time: ${Math.ceil(content.content.length / 500)}
gemini_generated: true
---

`;
    
    const fullContent = frontMatter + content.content;
    
    await fs.mkdir(this.postsDir, { recursive: true });
    await fs.writeFile(filepath, fullContent, 'utf-8');
    
    return filename;
  }

  async updateStats(filename, title) {
    const statsFile = path.join(this.dataDir, 'gemini-blog-stats.json');
    
    let stats = {
      totalPosts: 0,
      monthlyPosts: {},
      lastGenerated: null
    };
    
    try {
      const existing = await fs.readFile(statsFile, 'utf-8');
      stats = JSON.parse(existing);
    } catch (error) {
      // ファイルが存在しない場合は初期値を使用
    }
    
    const month = new Date().toISOString().substring(0, 7);
    
    stats.totalPosts++;
    stats.monthlyPosts[month] = (stats.monthlyPosts[month] || 0) + 1;
    stats.lastGenerated = {
      date: new Date().toISOString(),
      filename,
      title,
      keyword: this.keyword
    };
    
    await fs.mkdir(this.dataDir, { recursive: true });
    await fs.writeFile(statsFile, JSON.stringify(stats, null, 2), 'utf-8');
  }
}

// CLIとして実行
if (require.main === module) {
  const keyword = process.argv[2] || process.env.BLOG_KEYWORD || 'AIマーケティング 自動化';
  const category = process.env.BLOG_CATEGORY || 'AIマーケティング';
  const customTitle = process.env.BLOG_TITLE || null;
  
  const generator = new GeminiBlogGenerator({ 
    geminiApiKey: process.env.GEMINI_API_KEY,
    keyword,
    category,
    customTitle,
    targetLength: 3000
  });
  
  generator.generateBlogPost()
    .then(result => {
      if (result.success) {
        console.log(`\n✅ 記事生成成功: ${result.title}`);
        console.log(`📄 ファイル: ${result.filename}`);
      } else {
        console.error(`\n❌ 生成失敗: ${result.error}`);
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('\n❌ 予期しないエラー:', error);
      process.exit(1);
    });
}

module.exports = GeminiBlogGenerator;