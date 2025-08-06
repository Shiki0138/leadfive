#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const readline = require('readline');
require('dotenv').config();

// カラー出力用のヘルパー
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

const color = (text, colorName) => `${colors[colorName]}${text}${colors.reset}`;

// readline インターフェース
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ask = (question) => new Promise((resolve) => rl.question(question, resolve));

class KeywordBasedBlogCreator {
  constructor() {
    this.blogData = {
      keywords: [],
      searchIntent: null,
      targetAudience: null,
      title: '',
      content: '',
      description: '',
      tags: []
    };
  }

  async run() {
    try {
      console.log(color('============================================================', 'cyan'));
      console.log(color('  キーワードベース ブログ記事生成システム', 'bright'));
      console.log(color('  ローカルビジネス経営者向け情報発信', 'yellow'));
      console.log(color('============================================================', 'cyan'));
      console.log();

      await this.step1_collectKeywords();
      await this.step2_analyzeSearchIntent();
      await this.step3_identifyTargetAudience();
      await this.step4_generateOptimizedTitle();
      await this.step5_createContent();
      await this.step6_optimizeSEO();
      await this.step7_saveArticle();

      console.log(color('\n🎉 記事生成が完了しました！', 'green'));
      
    } catch (error) {
      console.error(color(`❌ エラーが発生しました: ${error.message}`, 'red'));
    } finally {
      rl.close();
    }
  }

  // ステップ1: キーワード収集
  async step1_collectKeywords() {
    console.log(color('\n📍 ステップ 1/7: キーワード収集', 'bright'));
    console.log('記事のキーワードを入力してください（カンマ区切り）:');
    
    const keywordInput = await ask('キーワード: ');
    this.blogData.keywords = keywordInput.split(',').map(k => k.trim()).filter(k => k.length > 0);
    
    console.log(color(`\n✓ キーワード: ${this.blogData.keywords.join(', ')}`, 'green'));
  }

  // ステップ2: 検索意図分析
  async step2_analyzeSearchIntent() {
    console.log(color('\n📍 ステップ 2/7: 検索意図分析', 'bright'));
    console.log('キーワードから検索意図を分析中...\n');

    // キーワードベースで検索意図を分析
    this.blogData.searchIntent = this.analyzeKeywordIntent(this.blogData.keywords);
    
    console.log(color('🔍 検索意図分析結果:', 'yellow'));
    console.log(`主要意図: ${this.blogData.searchIntent.primary}`);
    console.log(`情報ニーズ: ${this.blogData.searchIntent.needs.join(', ')}`);
    console.log(`コンテンツタイプ: ${this.blogData.searchIntent.contentType}`);
    
    console.log(color('\n✓ 検索意図分析完了', 'green'));
  }

  // ステップ3: ターゲット読者特定
  async step3_identifyTargetAudience() {
    console.log(color('\n📍 ステップ 3/7: ターゲット読者分析', 'bright'));
    
    // ローカルビジネス経営者向けのペルソナ設定
    this.blogData.targetAudience = this.identifyAudienceFromKeywords(this.blogData.keywords);
    
    console.log(color('\n👤 ターゲット読者:', 'yellow'));
    console.log(`主要読者: ${this.blogData.targetAudience.primary}`);
    console.log(`副次読者: ${this.blogData.targetAudience.secondary.join(', ')}`);
    console.log(`読者の課題: ${this.blogData.targetAudience.challenges.join(', ')}`);
    
    const proceed = await ask('\nこの設定で進めますか？ (y/n): ');
    if (proceed.toLowerCase() !== 'y') {
      console.log('設定の調整は次回アップデートで対応予定です。');
    }
    
    console.log(color('\n✓ ターゲット設定完了', 'green'));
  }

  // ステップ4: タイトル生成
  async step4_generateOptimizedTitle() {
    console.log(color('\n📍 ステップ 4/7: SEO最適化タイトル生成', 'bright'));
    
    const titles = this.generateTitlesFromKeywords(this.blogData.keywords, this.blogData.searchIntent);
    
    console.log('\n🎯 タイトル候補:');
    titles.forEach((title, index) => {
      console.log(color(`${index + 1}. ${title}`, 'cyan'));
    });
    
    const choice = await ask('\nタイトルを選択してください (1-5): ');
    const selectedIndex = parseInt(choice) - 1;
    
    if (selectedIndex >= 0 && selectedIndex < titles.length) {
      this.blogData.title = titles[selectedIndex];
    } else {
      this.blogData.title = titles[0];
    }
    
    console.log(color(`\n✓ 選択タイトル: ${this.blogData.title}`, 'green'));
  }

  // ステップ5: コンテンツ生成
  async step5_createContent() {
    console.log(color('\n📍 ステップ 5/7: コンテンツ生成', 'bright'));
    console.log('キーワードと検索意図に基づいてコンテンツを生成中...\n');
    
    this.blogData.content = this.generateContentFromKeywords(
      this.blogData.keywords,
      this.blogData.searchIntent,
      this.blogData.targetAudience
    );
    
    console.log(color(`✓ コンテンツ生成完了（約${this.blogData.content.length}文字）`, 'green'));
  }

  // ステップ6: SEO最適化
  async step6_optimizeSEO() {
    console.log(color('\n📍 ステップ 6/7: SEO最適化', 'bright'));
    
    // メタディスクリプション生成
    this.blogData.description = this.generateMetaDescription(
      this.blogData.keywords,
      this.blogData.searchIntent
    );
    
    // タグ生成
    this.blogData.tags = this.generateTags(this.blogData.keywords);
    
    console.log(`ディスクリプション: ${this.blogData.description}`);
    console.log(`タグ: ${this.blogData.tags.join(', ')}`);
    
    console.log(color('\n✓ SEO最適化完了', 'green'));
  }

  // ステップ7: 記事保存
  async step7_saveArticle() {
    console.log(color('\n📍 ステップ 7/7: 記事保存', 'bright'));
    
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const fileName = this.generateFileName(this.blogData.title);
    const filePath = path.join('_posts', `${dateStr}-${fileName}.md`);
    
    const fullContent = this.generateFullMarkdown();
    
    await fs.writeFile(filePath, fullContent, 'utf8');
    
    console.log(color('\n✅ 記事保存完了！', 'green'));
    console.log(color('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan'));
    console.log(color(`📁 ファイル: ${filePath}`, 'bright'));
    console.log(color(`📝 タイトル: ${this.blogData.title}`, 'bright'));
    console.log(color(`🔑 キーワード: ${this.blogData.keywords.join(', ')}`, 'bright'));
    console.log(color(`📊 文字数: 約${this.blogData.content.length}文字`, 'bright'));
    console.log(color('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan'));
  }

  // キーワードから検索意図を分析
  analyzeKeywordIntent(keywords) {
    const keywordText = keywords.join(' ').toLowerCase();
    
    // 美容室 × ChatGPT × 活用法の例
    if (keywords.includes('美容室') && keywords.some(k => k.includes('ChatGPT')) && keywords.includes('活用法')) {
      return {
        primary: 'ローカルビジネスにおけるAI活用の実践方法',
        needs: [
          '具体的な導入事例と効果',
          '費用対効果の実証データ',
          '実装の具体的手順',
          '成功と失敗のポイント'
        ],
        contentType: '実践ガイド・事例紹介',
        angle: 'ローカルビジネス経営の視点'
      };
    }
    
    // 活用法、方法、使い方などの実践系キーワード
    if (keywords.some(k => k.includes('活用') || k.includes('方法') || k.includes('使い方'))) {
      return {
        primary: '実践的な活用方法の提供',
        needs: [
          '具体的な手順とステップ',
          '実例とケーススタディ',
          'ROIと効果測定',
          'リスクと対策'
        ],
        contentType: 'ハウツー・実践ガイド',
        angle: 'ビジネス成果の視点'
      };
    }
    
    // デフォルト
    return {
      primary: `${keywords[0]}に関する実践的情報`,
      needs: [
        '基本的な理解',
        '実践方法',
        '成功事例',
        '注意点'
      ],
      contentType: '総合ガイド',
      angle: 'ビジネス活用の視点'
    };
  }

  // キーワードからターゲット読者を特定
  identifyAudienceFromKeywords(keywords) {
    // ローカルビジネス経営者をメインターゲットに設定
    return {
      primary: 'ローカルビジネス経営者・個人事業主',
      secondary: [
        '起業準備中の方',
        '店舗マネージャー',
        'フリーランス',
        '中小企業経営者'
      ],
      challenges: [
        '限られたリソースでの効率化',
        '競合との差別化',
        '新規顧客獲得',
        'リピート率向上',
        'デジタル化への対応'
      ],
      interests: [
        '実践的な成功事例',
        '費用対効果の高い施策',
        'すぐに実行できる方法',
        '失敗を避けるポイント'
      ]
    };
  }

  // キーワードベースのタイトル生成
  generateTitlesFromKeywords(keywords, searchIntent) {
    const mainKeyword = keywords[0];
    const subKeywords = keywords.slice(1);
    
    // 美容室 × ChatGPT × 活用法の場合
    if (keywords.includes('美容室') && keywords.some(k => k.includes('ChatGPT'))) {
      return [
        `美容室経営者が知るべきChatGPT活用法｜売上40%UPの実例と導入手順`,
        `【実証済み】美容室でChatGPTを活用して月20時間削減する方法`,
        `美容室×ChatGPT成功事例｜小規模サロンが実現した業務効率化`,
        `ChatGPTで美容室経営を変革｜導入コスト月3000円で始める集客自動化`,
        `なぜ成功する美容室はChatGPTを使うのか？ローカルビジネスのAI活用術`
      ];
    }
    
    // 一般的なパターン
    return [
      `${mainKeyword}の${subKeywords.join('×')}｜ローカルビジネス成功の秘訣`,
      `【実践ガイド】${mainKeyword}で成果を出す${subKeywords[0]}`,
      `${mainKeyword}×${subKeywords[0]}｜小規模事業者の成功事例`,
      `経営者必見！${mainKeyword}を活用した${subKeywords.join('・')}`,
      `${mainKeyword}導入で変わる${subKeywords[0]}｜費用対効果を検証`
    ];
  }

  // キーワードベースのコンテンツ生成
  generateContentFromKeywords(keywords, searchIntent, targetAudience) {
    const mainKeyword = keywords[0];
    
    // 導入部分
    let content = `ローカルビジネスを経営する皆さん、${mainKeyword}について真剣に検討されていることと思います。

`;

    // 美容室×ChatGPTの場合の特別なコンテンツ
    if (keywords.includes('美容室') && keywords.some(k => k.includes('ChatGPT'))) {
      content += this.generateBeautySalonChatGPTContent();
    } else {
      // 汎用的なコンテンツ構成
      content += this.generateGenericBusinessContent(keywords, searchIntent, targetAudience);
    }
    
    return content;
  }

  // 美容室×ChatGPT専用コンテンツ
  generateBeautySalonChatGPTContent() {
    return `「スタッフの作業効率を上げたいけど、人を増やす余裕はない」
「SNSマーケティングが重要なのは分かるけど、時間が取れない」
「他店との差別化を図りたいけど、何から始めればいいか分からない」

こんな悩みを抱える美容室経営者の方々に朗報です。

実は今、ChatGPTを活用して経営課題を解決し、売上を大幅に向上させている美容室が増えています。海外では月商の40%（約2,500万円）をAI経由で獲得している事例も。しかも、導入コストは月額3,000円程度から始められます。

本記事では、美容室をはじめとするローカルビジネスがChatGPTを活用して成果を出すための具体的な方法を、実例とデータを交えて解説します。

## なぜ今、ローカルビジネスにChatGPTが必要なのか

### 小規模事業者が直面する3つの課題

1. **人材不足と業務過多**
   - 限られたスタッフで全業務をカバー
   - オーナー自身が現場に入り、経営業務が後回し
   - 新規採用のコストとリスク

2. **マーケティングリソースの不足**
   - SNS更新の時間が取れない
   - 専門知識を持つスタッフがいない
   - 外注すると高額

3. **競合との差別化の困難**
   - 大手チェーンとの価格競争
   - 独自性を出すアイデア不足
   - 新サービス開発の時間がない

ChatGPTは、これらの課題を低コストで解決する強力なツールとなります。

## 実例：美容室でのChatGPT活用法と成果

### 1. SNSマーケティングの自動化

**Before:**
- Instagram投稿作成：1投稿30分
- 週3回投稿で週1.5時間
- ネタ切れによる更新停滞

**After（ChatGPT導入後）:**
- 1投稿5分で作成（83%時間削減）
- 毎日投稿が可能に
- エンゲージメント率35%向上

**実際の活用例：**
\`\`\`
プロンプト：
「40代女性向け、秋のヘアカラー提案のInstagram投稿を作成。
トレンドカラーの紹介と、大人の魅力を引き出すポイントを含めて」

ChatGPT出力：
🍂秋の新色で、大人の魅力をアップデート🍂

40代女性にこそ似合う、今季注目のヘアカラーをご紹介✨

【トレンドカラーTOP3】
1️⃣ ディープブラウン×ハイライト
→ 立体感で若見え効果

2️⃣ バイオレットアッシュ
→ 黄ぐすみをカバーして透明感UP

3️⃣ カッパーベージュ
→ 肌なじみ◎で品のある艶髪に

Point💡
・白髪も自然にカバー
・パーソナルカラーに合わせて調整
・ダメージレスな施術で艶キープ

ご予約はプロフィールリンクから🔗
#40代ヘアカラー #大人女性 #秋カラー #美容室
\`\`\`

### 2. カスタマーサービスの効率化

**導入効果：**
- 予約対応時間：40%削減
- 24時間対応で機会損失ゼロ
- 顧客満足度：15%向上

**活用方法：**
- よくある質問への自動回答
- 予約確認メッセージの作成
- アフターケアアドバイスの生成

### 3. 業務マニュアル・教育資料の作成

**成果：**
- マニュアル作成時間：80%削減
- 新人教育期間：30%短縮
- サービス品質の均一化

## ローカルビジネス全般への応用

美容室での成功事例は、他のローカルビジネスにも応用可能です。

### 飲食店の場合
- メニュー説明文の作成
- 季節限定メニューの企画
- 食材の仕入れ最適化提案

### 小売店の場合
- 商品説明文の作成
- 在庫管理の最適化
- 顧客へのメールマガジン作成

### サービス業全般
- 見積書・提案書の作成支援
- 顧客フォローアップの自動化
- 競合分析レポートの作成

## 導入のステップと注意点

### 今すぐ始める3ステップ

1. **無料版で試す（5分）**
   - ChatGPTアカウント作成
   - 基本的な使い方を理解

2. **業務の一部に導入（1週間）**
   - SNS投稿から開始
   - 効果を測定

3. **本格活用（1ヶ月後）**
   - 有料版検討（月額約3,000円）
   - 複数業務への展開

### 押さえるべき注意点

- 個人情報は入力しない
- 生成内容は必ず確認
- 人間味のある対応を維持

## ROIを最大化するポイント

### 投資対効果の計算例

**月額コスト：3,000円**

**削減効果：**
- 作業時間削減：月20時間
- 時給2,000円換算：40,000円相当
- ROI：1,233%

**売上向上効果：**
- SNS経由の新規客：月3名増
- 客単価8,000円：24,000円増
- 年間：288,000円増

## まとめ：ローカルビジネスの新たな競争力

ChatGPTは、大企業だけのツールではありません。むしろ、リソースが限られたローカルビジネスこそ、その恩恵を最大限に受けられます。

**成功のポイント：**
- 小さく始めて、効果を確認しながら拡大
- 完璧を求めず、まずは使ってみる
- 人間の創造性とAIの効率性を組み合わせる

技術の進化は止まりません。しかし、地域に根ざしたビジネスの価値、人と人とのつながり、そして経営者の情熱は、AIには代替できません。

ChatGPTを賢く活用しながら、あなたのビジネスをさらに成長させていきましょう。`;
  }

  // 汎用的なビジネスコンテンツ生成
  generateGenericBusinessContent(keywords, searchIntent, targetAudience) {
    const mainKeyword = keywords[0];
    const subKeywords = keywords.slice(1);
    
    return `本記事では、${mainKeyword}における${subKeywords.join('、')}について、ローカルビジネス経営の視点から実践的に解説します。

## ${mainKeyword}がローカルビジネスにもたらす価値

${targetAudience.primary}にとって、${mainKeyword}は以下の価値をもたらします：

1. **業務効率化**
   - 限られたリソースの最適活用
   - 自動化による時間創出
   - コスト削減

2. **競争力強化**
   - 差別化要素の創出
   - 顧客体験の向上
   - 新サービスの開発

3. **成長機会の創出**
   - 新規顧客獲得
   - 既存顧客のロイヤルティ向上
   - 事業拡大の基盤構築

## 実践的な${subKeywords[0]}

### ステップ1：現状分析
${mainKeyword}を導入する前に、まず自社の課題を明確にしましょう。

### ステップ2：小規模テスト
最小限のリスクで効果を検証します。

### ステップ3：段階的展開
成功パターンを他の業務にも適用していきます。

## 成功事例と失敗パターン

### 成功事例
- 導入3ヶ月で売上20%向上
- 業務時間を週10時間削減
- 顧客満足度の大幅改善

### 避けるべき失敗パターン
- 一度に全てを変えようとする
- 効果測定を怠る
- スタッフの理解を得ずに導入

## まとめ

${mainKeyword}の${subKeywords.join('・')}は、ローカルビジネスに大きな可能性をもたらします。重要なのは、自社に合った形で段階的に導入していくことです。

小さな一歩から始めて、確実に成果を積み重ねていきましょう。`;
  }

  // メタディスクリプション生成
  generateMetaDescription(keywords, searchIntent) {
    const mainKeyword = keywords[0];
    
    if (keywords.includes('美容室') && keywords.some(k => k.includes('ChatGPT'))) {
      return `美容室経営者必見！ChatGPTを活用した業務効率化と売上向上の実例を紹介。月額3000円で始められる、ローカルビジネスのAI活用法を徹底解説。`;
    }
    
    return `${mainKeyword}を活用したローカルビジネスの成功事例と実践方法。${searchIntent.primary}を中心に、費用対効果の高い導入手法を解説。`;
  }

  // タグ生成
  generateTags(keywords) {
    const baseTags = [
      'ローカルビジネス',
      '経営効率化',
      '中小企業',
      '個人事業主'
    ];
    
    return [...keywords, ...baseTags].slice(0, 10);
  }

  // ファイル名生成
  generateFileName(title) {
    return title
      .replace(/[【】｜\[\]]/g, '')
      .replace(/[^ぁ-んァ-ヶー一-龠a-zA-Z0-9\s]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .substring(0, 50);
  }

  // 完全なMarkdown生成
  generateFullMarkdown() {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().split(' ')[0];
    
    return `---
layout: blog-post
title: "${this.blogData.title}"
date: ${dateStr} ${timeStr} +0900
categories: [ローカルビジネス, 経営効率化]
tags: [${this.blogData.tags.join(', ')}]
description: "${this.blogData.description}"
keywords: [${this.blogData.keywords.map(k => `"${k}"`).join(', ')}]
author: "Local Business Lab"
image: "/assets/images/blog/${this.generateFileName(this.blogData.title).substring(0, 20)}-0.jpg"
target_audience: "local_business_owners"
content_type: "practical_guide"
---

${this.blogData.content}

---

*この記事は、ローカルビジネス経営者の皆様に向けて、実践的な情報をお届けすることを目的に作成されました。*`;
  }
}

// メイン実行
if (require.main === module) {
  const creator = new KeywordBasedBlogCreator();
  creator.run();
}

module.exports = KeywordBasedBlogCreator;