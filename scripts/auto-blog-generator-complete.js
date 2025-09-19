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
  const UNSPLASH_API_KEY = process.env.UNSPLASH_API_KEY || process.env.UNSPLASH_ACCESS_KEY;
  
  if (!UNSPLASH_API_KEY) {
    console.log('⚠️ Unsplash API キーが設定されていません (UNSPLASH_API_KEY または UNSPLASH_ACCESS_KEY)。デフォルト画像を使用します。');
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

    if (!response.data?.results?.length) {
      console.warn(`⚠️ Unsplash検索で画像が見つかりませんでした (query: ${searchQuery})`);
      return null;
    }

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
    const status = error.response?.status;
    if (status === 401 || status === 403) {
      console.error(`Unsplash API 認証エラー (status: ${status})。UNSPLASH_API_KEY/UNSPLASH_ACCESS_KEY を確認してください。`);
    } else {
      console.error('Unsplash API エラー:', status || error.message);
    }
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
    console.error('画像のダウンロードエラー:', error.response?.status || error.message);
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
依頼されたフォーマットと禁止事項を厳密に守りながら、単一のブログ記事を作成してください。

必ず守るべき前提条件:
1. 文字数はおおよそ1800〜2200文字
2. 指示された見出しや小見出しの順番・表記を変更しない
3. 本文に外部リンクやURLを挿入しない
4. CTA文言や「無料相談はこちら」といった直接的な営業文句を本文内で使わない
5. 1つの記事のみを生成し、別バージョンや追記を含めない
6. 日本語で執筆し、プロフェッショナルだが親しみやすいトーンを維持する

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
以下の条件を満たすブログ記事のタイトルを1つ作成してください。
- テーマ: ${selectedTheme.theme}
- 軸となるキーワード: ${selectedKeyword}
- 訴求する本能: ${selectedTheme.instinct}
- 構造タイプ: ${selectedTheme.structure}
- 現在の年: ${currentYear}年
- 文字数: 60文字以内
- 数字を必ず含める（例：${currentYear}年版、5つのポイント など）
- SEOを意識し、主要キーワードを自然に含める
- 興味を引く具体的な表現にする

出力形式:
タイトルのみを1行で返してください。先頭や末尾に引用符・記号・見出し記号を付けず、解説文や余計な文章を追加しないでください。
`;
    let cleanTitle = this.sanitizeTitle(forcedTitle);
    if (!cleanTitle) {
      const title = await this.generateContentWithAI(titlePrompt);
      cleanTitle = this.sanitizeTitle(title);
    }
    if (!cleanTitle) {
      cleanTitle = `${currentYear}年版 ${selectedTheme.theme}の最新戦略ガイド`;
    }

    // 記事内容の生成
    const contentPrompt = `
以下の条件でLeadFive公式ブログ向けの記事をMarkdown形式で執筆してください。

【執筆条件】
- タイトル: ${cleanTitle}
- テーマ: ${selectedTheme.theme}
- キーワード: ${selectedKeyword}
- 本能: ${selectedTheme.instinct}
- 構造タイプ: ${selectedTheme.structure}
- 文字数目安: 1800〜2200文字
- トーン: プロフェッショナルだが親しみやすい
- LeadFiveのAI×心理学マーケティングの知見を自然に織り込む

【必須セクションと順序】
## 導入
- 読者の課題に共感し、記事を読むメリットを150〜200文字で提示

## ${selectedTheme.instinct}の心理学的背景
- 本能の概要とマーケティング活用ポイントを整理

## ${selectedTheme.theme}の最新トレンド分析
- ${selectedTheme.structure}構造の視点で市場動向と課題を説明
- ${this.getStructureTemplate(selectedTheme.structure)} を参考に論理展開を組み立てる

## 実践ステップ
### ステップ1
### ステップ2
### ステップ3
- 各ステップで実行内容・指標・注意点を具体的に解説

## 成功事例と期待できる効果
- 数値例や成果指標を交えて導入効果を説明

## まとめと次のアクション
- 箇条書きで3つの実行ポイントを整理
- 最後の1文だけでLeadFiveへの相談が有効であることに触れる

【禁止事項・注意事項】
- 本文内にURLや外部リンクを挿入しない
- 「無料相談はこちら」「お問い合わせはこちら」などのCTA文言を本文で使用しない
- 根拠のない断定を避け、データや事例を示す際は「例」「想定」などのクッション語を添える
- セクション間は1行の空行で区切る

キーワード「${selectedKeyword}」を自然な文脈で3〜5回使用してください。
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

  sanitizeTitle(rawTitle) {
    if (!rawTitle) {
      return '';
    }

    const firstLine = rawTitle
      .split('\n')
      .map(line => line.trim())
      .find(line => line.length > 0) || '';

    const cleaned = firstLine
      .replace(/^"+|"+$/g, '')
      .replace(/^'+|'+$/g, '')
      .replace(/^`+|`+$/g, '')
      .replace(/^#+\s*/, '')
      .replace(/^(?:タイトル[:：]\s*)/i, '')
      .trim();

    return cleaned.length > 60 ? cleaned.slice(0, 60) : cleaned;
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
  <a href="https://leadfive.co.jp/contact" class="btn btn-primary btn-lg">無料相談はこちら</a>
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
