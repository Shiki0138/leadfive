#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');
const sharp = require('sharp');
const { randomUUID } = require('crypto');
const { fetchUnsplashImage } = require('../fetch-unsplash-image');
const { generateUniqueImage } = require('../generate-unique-image');

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
      console.error('❌ ブログ生成エラー:', error.message);
      if (error.response && error.response.data) {
        console.error('API エラー詳細:', JSON.stringify(error.response.data, null, 2));
      }
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
        model: 'claude-3-5-sonnet-20241022',
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

  generateImageQuery(keyword) {
    // キーワードに基づいて適切な画像検索クエリを生成
    const keywordLower = keyword.toLowerCase();
    
    // マーケティング関連のマッピング
    const imageMapping = {
      'ai': 'artificial intelligence technology digital',
      'データ分析': 'data analytics dashboard charts',
      'マーケティング': 'digital marketing strategy business',
      '戦略': 'business strategy planning meeting',
      'デジタル': 'digital transformation technology',
      '自動化': 'automation workflow process',
      'dx': 'digital transformation office',
      '成功事例': 'business success growth chart',
      'ツール': 'software tools dashboard',
      'ノウハウ': 'knowledge sharing team collaboration',
      'トレンド': 'trending technology innovation',
      '基礎': 'education learning concept',
      '統合': 'integration connection network'
    };
    
    // キーワードに含まれる単語をチェック
    for (const [key, value] of Object.entries(imageMapping)) {
      if (keyword.includes(key)) {
        return value;
      }
    }
    
    // デフォルトはビジネス関連の汎用的なクエリ
    return 'modern business technology office';
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
    console.log('🔗 リンク処理中...');
    
    const { recentPosts } = await this.buildContext();
    let linkedContent = content.content;
    let internalLinkCount = 0;
    
    // {{INTERNAL_LINK:トピック}}を実際のリンクに置換（最大3本）
    const linkMatches = linkedContent.match(/\{\{INTERNAL_LINK:([^}]+)\}\}/g) || [];
    
    for (const match of linkMatches) {
      if (internalLinkCount >= 3) {
        // 3本を超える場合は削除
        linkedContent = linkedContent.replace(match, '');
        continue;
      }
      
      const topic = match.match(/\{\{INTERNAL_LINK:([^}]+)\}\}/)[1];
      
      // 関連する記事を探す
      const relatedPost = recentPosts.find(p => 
        p.title.includes(topic) || 
        topic.split(/[、,]/).some(t => p.title.includes(t.trim()))
      );
      
      if (relatedPost) {
        const link = `[${topic}](${relatedPost.url})`;
        linkedContent = linkedContent.replace(match, link);
        internalLinkCount++;
      } else {
        // 関連記事がない場合は削除
        linkedContent = linkedContent.replace(match, '');
      }
    }
    
    // 外部リンクの例（最大2本）
    const externalLinks = [
      { text: '経済産業省DXレポート', url: 'https://www.meti.go.jp/policy/it_policy/dx/dx.html' },
      { text: 'Google AI責任原則', url: 'https://ai.google/responsibility/principles/' }
    ];
    
    // {{EXTERNAL_LINK:xxx}}形式を処理
    let externalLinkCount = 0;
    linkedContent = linkedContent.replace(/\{\{EXTERNAL_LINK:([^}]+)\}\}/g, (match, linkText) => {
      if (externalLinkCount < 2) {
        externalLinkCount++;
        const link = externalLinks[externalLinkCount - 1];
        return `[${link.text}](${link.url})`;
      }
      return '';
    });
    
    return { ...content, content: linkedContent };
  }

  async insertImages(content) {
    console.log('🖼️ 画像プレースホルダーを処理中...');
    
    let processedContent = content.content;
    const imageMatches = processedContent.match(/\{\{IMAGE:([^}]+)\}\}/g) || [];
    const usedImages = new Set();
    
    // 過去7日間の使用履歴を読み込み
    const weeklyImageHistory = await this.loadWeeklyImageHistory();
    
    for (let i = 0; i < imageMatches.length; i++) {
      const match = imageMatches[i];
      const imageDescription = match.match(/\{\{IMAGE:([^}]+)\}\}/)[1];
      
      // 同一記事内で使用済みの場合は削除
      if (usedImages.has(imageDescription)) {
        processedContent = processedContent.replace(match, '');
        continue;
      }
      
      // 画像を取得
      const imageUrl = await this.fetchImageForSection(imageDescription, weeklyImageHistory);
      if (imageUrl) {
        // 画像をダウンロードして保存
        const localPath = await this.downloadAndSaveImage(imageUrl, i + 1);
        processedContent = processedContent.replace(match, `\n\n![${imageDescription}](${localPath})\n\n`);
        usedImages.add(imageDescription);
        
        // 履歴を更新
        await this.updateWeeklyImageHistory(imageUrl, imageDescription);
      } else {
        // 画像が見つからない場合は削除
        processedContent = processedContent.replace(match, '');
      }
    }
    
    return { ...content, content: processedContent };
  }

  async fetchImageForSection(description, weeklyHistory) {
    try {
      // セクション内容に基づいた検索クエリを生成
      const imageQuery = this.generateSectionImageQuery(description);
      
      // 過去7日間に使用した画像IDを除外
      const excludeIds = weeklyHistory
        .filter(h => new Date(h.used_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
        .map(h => h.photo_id);
      
      const response = await axios.get('https://api.unsplash.com/search/photos', {
        params: {
          query: imageQuery,
          per_page: 10, // 複数取得して選択
          orientation: 'landscape'
        },
        headers: {
          'Authorization': `Client-ID ${this.imageApiKey}`
        }
      });
      
      // 使用済みでない画像を選択
      const availableImages = response.data.results.filter(
        img => !excludeIds.includes(img.id)
      );
      
      if (availableImages.length > 0) {
        return availableImages[0].urls.regular;
      }
      
      return null;
      
    } catch (error) {
      console.warn('Unsplash API error:', error.message);
      return null;
    }
  }

  generateSectionImageQuery(description) {
    // セクションの説明から適切な検索クエリを生成
    const sectionMapping = {
      '成功事例': 'business success celebration team',
      '実践方法': 'business workflow process diagram',
      'データ分析': 'data visualization analytics dashboard',
      '戦略': 'business strategy planning meeting',
      'ツール': 'modern software dashboard interface',
      '課題解決': 'problem solving teamwork office',
      'ベネフィット': 'business growth chart success',
      'トレンド': 'technology trends innovation future',
      'ワークフロー': 'efficient workflow automation',
      'コラボレーション': 'team collaboration modern office'
    };
    
    for (const [key, value] of Object.entries(sectionMapping)) {
      if (description.includes(key)) {
        return value;
      }
    }
    
    // デフォルト
    return 'professional business modern office';
  }

  async loadWeeklyImageHistory() {
    const historyPath = path.join(__dirname, '../../logs/weekly-image-history.json');
    try {
      const data = await fs.readFile(historyPath, 'utf-8');
      return JSON.parse(data);
    } catch (e) {
      return [];
    }
  }

  async updateWeeklyImageHistory(imageUrl, description) {
    const historyPath = path.join(__dirname, '../../logs/weekly-image-history.json');
    const history = await this.loadWeeklyImageHistory();
    
    // URLから画像IDを抽出
    const photoIdMatch = imageUrl.match(/photo-([\w-]+)/);
    const photoId = photoIdMatch ? photoIdMatch[1] : imageUrl;
    
    history.push({
      photo_id: photoId,
      used_at: new Date().toISOString(),
      description: description,
      url: imageUrl
    });
    
    // 7日以上古いエントリを削除
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentHistory = history.filter(h => new Date(h.used_at) > sevenDaysAgo);
    
    await fs.mkdir(path.dirname(historyPath), { recursive: true });
    await fs.writeFile(historyPath, JSON.stringify(recentHistory, null, 2));
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

    // タイトル直下に表示するアイキャッチ画像を用意
    const featuredFilename = `${dateStr}-${slug}-featured.jpg`;
    const featuredPathFs = path.join(this.imagesDir, featuredFilename);
    const featuredPathWeb = `/assets/images/blog/${featuredFilename}`;

    // 直近7日間のUnsplash使用履歴から重複を避ける
    const usageLogPath = path.join(__dirname, '../../logs/unsplash-usage.json');
    let used = [];
    try {
      const raw = await fs.readFile(usageLogPath, 'utf-8');
      used = JSON.parse(raw);
    } catch (e) {
      // ログファイルがない場合は空配列で続行
      console.log('Unsplash使用履歴ファイルが見つかりません。新規作成します。');
    }
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentIds = new Set(
      used.filter(u => new Date(u.used_at) >= sevenDaysAgo).map(u => u.photo_id)
    );

    let selectedPhotoId = null;
    try {
      await fs.mkdir(this.imagesDir, { recursive: true });
      const result = await fetchUnsplashImage(this.keyword, featuredPathFs, { excludePhotoIds: recentIds });
      if (result && result.credit && result.credit.photo_id) {
        selectedPhotoId = result.credit.photo_id;
      }
    } catch (e) {
      console.warn('Unsplash取得に失敗。フォールバック画像を生成します:', e.message);
    }

    if (!selectedPhotoId) {
      // フォールバック：ユニーク画像を生成
      await generateUniqueImage(content.title, dateStr, featuredPathFs);
      selectedPhotoId = `generated-${randomUUID()}`;
    }

    // 使用履歴を更新（最新のみ保持し7日以前は整理）
    const newUsage = used.filter(u => new Date(u.used_at) >= sevenDaysAgo);
    newUsage.push({
      photo_id: selectedPhotoId,
      used_at: date.toISOString(),
      path: featuredPathWeb,
      post: filename
    });
    await fs.mkdir(path.dirname(usageLogPath), { recursive: true });
    await fs.writeFile(usageLogPath, JSON.stringify(newUsage, null, 2));
    
    const frontMatter = `---
layout: blog-post
title: "${content.title}"
date: ${date.toISOString()}
categories: [${this.category}]
tags: [${this.keyword}, AI活用, マーケティング, 業務効率化]
description: "${content.description}"
author: "LeadFive AI"
image: "${featuredPathWeb}"
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
