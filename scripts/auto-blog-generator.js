#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const BlogAIAssistant = require('../blog-ai-assistant');

const ROOT_DIR = path.join(__dirname, '..');
const POSTS_DIR = path.join(ROOT_DIR, '_posts');
const IMAGE_DIR = path.join(ROOT_DIR, 'assets', 'images', 'blog');
const STATS_FILE = path.join(ROOT_DIR, 'logs', 'auto-posts.json');

// Gemini API設定
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const DEFAULT_GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-pro-latest';
const FALLBACK_GEMINI_MODEL = process.env.GEMINI_FALLBACK_MODEL || 'gemini-1.5-flash';

// AIアシスタントのインスタンス
const aiAssistant = new BlogAIAssistant();

// 本能とカテゴリーの定義
const instincts = ['生存本能', '食欲本能', '性的本能', '危機回避本能', '快適本能', '愛情本能', '承認本能', '学習本能'];
const categories = ['AI心理学', 'マーケティング戦略', 'ケーススタディ', '業界トレンド', 'ツール・技術', 'ベストプラクティス'];

// トピックのローテーション用データ
const topicRotation = {
  月曜日: { instinct: '学習本能', focus: '週の始まりに新しい知識を' },
  火曜日: { instinct: '快適本能', focus: '業務効率化のヒント' },
  水曜日: { instinct: '承認本能', focus: '成功事例とブランディング' },
  木曜日: { instinct: '危機回避本能', focus: '問題解決と予防策' },
  金曜日: { instinct: '愛情本能', focus: 'コミュニティとつながり' },
  土曜日: { instinct: '生存本能', focus: 'ビジネスの基盤強化' },
  日曜日: { instinct: '食欲本能', focus: '価値創造と満足度向上' }
};

// トレンドトピックのリスト（定期的に更新）
const trendingTopics = [
  'ChatGPT活用法',
  'メタバースマーケティング',
  'Z世代向け戦略',
  'サステナビリティ',
  'インフルエンサーマーケティング',
  'ショート動画戦略',
  'パーソナライゼーション',
  'プライバシー重視マーケティング',
  'AIコンテンツ生成',
  'ノーコード・ローコード',
  'Web3.0',
  'ソーシャルコマース'
];

class AutoBlogGenerator {
  constructor() {
    this.date = new Date();
    this.dayOfWeek = ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'][this.date.getDay()];
  }

  // 本能の選択（環境変数またはローテーション）
  selectInstinct() {
    const envInstinct = process.env.INSTINCT;
    if (envInstinct && envInstinct !== 'random') {
      return envInstinct;
    }
    return topicRotation[this.dayOfWeek].instinct;
  }

  // カテゴリーの選択（環境変数またはランダム）
  selectCategory() {
    const envCategory = process.env.CATEGORY;
    if (envCategory && envCategory !== 'random') {
      return envCategory;
    }
    return categories[Math.floor(Math.random() * categories.length)];
  }

  // トレンドトピックの選択
  selectTrendingTopic() {
    return trendingTopics[Math.floor(Math.random() * trendingTopics.length)];
  }

  // Gemini APIを使用してコンテンツを生成
  async generateContentWithAI(prompt) {
    try {
      const systemPrompt = `あなたはLeadFiveのAI×心理学マーケティングの専門家です。
与えられたフォーマット指示と禁止事項を厳守し、単一のブログ記事のみを生成してください。
- 文字数は目安として1500〜2000文字
- 指示された見出し構造を変更しない
- 本文に外部リンクやURLを含めない
- CTA文言や直接的な勧誘表現（例: 無料相談はこちら）を挿入しない
- プロフェッショナルで親しみやすい日本語のトーンを保つ
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
          return fallbackResponse.text();
        } catch (fallbackError) {
          console.error('Gemini フォールバックモデルでもエラー:', fallbackError);
        }
      }
      // フォールバック: 基本的なコンテンツを返す
      return this.generateFallbackContent();
    }
  }

  // フォールバックコンテンツの生成
  generateFallbackContent() {
    return `
## はじめに

本記事では、最新のAI技術と心理学的アプローチを組み合わせた革新的なマーケティング手法について解説します。

## 主要なポイント

1. **データドリブンなアプローチ**: AIを活用して顧客行動を深く理解
2. **心理学的インサイト**: 人間の本能に基づいた訴求方法
3. **実践的な応用**: すぐに実装できる具体的な施策

## 実装方法

### ステップ1: 現状分析
まずは現在のマーケティング施策の効果を測定し、改善点を特定します。

### ステップ2: 戦略立案
AI×心理学のフレームワークを使用して、新しい戦略を立案します。

### ステップ3: 実行と最適化
継続的なA/Bテストとデータ分析により、施策を最適化していきます。

## 成功事例

多くの企業がこのアプローチを採用し、顕著な成果を上げています。
- コンバージョン率の向上: 平均30%
- 顧客満足度の改善: 25%向上
- ROIの最大化: 2.5倍

## まとめ

AI×心理学マーケティングは、現代のビジネスにおいて不可欠な要素となっています。
`;
  }

  // ブログ記事の生成
  async generateBlogPost() {
    const instinct = this.selectInstinct();
    const category = this.selectCategory();
    const trendTopic = this.selectTrendingTopic();
    
    console.log(`📝 ブログ記事を生成中...`);
    console.log(`  本能: ${instinct}`);
    console.log(`  カテゴリー: ${category}`);
    console.log(`  トレンドトピック: ${trendTopic}`);

    // タイトルの生成
    const titlePrompt = `
以下の条件を満たすブログ記事のタイトルを1つ作成してください。
- テーマ: ${category}
- 訴求する本能: ${instinct}
- トレンドトピック: ${trendTopic}
- 60文字以内で具体的かつ魅力的
- SEOを意識し、主要キーワードを含める
- 数字や最新性を示す語を活用して興味を引く

出力形式:
タイトルのみを1行で記載してください。先頭や末尾に引用符や記号を付けず、説明文や改行は含めないでください。
`;

    const rawTitle = await this.generateContentWithAI(titlePrompt);
    const title = this.sanitizeTitle(rawTitle) || 
                  `${trendTopic}で${instinct}を刺激する${category}の新手法`;

    // キーワードの生成
    const keywords = [
      category,
      instinct.replace('本能', ''),
      trendTopic,
      'AI',
      '心理学',
      'マーケティング',
      '自動化'
    ];

    // 記事内容の生成
    const contentPrompt = `
以下の条件でLeadFive公式ブログ向けの記事をMarkdown形式で執筆してください。

【執筆条件】
- タイトル: ${title}
- 本能: ${instinct}
- カテゴリー: ${category}
- トレンドトピック: ${trendTopic}
- 文字数: 1500〜2000文字
- トーン: プロフェッショナルだが親近感がある
- LeadFiveのAI×心理学マーケティングの専門性を示す視点を盛り込む

【出力フォーマット】
以下の見出し構成を順番に作成し、見出し名はそのまま使用してください。
## 導入
- 読者の課題に共感し、記事を読むメリットを提示する（150〜200文字）

## ${instinct}の心理学的背景
- 本能の概要とマーケティングでの活用ポイントを解説

## ${trendTopic}を取り入れた戦略の全体像
- トレンドとの関連性と全体戦略を示す

## 実践ステップ
### ステップ1
### ステップ2
### ステップ3
- 各ステップで具体的な施策、指標、注意点を記載

## 成功事例と期待できる効果
- 成功パターンや数値例、得られる成果を紹介

## まとめと次のアクション
- 箇条書きで3つの実行ポイントを提示し、最後にLeadFiveへの相談が有効であることを自然に触れる

【禁止事項・細かな指示】
- Markdownの外部リンクやURLを本文内に挿入しない（CTAはシステム側で追加されます）
- 「無料相談はこちら」というフレーズは本文内で使用しない
- 過度に宣伝的な表現ではなく、読者の行動を後押しする具体的アドバイスを重視する
- 各セクションの間には1行の空行を入れる
`;

    const content = await this.generateContentWithAI(contentPrompt);

    // メタデータの作成
    const date = new Date();
    const dateStr = date.toISOString().split('T')[0];
    const slug = this.generateSlug(title);
    
    return {
      filename: `${dateStr}-${slug}.md`,
      title: title.trim(),
      date: date.toISOString(),
      category,
      keywords,
      instinct,
      description: `${title.trim()} - LeadFiveが提供するAI×心理学マーケティングの最新インサイト`,
      content: content.trim(),
      author: 'LeadFive AI'
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
layout: post
title: "${post.title}"
date: ${post.date}
categories: [${post.category}]
tags: [${post.keywords.join(', ')}]
author: ${post.author}
description: "${post.description}"
image: /assets/images/blog/${post.date.split('T')[0]}-thumbnail.jpg
instinct: ${post.instinct}
published: true
---

${post.content}

## LeadFiveについて

LeadFiveは、AI技術と心理学的アプローチを融合させた次世代のマーケティングソリューションを提供しています。8つの本能に基づいた科学的なアプローチで、お客様のビジネス成長をサポートします。

<div class="cta-box">
  <h3>無料相談実施中</h3>
  <p>あなたのビジネスに最適なAI×心理学マーケティング戦略をご提案します。</p>
  <a href="https://leadfive.co.jp/contact" class="btn btn-primary">無料相談はこちら</a>
</div>

### 関連記事
- [AI×心理学マーケティングの基礎](/blog/ai-psychology-marketing-basics)
- [8つの本能を活用したコンテンツ戦略](/blog/eight-instincts-content-strategy)
- [${post.instinct}を刺激するデザインテクニック](/blog/${post.instinct.toLowerCase()}-design-techniques)
`;

    const filepath = path.join(POSTS_DIR, post.filename);
    await fs.mkdir(POSTS_DIR, { recursive: true });
    await fs.writeFile(filepath, markdown, 'utf8');
    console.log(`✅ ブログ記事を作成しました: ${filepath}`);
    
    return filepath;
  }

  // プレースホルダー画像の作成
  async createPlaceholderImage(post) {
    await fs.mkdir(IMAGE_DIR, { recursive: true });
    
    // 実際の実装では、ここで画像生成APIを使用するか、
    // 事前に用意された画像セットから選択する
    console.log(`📷 サムネイル画像のプレースホルダーを作成: ${post.date.split('T')[0]}-thumbnail.jpg`);
  }

  // メイン実行関数
  async run() {
    try {
      console.log('🚀 自動ブログ投稿プロセスを開始します...');
      console.log(`📅 日付: ${this.date.toLocaleDateString('ja-JP')}`);
      console.log(`📅 曜日: ${this.dayOfWeek}`);
      
      // ブログ記事の生成
      const post = await this.generateBlogPost();
      
      // Markdownファイルの作成
      await this.createMarkdownFile(post);
      
      // 画像の作成
      await this.createPlaceholderImage(post);
      
      // 統計情報の保存
      await this.saveStatistics(post);
      
      console.log('✨ ブログ記事の自動投稿が完了しました！');
      console.log(`📝 タイトル: ${post.title}`);
      console.log(`🏷️  カテゴリー: ${post.category}`);
      console.log(`🧠 本能: ${post.instinct}`);
      
    } catch (error) {
      console.error('❌ エラーが発生しました:', error);
      process.exit(1);
    }
  }

  // 統計情報の保存
  async saveStatistics(post) {
    await fs.mkdir(path.dirname(STATS_FILE), { recursive: true });
    let stats = [];
    
    try {
      const existing = await fs.readFile(STATS_FILE, 'utf8');
      stats = JSON.parse(existing);
    } catch (e) {
      // ファイルが存在しない場合は新規作成
    }
    
    stats.push({
      date: post.date,
      title: post.title,
      category: post.category,
      instinct: post.instinct,
      keywords: post.keywords,
      filename: post.filename
    });
    
    await fs.writeFile(STATS_FILE, JSON.stringify(stats, null, 2), 'utf8');
  }
}

// 実行
if (require.main === module) {
  const generator = new AutoBlogGenerator();
  generator.run();
}

module.exports = AutoBlogGenerator;
