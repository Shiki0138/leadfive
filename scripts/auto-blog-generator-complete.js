#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const axios = require('axios');
const sharp = require('sharp');
const yaml = require('js-yaml');
const BlogAIAssistant = require('../blog-ai-assistant');

const ROOT_DIR = path.join(__dirname, '..');
const CONTENT_CALENDAR_PATH = path.join(ROOT_DIR, '_data', 'blog', 'content-calendar.yml');
const USED_IMAGES_PATH = path.join(ROOT_DIR, 'logs', 'used-images.json');
const AUTO_POST_STATS_PATH = path.join(ROOT_DIR, 'logs', 'auto-posts.json');
const POSTS_DIR = path.join(ROOT_DIR, '_posts');
const BLOG_IMAGE_DIR = path.join(ROOT_DIR, 'assets', 'images', 'blog');

// Gemini API設定
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const DEFAULT_GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-pro-latest';
const FALLBACK_GEMINI_MODEL = process.env.GEMINI_FALLBACK_MODEL || 'gemini-1.5-flash';

// AIアシスタントのインスタンス
const aiAssistant = new BlogAIAssistant();

// 設定ファイルの読み込み
async function loadConfig() {
  try {
    const contentCalendar = await fs.readFile(CONTENT_CALENDAR_PATH, 'utf8');
    return yaml.load(contentCalendar);
  } catch (error) {
    console.error('設定ファイルの読み込みエラー:', error);
    return null;
  }
}

// 使用済み画像の追跡
async function loadUsedImages() {
  try {
    const data = await fs.readFile(USED_IMAGES_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return { images: [], lastUpdated: new Date().toISOString() };
  }
}

async function saveUsedImages(usedImages) {
  await fs.mkdir(path.dirname(USED_IMAGES_PATH), { recursive: true });
  await fs.writeFile(USED_IMAGES_PATH, JSON.stringify(usedImages, null, 2), 'utf8');
}

// Unsplash APIから画像を取得
async function fetchUnsplashImage(keywords, usedImageIds = []) {
  const UNSPLASH_API_KEY = process.env.UNSPLASH_API_KEY;
  
  if (!UNSPLASH_API_KEY) {
    console.log('⚠️ Unsplash API キーが設定されていません。デフォルト画像を使用します。');
    return null;
  }

  try {
    // キーワードマッピング
    const keywordMap = {
      'AI': ['artificial intelligence', 'AI technology', 'machine learning', 'neural network'],
      'マーケティング': ['digital marketing', 'marketing strategy', 'social media', 'branding'],
      '戦略': ['business strategy', 'strategic planning', 'business plan', 'innovation'],
      'データ分析': ['data analytics', 'data visualization', 'business intelligence', 'analytics'],
      '自動化': ['automation', 'workflow automation', 'AI automation', 'digital automation'],
      '成功事例': ['success story', 'case study', 'business success', 'achievement'],
      'トレンド': ['trends', 'future trends', 'emerging technology', 'innovation'],
      '美容': ['beauty salon', 'cosmetics', 'beauty treatment', 'spa'],
      '飲食店': ['restaurant', 'cafe', 'dining', 'hospitality'],
      '集客': ['customer acquisition', 'lead generation', 'marketing campaign', 'growth']
    };

    // 検索クエリの生成
    let searchQueries = [];
    keywords.forEach(keyword => {
      Object.entries(keywordMap).forEach(([jp, en]) => {
        if (keyword.includes(jp)) {
          searchQueries.push(...en);
        }
      });
    });

    if (searchQueries.length === 0) {
      searchQueries = ['business technology', 'digital innovation'];
    }

    const searchQuery = searchQueries[Math.floor(Math.random() * searchQueries.length)];
    const randomPage = Math.floor(Math.random() * 10) + 1;

    // Unsplash API呼び出し
    const response = await axios.get('https://api.unsplash.com/search/photos', {
      headers: {
        'Authorization': `Client-ID ${UNSPLASH_API_KEY}`
      },
      params: {
        query: searchQuery,
        per_page: 30,
        page: randomPage,
        orientation: 'landscape',
        content_filter: 'high'
      }
    });

    // 使用済みでない画像を選択
    const availablePhotos = response.data.results.filter(
      photo => !usedImageIds.includes(photo.id) && photo.likes > 10
    );

    if (availablePhotos.length === 0) {
      console.log('⚠️ 新しい画像が見つかりません。古い画像を再利用します。');
      return response.data.results[0];
    }

    // ランダムに画像を選択
    const selectedPhoto = availablePhotos[Math.floor(Math.random() * availablePhotos.length)];
    
    return {
      id: selectedPhoto.id,
      url: selectedPhoto.urls.regular,
      urls: selectedPhoto.urls,
      credit: {
        photographer: selectedPhoto.user.name,
        photographerUrl: selectedPhoto.user.links.html,
        unsplashUrl: selectedPhoto.links.html
      }
    };

  } catch (error) {
    console.error('Unsplash API エラー:', error.message);
    return null;
  }
}

// 画像のダウンロードと最適化
async function downloadAndOptimizeImage(imageData, outputPath) {
  try {
    const response = await axios.get(imageData.url, {
      responseType: 'arraybuffer'
    });

    // Sharp で画像を最適化（1200x630、ブログ用）
    await fs.mkdir(path.dirname(outputPath), { recursive: true });

    await sharp(Buffer.from(response.data))
      .resize(1200, 630, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 85 })
      .toFile(outputPath);

    // クレジット情報を保存
    const creditPath = outputPath.replace('.jpg', '-credit.json');
    await fs.writeFile(creditPath, JSON.stringify(imageData.credit, null, 2), 'utf8');

    console.log(`✅ 画像を保存しました: ${outputPath}`);
    return true;
  } catch (error) {
    console.error('画像のダウンロードエラー:', error.message);
    return false;
  }
}

class AutoBlogGeneratorComplete {
  constructor() {
    this.date = new Date();
    this.dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][this.date.getDay()];
    this.config = null;
    this.usedImages = null;
    this.postsDir = POSTS_DIR;
    this.imageDir = BLOG_IMAGE_DIR;
  }

  async initialize() {
    this.config = await loadConfig();
    if (!this.config) {
      console.warn('⚠️  content-calendar.yml が見つからないため、デフォルト設定で実行します。');
      this.config = {};
    }

    this.usedImages = await loadUsedImages();
    if (!Array.isArray(this.usedImages.images)) {
      this.usedImages.images = [];
    }
    
    // 7日以上前の画像IDを削除（再利用可能にする）
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    this.usedImages.images = this.usedImages.images.filter(
      img => new Date(img.usedAt) > oneWeekAgo
    );
  }

  // 曜日に基づいてテーマを選択
  selectDailyTheme() {
    const weeklyTheme = this.config?.weekly_themes[this.dayOfWeek];
    if (!weeklyTheme) {
      // フォールバック
      return {
        theme: 'AIマーケティング',
        instinct: 'learning',
        structure: 'howTo',
        keywords: ['AI', 'マーケティング', '最新', '活用法']
      };
    }
    return weeklyTheme;
  }

  // 月別キャンペーンの考慮
  getMonthlyKeywords() {
    const monthNames = ['january', 'february', 'march', 'april', 'may', 'june', 
                       'july', 'august', 'september', 'october', 'november', 'december'];
    const currentMonth = monthNames[this.date.getMonth()];
    
    const monthlyTheme = this.config?.monthly_campaigns[currentMonth];
    return monthlyTheme?.special_keywords || [];
  }

  // Gemini APIを使用してコンテンツを生成
  async generateContentWithAI(prompt) {
    try {
      const systemPrompt = `あなたはLeadFiveのAI×心理学マーケティングの専門家です。
以下の要件を満たす高品質なブログ記事を作成してください：

1. 文字数: 2500-3000文字
2. 構成:
   - 魅力的なリード文（150-200文字）
   - 明確な見出し構造（h2, h3を適切に使用）
   - 具体的な事例やデータの引用
   - 実践的なアクションプラン
   - 説得力のあるCTA

3. トーン: プロフェッショナルかつ親しみやすい
4. SEO: 自然にキーワードを配置
5. 重要: 1つの記事のみ生成してください。複数のバージョンや別の記事を含めないでください。

`;
      
      const targetModel = genAI.getGenerativeModel({ model: DEFAULT_GEMINI_MODEL });
      const result = await targetModel.generateContent(systemPrompt + prompt);
      const response = await result.response;
      const text = response.text();
      
      return text;
    } catch (error) {
      console.error('Gemini API エラー:', error);

      if (error?.status === 404 || /not found/i.test(error?.message || '')) {
        try {
          console.warn(`⚠️ モデル ${DEFAULT_GEMINI_MODEL} が見つからないため、${FALLBACK_GEMINI_MODEL} を試行します。`);
          const fallbackModel = genAI.getGenerativeModel({ model: FALLBACK_GEMINI_MODEL });
          const fallbackResult = await fallbackModel.generateContent(systemPrompt + prompt);
          const fallbackResponse = await fallbackResult.response;
          const fallbackText = fallbackResponse.text();
          console.log(`🎆 フォールバックモデル使用: ${FALLBACK_GEMINI_MODEL}`);
          return fallbackText;
        } catch (fallbackError) {
          console.error('Gemini フォールバックモデルでもエラー:', fallbackError);
          throw fallbackError;
        }
      }

      throw error;
    }
  }

  // ブログ記事の生成
  async generateBlogPost() {
    const dailyTheme = this.selectDailyTheme();
    const monthlyKeywords = this.getMonthlyKeywords();

    const forcedKeyword = (process.env.BLOG_KEYWORD || '').trim();
    const forcedCategory = (process.env.BLOG_CATEGORY || '').trim();
    const forcedInstinct = (process.env.BLOG_INSTINCT || '').trim();
    const forcedStructure = (process.env.BLOG_STRUCTURE || '').trim();
    const forcedTitle = (process.env.BLOG_TITLE || '').trim();

    const selectedTheme = {
      theme: dailyTheme.theme,
      instinct: dailyTheme.instinct,
      structure: dailyTheme.structure,
      keywords: Array.isArray(dailyTheme.keywords) ? [...dailyTheme.keywords] : []
    };

    if (forcedCategory) {
      selectedTheme.theme = forcedCategory;
    }
    if (forcedInstinct) {
      selectedTheme.instinct = forcedInstinct;
    }
    if (forcedStructure) {
      selectedTheme.structure = forcedStructure;
    }
    
    // キーワードの選択（定義がない場合はテーマ名を使用）
    const baseKeywords = selectedTheme.keywords.length
      ? selectedTheme.keywords
      : [selectedTheme.theme];
    const allKeywords = [...baseKeywords, ...monthlyKeywords];
    const selectedKeyword = forcedKeyword || allKeywords[Math.floor(Math.random() * allKeywords.length)] || selectedTheme.theme;
    
    console.log(`📝 ブログ記事を生成中...`);
    console.log(`  曜日: ${this.dayOfWeek}`);
    console.log(`  テーマ: ${selectedTheme.theme}`);
    console.log(`  本能: ${selectedTheme.instinct}`);
    console.log(`  構造: ${selectedTheme.structure}`);
    console.log(`  キーワード: ${selectedKeyword}`);

    // タイトルの生成
    const currentYear = new Date().getFullYear();
    const titlePrompt = `
テーマ: ${selectedTheme.theme}
キーワード: ${selectedKeyword}
本能: ${selectedTheme.instinct}
構造タイプ: ${selectedTheme.structure}
現在の年: ${currentYear}年

上記の情報を基に、以下の条件を満たすブログ記事のタイトルを1つ作成してください：
- 60文字以内
- 数字を含む（例：5つの方法、${currentYear}年版など）
- 興味を引く表現
- SEOに最適化
- 必ず${currentYear}年を使用（2024年などの古い年は使わない）
`;
    let cleanTitle = forcedTitle;
    if (!cleanTitle) {
      const title = await this.generateContentWithAI(titlePrompt);
      cleanTitle = title.trim().replace(/^["']|["']$/g, '');
    }

    // 記事内容の生成
    const contentPrompt = `
タイトル: ${cleanTitle}
テーマ: ${selectedTheme.theme}
キーワード: ${selectedKeyword}
本能: ${selectedTheme.instinct}
構造タイプ: ${selectedTheme.structure}

上記の情報を基に、以下の構成でブログ記事を作成してください：

1. リード文（150-200文字）
   - 読者の課題や悩みに共感
   - 記事を読むメリットを明確に提示
   - ${selectedTheme.instinct}本能に訴求

2. 本文（2000-2500文字）
   - ${this.getStructureTemplate(selectedTheme.structure)}
   - 具体的な数値やデータを含める
   - 実践的なステップや方法を提供
   - 専門用語は分かりやすく説明

3. まとめ（200-300文字）
   - 重要ポイントの再確認
   - 次のアクションへの誘導
   - LeadFiveのサービスへの自然な誘導

キーワード「${selectedKeyword}」を自然に3-5回使用してください。
`;

    const content = await this.generateContentWithAI(contentPrompt);
    
    // コンテンツの長さをチェック
    console.log(`📏 生成されたコンテンツ長: ${content.length} 文字`);

    // 画像の取得
    const imageKeywords = [selectedTheme.theme, selectedKeyword].filter(Boolean);
    const usedImageIds = this.usedImages.images.map(img => img.id);
    const imageData = await fetchUnsplashImage(imageKeywords, usedImageIds);

    // メタデータの作成
    const date = new Date();
    const dateStr = date.toISOString().split('T')[0];
    const slug = this.generateSlug(cleanTitle);
    
    // UnsplashのURLを直接使用（ダウンロードが失敗する可能性があるため）
    let imagePath = null;
    if (imageData && imageData.urls) {
      imagePath = `${imageData.urls.regular}?w=1200&h=630&fit=crop&crop=smart`;
    } else {
      imagePath = '/assets/images/blog/default.jpg';
    }
    
    const processedContent = this.injectHeroImage(content.trim(), imagePath, cleanTitle);

    return {
      filename: `${dateStr}-${slug}.md`,
      title: cleanTitle,
      date: date.toISOString(),
      categories: [selectedTheme.theme],
      tags: Array.from(new Set([
        selectedKeyword,
        ...((Array.isArray(selectedTheme.keywords) ? selectedTheme.keywords.slice(0, 4) : []))
      ])),
      instinct: selectedTheme.instinct,
      description: `${cleanTitle} - LeadFiveが提供するAI×心理学マーケティングの実践ガイド`,
      content: processedContent,
      author: 'LeadFive AI',
      image: imagePath,
      imageData: imageData
    };
  }

  // 構造テンプレートの取得
  getStructureTemplate(structure) {
    const templates = {
      howTo: `
   構成：ハウツー形式
   - なぜこの方法が重要なのか
   - ステップ1: 準備と計画
   - ステップ2: 実装と実行
   - ステップ3: 測定と改善
   - よくある失敗と対策`,
      
      problemSolution: `
   構成：問題解決形式
   - 現状の課題と痛み
   - 課題が生じる根本原因
   - 解決策の提示
   - 実装方法
   - 期待される成果`,
      
      caseStudy: `
   構成：事例研究形式
   - 企業の背景と課題
   - 実施した施策
   - 得られた成果（数値付き）
   - 成功要因の分析
   - 他社への応用方法`,
      
      comparison: `
   構成：比較分析形式
   - 比較対象の概要
   - 評価基準の設定
   - 詳細な比較分析
   - それぞれの長所と短所
   - 状況別の推奨事項`
    };
    
    return templates[structure] || templates.howTo;
  }

  injectHeroImage(content, imagePath, title) {
    if (!imagePath || !content) {
      return content;
    }

    if (content.includes(imagePath)) {
      return content;
    }

    const lines = content.split('\n');
    const heroMarkdown = `\n![${title}](${imagePath})\n`;
    
    // 最初のh2（##で始まる行）を探す
    const firstH2Index = lines.findIndex(line => /^##\s+[^#]/.test(line.trim()));
    
    if (firstH2Index !== -1) {
      // h2の直後に画像を挿入
      lines.splice(firstH2Index + 1, 0, heroMarkdown);
    } else {
      // h2が見つからない場合は最初に挿入
      lines.unshift(heroMarkdown);
    }
    
    return lines.join('\n');
  }

  // スラグ生成
  generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 50);
  }

  // Markdownファイルの作成
  async createMarkdownFile(post) {
    const markdown = `---
layout: blog-post
title: "${post.title}"
date: ${post.date}
categories: [${post.categories.join(', ')}]
tags: [${post.tags.join(', ')}]
author: "${post.author}"
description: "${post.description}"
image: "${post.image || '/assets/images/blog/default.jpg'}"
featured: true
instinct: ${post.instinct}
reading_time: 8
seo_keywords: [${post.tags.map(tag => `"${tag}"`).join(', ')}]
---

${post.content}

## 関連記事

<div class="related-posts">
  <h3>こちらの記事もおすすめです</h3>
  <ul>
    <li><a href="/blog/ai-marketing-basics">AI×心理学マーケティングの基礎知識</a></li>
    <li><a href="/blog/8-instincts-guide">8つの本能を活用した顧客理解</a></li>
    <li><a href="/blog/success-cases">LeadFive導入企業の成功事例集</a></li>
  </ul>
</div>

<div class="cta-section">
  <h2>無料相談受付中</h2>
  <p>AI×心理学マーケティングで、あなたのビジネスを次のレベルへ。<br>
  まずは無料相談で、具体的な活用方法をご提案します。</p>
  <a href="/contact" class="btn btn-primary btn-lg">無料相談を申し込む</a>
</div>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "${post.title}",
  "image": "${post.image}",
  "author": {
    "@type": "Organization",
    "name": "LeadFive"
  },
  "publisher": {
    "@type": "Organization",
    "name": "LeadFive",
    "logo": {
      "@type": "ImageObject",
      "url": "https://leadfive.co.jp/assets/images/logo.png"
    }
  },
  "datePublished": "${post.date}",
  "description": "${post.description}"
}
</script>
`;

    const filepath = path.join(this.postsDir, post.filename);
    await fs.mkdir(this.postsDir, { recursive: true });
    await fs.writeFile(filepath, markdown, 'utf8');
    console.log(`✅ ブログ記事を作成しました: ${filepath}`);
    
    return filepath;
  }

  // 画像の保存（オプション）
  async saveImage(post) {
    if (!post.imageData) return;
    
    // Unsplashの使用記録だけ保存
    if (post.imageData.id) {
      this.usedImages.images.push({
        id: post.imageData.id,
        usedAt: new Date().toISOString(),
        postTitle: post.title,
        imageUrl: post.image
      });
      this.usedImages.lastUpdated = new Date().toISOString();
      await saveUsedImages(this.usedImages);
    }
    
    // ローカルにダウンロードする場合（オプション）
    if (process.env.DOWNLOAD_IMAGES === 'true' && post.imageData.url) {
      await fs.mkdir(this.imageDir, { recursive: true });
      const localPath = path.join(this.imageDir, `${path.basename(post.filename, '.md')}.jpg`);
      await downloadAndOptimizeImage(post.imageData, localPath);
    }
  }

  // 統計情報の保存
  async saveStatistics(post) {
    await fs.mkdir(path.dirname(AUTO_POST_STATS_PATH), { recursive: true });
    let stats = [];
    
    try {
      const existing = await fs.readFile(AUTO_POST_STATS_PATH, 'utf8');
      stats = JSON.parse(existing);
    } catch (e) {
      // ファイルが存在しない場合は新規作成
    }
    
    stats.push({
      date: post.date,
      title: post.title,
      categories: post.categories,
      tags: post.tags,
      instinct: post.instinct,
      filename: post.filename,
      hasImage: !!post.image,
      dayOfWeek: this.dayOfWeek
    });
    
    // 最新100件のみ保持
    if (stats.length > 100) {
      stats = stats.slice(-100);
    }
    
    await fs.writeFile(AUTO_POST_STATS_PATH, JSON.stringify(stats, null, 2), 'utf8');
  }

  // メイン実行関数
  async run() {
    try {
      console.log('🚀 自動ブログ投稿プロセスを開始します...');
      console.log(`📅 日付: ${this.date.toLocaleDateString('ja-JP')}`);
      console.log(`📅 曜日: ${this.dayOfWeek}`);
      
      // 初期化
      await this.initialize();
      
      // ブログ記事の生成
      const post = await this.generateBlogPost();
      
      // Markdownファイルの作成
      await this.createMarkdownFile(post);
      
      // 画像の保存
      await this.saveImage(post);
      
      // 統計情報の保存
      await this.saveStatistics(post);
      
      console.log('✨ ブログ記事の自動投稿が完了しました！');
      console.log(`📝 タイトル: ${post.title}`);
      console.log(`🏷️  カテゴリー: ${post.categories.join(', ')}`);
      console.log(`🔖 タグ: ${post.tags.join(', ')}`);
      console.log(`🧠 本能: ${post.instinct}`);
      console.log(`🖼️  画像: ${post.image ? '✓' : '✗'}`);

      return post;
    } catch (error) {
      console.error('❌ エラーが発生しました:', error);
      throw error;
    }
  }
}

// 実行
if (require.main === module) {
  const generator = new AutoBlogGeneratorComplete();
  generator.run().catch(() => process.exit(1));
}

module.exports = AutoBlogGeneratorComplete;
