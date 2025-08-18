#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');
const { randomUUID } = require('crypto');

class GeminiBlogGenerator {
  constructor(config) {
    this.apiKey = config.geminiApiKey || process.env.GEMINI_API_KEY;
    this.keyword = config.keyword;
    this.targetLength = config.targetLength || 3000; // デフォルト3000文字
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
      
      // 6. Unsplash画像を取得（オプション）
      if (process.env.UNSPLASH_API_KEY) {
        const { fetchUnsplashImage } = require('../fetch-unsplash-image');
        const date = new Date().toISOString().split('T')[0];
        const imagePath = path.join(this.imagesDir, `${date}-unsplash-featured.jpg`);
        
        console.log('🎨 Unsplash画像を取得中...');
        const imageResult = await fetchUnsplashImage(this.keyword, imagePath);
        
        if (imageResult) {
          // 記事を更新して画像パスを追加
          const postPath = path.join(this.postsDir, filename);
          let postContent = await fs.readFile(postPath, 'utf-8');
          
          // 画像パスを更新
          const relativeImagePath = `/assets/images/blog/${path.basename(imagePath)}`;
          postContent = postContent.replace(/^image:.*$/m, `image: ${relativeImagePath}`);
          
          // クレジット情報を追加
          if (imageResult.credit) {
            postContent += `\n\n---\n\n*Photo by [${imageResult.credit.photographer}](${imageResult.credit.photographer_url}) on [Unsplash](https://unsplash.com)*`;
          }
          
          await fs.writeFile(postPath, postContent, 'utf-8');
          console.log('✅ Unsplash画像を記事に追加しました');
        }
      }
      
      // 7. 統計を更新
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
5. 記事本文（2500-3500文字、完全版、省略なし）

注意事項:
- 記事本文は必ず2500文字以上3500文字以下で生成すること
- 2500文字を下回ることは絶対にNG
- 各セクションで十分な情報量を確保し、読者に価値を提供すること`;

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
          maxOutputTokens: 10000, // 十分な長さを確保
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
    console.log('🔗 リンク処理中...');
    
    let modifiedContent = content.content;
    
    // 既存の記事を確認して内部リンクを設定（最大3本）
    try {
      const posts = await fs.readdir(this.postsDir);
      const mdPosts = posts.filter(f => f.endsWith('.md') && !f.includes('mock'));
      
      if (mdPosts.length > 1) {
        // ランダムに1-2本の内部リンクを設定
        const linkCount = Math.min(2, mdPosts.length - 1);
        const selectedPosts = mdPosts
          .sort(() => Math.random() - 0.5)
          .slice(0, linkCount);
        
        for (const post of selectedPosts) {
          const postContent = await fs.readFile(path.join(this.postsDir, post), 'utf-8');
          const titleMatch = postContent.match(/^title: "(.+)"/m);
          if (titleMatch) {
            const title = titleMatch[1];
            // permalinkフォーマット: /blog/:year/:month/:day/:title/
            const dateMatch = post.match(/^(\d{4})-(\d{2})-(\d{2})-(.+)\.md$/);
            let url = '#';
            if (dateMatch) {
              const [_, year, month, day, slug] = dateMatch;
              url = `/blog/${year}/${month}/${day}/${slug}/`;
            }
            // 適切な位置に内部リンクを挿入
            modifiedContent = modifiedContent.replace(
              /{{INTERNAL_LINK:[^}]+}}/,
              `[${title}](${url})`
            );
          }
        }
      }
    } catch (error) {
      console.log('内部リンク設定をスキップ');
    }
    
    // {{INTERNAL_LINK:xxx}}の残りを削除
    modifiedContent = modifiedContent.replace(/\{\{INTERNAL_LINK:[^}]+\}\}/g, '');
    
    // 外部リンクの例（最大2本）
    const externalLinks = [
      { text: 'Google AIの最新動向', url: 'https://ai.google/updates/' },
      { text: '総務省AIガイドライン', url: 'https://www.soumu.go.jp/main_sosiki/joho_tsusin/ai/' }
    ];
    
    // {{EXTERNAL_LINK:xxx}}形式を処理
    let externalLinkCount = 0;
    modifiedContent = modifiedContent.replace(/\{\{EXTERNAL_LINK:([^}]+)\}\}/g, (match, linkText) => {
      if (externalLinkCount < 2) {
        externalLinkCount++;
        const link = externalLinks[externalLinkCount - 1];
        return `[${link.text}](${link.url})`;
      }
      return '';
    });
    
    return { ...content, content: modifiedContent };
  }

  async fetchDynamicImage(altText, usedImageIds, imageHistory) {
    try {
      const { fetchUnsplashImage } = require('../fetch-unsplash-image.js');
      
      // altTextから検索キーワードを生成
      const searchKeyword = altText.replace(/のイメージ画像|の画像|画像/g, '').trim();
      
      // 一時的な画像パスを生成
      const tempImagePath = path.join(this.imagesDir, `temp-${Date.now()}.jpg`);
      
      // Unsplashから画像を取得
      const result = await fetchUnsplashImage(searchKeyword, tempImagePath);
      
      if (result && result.credit && result.credit.photo_id) {
        // 過去30日以内に使用された画像は除外
        const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
        const recentlyUsed = imageHistory.some(img => 
          img.photo_id === result.credit.photo_id && 
          new Date(img.used_at).getTime() > thirtyDaysAgo
        );
        
        if (!recentlyUsed && !usedImageIds.has(result.credit.photo_id)) {
          usedImageIds.add(result.credit.photo_id);
          
          // 画像履歴に追加
          imageHistory.push({
            photo_id: result.credit.photo_id,
            used_at: new Date().toISOString(),
            keyword: searchKeyword
          });
          
          // 画像URLを返す（実際のUnsplash画像URL）
          const imageResponse = await axios.get(result.credit.download_location, {
            headers: {
              'Authorization': `Client-ID ${process.env.UNSPLASH_API_KEY || process.env.UNSPLASH_ACCESS_KEY}`
            }
          });
          
          // 一時ファイルを削除
          try {
            await fs.unlink(tempImagePath);
          } catch (e) {}
          
          // Unsplashの画像URLを直接返す
          return `https://images.unsplash.com/photo-${result.credit.photo_id}?w=1200&h=630&fit=crop`;
        }
      }
      
      // 重複の場合は別の画像を試す
      return this.getRandomStockImage();
    } catch (error) {
      console.error('画像取得エラー:', error);
      return this.getRandomStockImage();
    }
  }
  
  getRandomStockImage() {
    // フォールバック用のストック画像
    const stockImages = [
      'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1200&h=630&fit=crop', // ラップトップ
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&h=630&fit=crop', // テクノロジー
      'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1200&h=630&fit=crop', // データ分析
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=630&fit=crop', // ビジネスデータ
      'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&h=630&fit=crop'  // オフィス
    ];
    return stockImages[Math.floor(Math.random() * stockImages.length)];
  }
  
  async saveImageHistory(imageHistory, usedImageIds) {
    try {
      // 履歴を最新100件に制限
      const updatedHistory = imageHistory.slice(-100);
      await fs.writeFile(
        path.join(this.dataDir, 'used-images.json'), 
        JSON.stringify(updatedHistory, null, 2)
      );
    } catch (error) {
      console.error('画像履歴保存エラー:', error);
    }
  }

  async insertImagePlaceholders(content) {
    console.log('🖼️ 画像プレースホルダー挿入中...');
    
    let finalContent = content.content;
    
    // 使用済み画像を追跡（重複を避ける）
    const usedImageIds = new Set();
    
    // 保存された画像履歴を読み込み
    const imageHistoryPath = path.join(this.dataDir, 'used-images.json');
    let imageHistory = [];
    try {
      const historyData = await fs.readFile(imageHistoryPath, 'utf-8');
      imageHistory = JSON.parse(historyData);
    } catch (e) {
      // ファイルが存在しない場合は空配列
    }
    
    // {{IMAGE:xxx}}形式を動的に取得した画像URLに変換
    const imageMatches = [...finalContent.matchAll(/\{\{IMAGE:([^}]+)\}\}/g)];
    const imagePromises = [];
    
    // 各画像プレースホルダーに対して画像を取得
    for (const match of imageMatches) {
      const altText = match[1];
      imagePromises.push(this.fetchDynamicImage(altText, usedImageIds, imageHistory));
    }
    
    const fetchedImages = await Promise.all(imagePromises);
    
    // 取得した画像で置換
    let imageIndex = 0;
    finalContent = finalContent.replace(/\{\{IMAGE:([^}]+)\}\}/g, (match, altText) => {
      const imageUrl = fetchedImages[imageIndex] || this.getRandomStockImage();
      imageIndex++;
      return `\n\n![${altText}](${imageUrl})\n\n`;
    });
    
    // 各h2の後に画像がない場合は自動挿入
    const headingMatches = [...finalContent.matchAll(/^## (.+)$/gm)];
    const headingImagePromises = [];
    
    for (const match of headingMatches) {
      const heading = match[1];
      const matchIndex = match.index;
      const nextContent = finalContent.substring(matchIndex + match[0].length);
      const hasImage = nextContent.match(/^\n*!\[/);
      
      if (!hasImage) {
        headingImagePromises.push(this.fetchDynamicImage(heading, usedImageIds, imageHistory));
      }
    }
    
    const headingImages = await Promise.all(headingImagePromises);
    let headingImageIndex = 0;
    
    finalContent = finalContent.replace(/^## (.+)$/gm, (match, heading, offset) => {
      const nextContent = finalContent.substring(offset + match.length);
      const hasImage = nextContent.match(/^\n*!\[/);
      
      if (!hasImage && headingImageIndex < headingImages.length) {
        const imageUrl = headingImages[headingImageIndex] || this.getRandomStockImage();
        headingImageIndex++;
        return `${match}\n\n![${heading}のイメージ画像](${imageUrl})`;
      }
      return match;
    });
    
    // 使用した画像を履歴に保存
    await this.saveImageHistory(imageHistory, usedImageIds);
    
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
    targetLength: 3000 // 2500-3500文字の中間値
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