#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');
const sharp = require('sharp');
const { randomUUID } = require('crypto');

class ClaudeBlogGenerator {
  constructor(config) {
    this.apiKey = config.anthropicApiKey;
    this.keyword = config.keyword;
    this.targetLength = config.targetLength || 3000;
    this.category = config.category || 'AIマーケティング';
    this.customTitle = config.customTitle || null;
    this.imageApiKey = config.unsplashApiKey || process.env.UNSPLASH_API_KEY;
    this.postsDir = path.join(__dirname, '../../_posts');
    this.imagesDir = path.join(__dirname, '../../assets/images/blog');
    this.dataDir = path.join(__dirname, '../../_data/blog');
  }

  async generateBlogPost() {
    console.log(`🚀 ブログ記事生成開始: ${this.keyword}`);
    
    try {
      // 1. 過去の記事を分析してコンテキストを構築
      const context = await this.buildContext();
      
      // 2. 高品質なコンテンツを生成
      const content = await this.generateContent(context);
      
      // 3. 内部リンクを挿入
      const linkedContent = await this.insertInternalLinks(content);
      
      // 4. 画像を生成・配置
      const finalContent = await this.insertImages(linkedContent);
      
      // 5. ファイルを保存
      const filename = await this.savePost(finalContent);
      
      // 6. 統計を更新
      await this.updateStats(filename, finalContent.title);
      
      console.log(`✅ ブログ記事生成完了: ${filename}`);
      return { success: true, filename, title: finalContent.title };
      
    } catch (error) {
      console.error('❌ ブログ生成エラー:', error);
      return { success: false, error: error.message };
    }
  }

  async buildContext() {
    console.log('📚 コンテキスト構築中...');
    
    // 過去の記事からコンテキストを構築
    const files = await fs.readdir(this.postsDir);
    const recentPosts = files
      .filter(f => f.endsWith('.md'))
      .sort((a, b) => b.localeCompare(a))
      .slice(0, 10);
    
    const postTitles = [];
    for (const file of recentPosts) {
      const content = await fs.readFile(path.join(this.postsDir, file), 'utf-8');
      const titleMatch = content.match(/^title:\s*"([^"]+)"/m);
      if (titleMatch) {
        postTitles.push({
          filename: file,
          title: titleMatch[1],
          url: `/blog/${file.replace('.md', '').replace(/^\d{4}-\d{2}-\d{2}-/, '')}/`
        });
      }
    }
    
    return { recentPosts: postTitles };
  }

  async generateContent(context) {
    console.log('✍️ SEO最適化コンテンツ生成中...');
    
    // SEOプロンプトをロード
    const { generateSEOPrompt } = require('./seo-writing-prompts.js');
    
    const systemPrompt = generateSEOPrompt(this.keyword, {
      targetAudience: '企業の意思決定者、マーケティング担当者',
      contentType: this.detectContentType(this.keyword),
      wordCount: this.targetLength
    });

    const userPrompt = `キーワード「${this.keyword}」について、SEO最適化された記事を作成してください。

参考情報:
${context.recentPosts.length > 0 ? `最近の記事:\n${context.recentPosts.map(p => `- ${p.title}`).join('\n')}` : ''}

以下の形式で出力してください:

1. 検索意図分析（200文字程度）
2. タイトル案5つ（各案にSEOスコアを付記）
3. 選択タイトル: [最高スコアのタイトル]
4. メタディスクリプション: [120-150文字]
5. 記事本文（2500-3000文字、指定構成に従う）`;

    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-3-opus-20240229',
        max_tokens: 4000,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }]
      },
      {
        headers: {
          'X-API-Key': this.apiKey,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json'
        }
      }
    );

    const generatedText = response.data.content[0].text;
    
    // SEO最適化された出力を解析
    const sections = this.parseGeneratedContent(generatedText);
    
    // タイトル選択（最高スコアのものを使用）
    let selectedTitle = sections.selectedTitle || `${this.keyword}完全ガイド`;
    
    // カスタムタイトルが指定されている場合は使用
    if (this.customTitle) {
      selectedTitle = this.customTitle;
    }
    
    const description = sections.metaDescription || selectedTitle.substring(0, 150);
    const content = sections.articleContent || generatedText;
    
    return { 
      title: selectedTitle, 
      description, 
      content,
      rawContent: generatedText,
      searchIntent: sections.searchIntent,
      titleCandidates: sections.titleCandidates
    };
  }

  detectContentType(keyword) {
    // キーワードから検索意図のタイプを推測
    if (/比較|選び方|おすすめ|ランキング/.test(keyword)) {
      return 'commercial';
    } else if (/購入|申込|契約|導入/.test(keyword)) {
      return 'transactional';
    } else if (/使い方|方法|手順|設定/.test(keyword)) {
      return 'navigational';
    }
    return 'informational';
  }

  parseGeneratedContent(text) {
    const sections = {
      searchIntent: '',
      titleCandidates: [],
      selectedTitle: '',
      metaDescription: '',
      articleContent: ''
    };

    // 検索意図分析を抽出
    const intentMatch = text.match(/1\.\s*検索意図分析[：:]\s*([^2]+)/s);
    if (intentMatch) {
      sections.searchIntent = intentMatch[1].trim();
    }

    // タイトル案を抽出
    const titleSection = text.match(/2\.\s*タイトル案[^3]+/s);
    if (titleSection) {
      const titleMatches = titleSection[0].match(/[「『]([^」』]+)[」』]/g);
      if (titleMatches) {
        sections.titleCandidates = titleMatches.map(t => t.replace(/[「『」』]/g, ''));
      }
    }

    // 選択タイトルを抽出
    const selectedMatch = text.match(/3\.\s*選択タイトル[：:]\s*(.+)/);
    if (selectedMatch) {
      sections.selectedTitle = selectedMatch[1].trim().replace(/[\[「『\]」』]/g, '');
    } else if (sections.titleCandidates.length > 0) {
      sections.selectedTitle = sections.titleCandidates[0];
    }

    // メタディスクリプションを抽出
    const metaMatch = text.match(/4\.\s*メタディスクリプション[：:]\s*(.+)/);
    if (metaMatch) {
      sections.metaDescription = metaMatch[1].trim().replace(/[\[「『\]」』]/g, '');
    }

    // 記事本文を抽出
    const contentMatch = text.match(/5\.\s*記事本文[：:]?\s*([\s\S]+)$/);
    if (contentMatch) {
      sections.articleContent = contentMatch[1].trim();
    } else {
      // フォールバック: ##から始まる部分を本文とする
      const contentStart = text.indexOf('##');
      if (contentStart > -1) {
        sections.articleContent = text.substring(contentStart);
      }
    }

    return sections;
  }

  async insertInternalLinks(content) {
    console.log('🔗 内部リンク挿入中...');
    
    const { recentPosts } = await this.buildContext();
    let linkedContent = content.content;
    
    // {{INTERNAL_LINK:トピック}}を実際のリンクに置換
    const linkMatches = linkedContent.match(/\{\{INTERNAL_LINK:([^}]+)\}\}/g) || [];
    
    for (const match of linkMatches) {
      const topic = match.match(/\{\{INTERNAL_LINK:([^}]+)\}\}/)[1];
      
      // 関連する記事を探す
      const relatedPost = recentPosts.find(p => 
        p.title.includes(topic) || 
        topic.split(/[、,]/).some(t => p.title.includes(t.trim()))
      );
      
      if (relatedPost) {
        const link = `[${topic}](${relatedPost.url})`;
        linkedContent = linkedContent.replace(match, link);
      } else {
        // 関連記事がない場合はトピックのみ表示
        linkedContent = linkedContent.replace(match, topic);
      }
    }
    
    return { ...content, content: linkedContent };
  }

  async insertImages(content) {
    console.log('🖼️ 画像生成・配置中...');
    
    let finalContent = content.content;
    const imageMatches = finalContent.match(/\{\{IMAGE:([^}]+)\}\}/g) || [];
    
    for (let i = 0; i < imageMatches.length; i++) {
      const match = imageMatches[i];
      const description = match.match(/\{\{IMAGE:([^}]+)\}\}/)[1];
      
      try {
        // Unsplash APIから画像を取得
        const imageUrl = await this.fetchImage(description);
        const imagePath = await this.downloadAndSaveImage(imageUrl, i);
        
        // マークダウン形式の画像タグに置換
        const imageTag = `\n\n![${description}](${imagePath})\n\n`;
        finalContent = finalContent.replace(match, imageTag);
        
      } catch (error) {
        console.warn(`画像取得エラー: ${description}`, error.message);
        finalContent = finalContent.replace(match, '');
      }
    }
    
    return { ...content, content: finalContent };
  }

  async fetchImage(query) {
    try {
      const response = await axios.get('https://api.unsplash.com/search/photos', {
        params: {
          query: `${query} business professional`,
          per_page: 1,
          orientation: 'landscape'
        },
        headers: {
          'Authorization': `Client-ID ${this.imageApiKey}`
        }
      });
      
      if (response.data.results.length > 0) {
        return response.data.results[0].urls.regular;
      }
      
      // フォールバック: プレースホルダー画像
      return `https://via.placeholder.com/1200x630?text=${encodeURIComponent(query)}`;
      
    } catch (error) {
      console.warn('Unsplash API error:', error.message);
      return `https://via.placeholder.com/1200x630?text=${encodeURIComponent(query)}`;
    }
  }

  async downloadAndSaveImage(url, index) {
    const date = new Date().toISOString().split('T')[0];
    const filename = `${date}-${this.keyword.replace(/\s+/g, '-')}-${index}.jpg`;
    const filepath = path.join(this.imagesDir, filename);
    
    try {
      // ディレクトリを作成
      await fs.mkdir(this.imagesDir, { recursive: true });
      
      // 画像をダウンロード
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      
      // 画像を最適化して保存
      await sharp(Buffer.from(response.data))
        .resize(1200, 630, { fit: 'cover' })
        .jpeg({ quality: 85 })
        .toFile(filepath);
      
      return `/assets/images/blog/${filename}`;
      
    } catch (error) {
      console.warn('画像保存エラー:', error.message);
      return url; // 元のURLを返す
    }
  }

  async savePost(content) {
    const date = new Date();
    const dateStr = date.toISOString().split('T')[0];
    const slug = content.title
      .replace(/[【】「」『』（）]/g, '')
      .replace(/\s+/g, '-')
      .toLowerCase()
      .substring(0, 50);
    
    const filename = `${dateStr}-${slug}.md`;
    const filepath = path.join(this.postsDir, filename);
    
    const frontMatter = `---
layout: blog-post
title: "${content.title}"
date: ${date.toISOString()}
categories: [${this.category}]
tags: [${this.keyword}, AI活用, マーケティング, 業務効率化]
description: "${content.description}"
author: "LeadFive AI"
image: "/assets/images/blog/${dateStr}-${this.keyword.replace(/\s+/g, '-')}-0.jpg"
featured: true
reading_time: ${Math.ceil(content.content.length / 500)}
---

`;
    
    const fullContent = frontMatter + content.content;
    
    await fs.mkdir(this.postsDir, { recursive: true });
    await fs.writeFile(filepath, fullContent, 'utf-8');
    
    return filename;
  }

  async generateContentPreview() {
    // プレビュー用のコンテンツ生成（ファイル保存なし）
    const context = await this.buildContext();
    const content = await this.generateContent(context);
    return content;
  }

  async updateStats(filename, title) {
    const statsFile = path.join(this.dataDir, 'blog-stats.json');
    
    let stats = {
      totalPosts: 0,
      monthlyPosts: {},
      keywords: {},
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
    stats.keywords[this.keyword] = (stats.keywords[this.keyword] || 0) + 1;
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
  const keyword = process.argv[2] || process.env.BLOG_KEYWORD;
  
  if (!keyword) {
    console.error('❌ キーワードを指定してください');
    console.error('使用方法: node claude-blog-generator.js "キーワード"');
    process.exit(1);
  }
  
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('❌ ANTHROPIC_API_KEY環境変数が設定されていません');
    process.exit(1);
  }
  
  const generator = new ClaudeBlogGenerator({
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    keyword,
    unsplashApiKey: process.env.UNSPLASH_API_KEY
  });
  
  generator.generateBlogPost()
    .then(result => {
      if (result.success) {
        console.log(`✅ 成功: ${result.title}`);
        process.exit(0);
      } else {
        console.error(`❌ 失敗: ${result.error}`);
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('❌ 予期しないエラー:', error);
      process.exit(1);
    });
}

module.exports = ClaudeBlogGenerator;