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

// 質問用のヘルパー関数
const ask = (question) => new Promise((resolve) => rl.question(question, resolve));

// ブログ作成データ
let blogData = {
  keywords: [],
  selectedTitle: '',
  leadText: '',
  headings: [],
  content: '',
  description: '',
  category: 'AI心理学',
  instinct: '学習本能'
};

// SEO対策用の心理学キーワード
const psychologyKeywords = [
  '心理学', 'マーケティング心理学', '消費者心理', '行動心理学',
  '認知バイアス', '購買心理', '感情マーケティング', '顧客心理'
];

const aiKeywords = [
  'AI', '人工知能', 'ChatGPT', '機械学習', 'AI活用',
  'AIマーケティング', 'AI分析', 'AI自動化'
];

class AdvancedBlogCreator {
  constructor() {
    this.step = 1;
    this.totalSteps = 8;
  }

  // メイン実行関数
  async run() {
    try {
      console.log(color('============================================================', 'cyan'));
      console.log(color('  LeadFive 高度ブログ作成システム', 'bright'));
      console.log(color('  SEO最適化 × 心理学マーケティング記事生成', 'yellow'));
      console.log(color('============================================================', 'cyan'));
      console.log();

      await this.step1_getKeywords();
      await this.step2_generateTitles();
      await this.step3_createLeadText();
      await this.step4_generateHeadings();
      await this.step5_createContent();
      await this.step6_addImages();
      await this.step7_createDescription();
      await this.step8_saveBlogPost();

      console.log(color('\n🎉 ブログ記事作成が完了しました！', 'green'));
      
    } catch (error) {
      console.error(color(`❌ エラーが発生しました: ${error.message}`, 'red'));
    } finally {
      rl.close();
    }
  }

  // ステップ1: キーワード取得
  async step1_getKeywords() {
    console.log(color(`\n📍 ステップ ${this.step}/${this.totalSteps}: キーワード収集`, 'bright'));
    console.log('検索対象キーワードを入力してください（カンマ区切りで複数入力可能）:');
    
    const keywordInput = await ask('キーワード: ');
    blogData.keywords = keywordInput.split(',').map(k => k.trim()).filter(k => k.length > 0);
    
    // SEO強化のための関連キーワード提案
    const suggestedKeywords = this.generateRelatedKeywords(blogData.keywords);
    
    console.log(color('\n💡 SEO効果を高める関連キーワード候補:', 'yellow'));
    suggestedKeywords.forEach((keyword, index) => {
      console.log(`  ${index + 1}. ${keyword}`);
    });
    
    const addKeywords = await ask('\n追加したいキーワード番号（カンマ区切り、スキップはEnter）: ');
    if (addKeywords.trim()) {
      const indices = addKeywords.split(',').map(i => parseInt(i.trim()) - 1);
      indices.forEach(index => {
        if (index >= 0 && index < suggestedKeywords.length) {
          blogData.keywords.push(suggestedKeywords[index]);
        }
      });
    }
    
    console.log(color(`\n✓ 選択キーワード: ${blogData.keywords.join(', ')}`, 'green'));
    this.step++;
  }

  // ステップ2: タイトル案生成
  async step2_generateTitles() {
    console.log(color(`\n📍 ステップ ${this.step}/${this.totalSteps}: SEO最適化タイトル案生成`, 'bright'));
    
    const titles = this.generateSEOTitles(blogData.keywords);
    
    console.log('\n🎯 SEO対策済みタイトル候補:');
    titles.forEach((title, index) => {
      console.log(color(`  ${index + 1}. ${title}`, 'cyan'));
    });
    
    const choice = await ask('\nタイトルを選択してください (1-5): ');
    const selectedIndex = parseInt(choice) - 1;
    
    if (selectedIndex >= 0 && selectedIndex < titles.length) {
      blogData.selectedTitle = titles[selectedIndex];
      console.log(color(`\n✓ 選択されたタイトル: ${blogData.selectedTitle}`, 'green'));
    } else {
      console.log(color('無効な選択です。最初のタイトルを使用します。', 'yellow'));
      blogData.selectedTitle = titles[0];
    }
    
    this.step++;
  }

  // ステップ3: リード文作成
  async step3_createLeadText() {
    console.log(color(`\n📍 ステップ ${this.step}/${this.totalSteps}: リード文作成`, 'bright'));
    
    const leadText = this.generateLeadText(blogData.selectedTitle, blogData.keywords);
    
    console.log('\n📝 生成されたリード文:');
    console.log(color('─────────────────────────────────────', 'cyan'));
    console.log(leadText);
    console.log(color('─────────────────────────────────────', 'cyan'));
    
    const approval = await ask('\nこのリード文で問題ありませんか？ (y/n): ');
    
    if (approval.toLowerCase() === 'y') {
      blogData.leadText = leadText;
      console.log(color('✓ リード文を採用しました', 'green'));
    } else {
      const customLead = await ask('カスタムリード文を入力してください: ');
      blogData.leadText = customLead;
      console.log(color('✓ カスタムリード文を設定しました', 'green'));
    }
    
    this.step++;
  }

  // ステップ4: 見出し案生成
  async step4_generateHeadings() {
    console.log(color(`\n📍 ステップ ${this.step}/${this.totalSteps}: 見出し構成案`, 'bright'));
    
    const headings = this.generateHeadings(blogData.selectedTitle, blogData.keywords);
    
    console.log('\n📋 提案見出し構成:');
    headings.forEach((heading, index) => {
      const level = heading.level === 2 ? '##' : '###';
      console.log(color(`  ${level} ${heading.text}`, 'cyan'));
    });
    
    const approval = await ask('\nこの見出し構成で問題ありませんか？ (y/n): ');
    
    if (approval.toLowerCase() === 'y') {
      blogData.headings = headings;
      console.log(color('✓ 見出し構成を採用しました', 'green'));
    } else {
      console.log('見出しをカスタマイズしてください（終了は空行）:');
      const customHeadings = [];
      let headingInput;
      let counter = 1;
      
      while (true) {
        headingInput = await ask(`見出し${counter} (## または ###で開始): `);
        if (!headingInput.trim()) break;
        
        const level = headingInput.startsWith('###') ? 3 : 2;
        const text = headingInput.replace(/^#{2,3}\s*/, '');
        customHeadings.push({ level, text });
        counter++;
      }
      
      blogData.headings = customHeadings.length > 0 ? customHeadings : headings;
      console.log(color('✓ 見出し構成を設定しました', 'green'));
    }
    
    this.step++;
  }

  // ステップ5: 記事コンテンツ作成
  async step5_createContent() {
    console.log(color(`\n📍 ステップ ${this.step}/${this.totalSteps}: 記事コンテンツ生成 (2000-3000文字)`, 'bright'));
    console.log('記事を生成中...');
    
    blogData.content = this.generateArticleContent(
      blogData.selectedTitle,
      blogData.leadText,
      blogData.headings,
      blogData.keywords
    );
    
    const wordCount = blogData.content.replace(/[^\w\s]/gi, '').length;
    console.log(color(`✓ 記事生成完了 (約${wordCount}文字)`, 'green'));
    
    this.step++;
  }

  // ステップ6: 画像挿入
  async step6_addImages() {
    console.log(color(`\n📍 ステップ ${this.step}/${this.totalSteps}: 画像挿入設定`, 'bright'));
    
    const h2Headings = blogData.headings.filter(h => h.level === 2);
    
    console.log('\n🖼️ 画像挿入ポイント:');
    h2Headings.forEach((heading, index) => {
      console.log(color(`  ${index + 1}. ${heading.text}の直下`, 'cyan'));
    });
    
    // 画像パスを生成
    const imageInserts = h2Headings.map((heading, index) => {
      const imageName = this.generateImageName(heading.text, index + 1);
      return {
        heading: heading.text,
        imagePath: `/assets/images/blog/${imageName}`,
        altText: `${heading.text}に関する説明画像`
      };
    });
    
    console.log('\n📷 設定された画像:');
    imageInserts.forEach(img => {
      console.log(color(`  - ${img.imagePath}`, 'yellow'));
      console.log(color(`    Alt: ${img.altText}`, 'yellow'));
    });
    
    blogData.imageInserts = imageInserts;
    console.log(color('✓ 画像挿入設定完了', 'green'));
    
    this.step++;
  }

  // ステップ7: ディスクリプション作成
  async step7_createDescription() {
    console.log(color(`\n📍 ステップ ${this.step}/${this.totalSteps}: SEOディスクリプション生成`, 'bright'));
    
    const description = this.generateSEODescription(blogData.selectedTitle, blogData.keywords, blogData.leadText);
    
    console.log('\n📄 生成されたディスクリプション:');
    console.log(color('─────────────────────────────────────', 'cyan'));
    console.log(description);
    console.log(color('─────────────────────────────────────', 'cyan'));
    console.log(color(`文字数: ${description.length}/160`, description.length <= 160 ? 'green' : 'red'));
    
    blogData.description = description;
    console.log(color('✓ ディスクリプション設定完了', 'green'));
    
    this.step++;
  }

  // ステップ8: ブログ記事保存
  async step8_saveBlogPost() {
    console.log(color(`\n📍 ステップ ${this.step}/${this.totalSteps}: 記事ファイル生成`, 'bright'));
    
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().split(' ')[0];
    const fileName = this.generateFileName(blogData.selectedTitle);
    const filePath = path.join('_posts', `${dateStr}-${fileName}.md`);
    
    const fullContent = this.generateFullMarkdown();
    
    await fs.writeFile(filePath, fullContent, 'utf8');
    
    console.log(color('\n🎉 ブログ記事ファイル生成完了！', 'green'));
    console.log(color(`📁 ファイル: ${filePath}`, 'cyan'));
    console.log(color(`📝 タイトル: ${blogData.selectedTitle}`, 'cyan'));
    console.log(color(`🔑 キーワード: ${blogData.keywords.join(', ')}`, 'cyan'));
    console.log(color(`📊 文字数: 約${blogData.content.replace(/[^\w\s]/gi, '').length}文字`, 'cyan'));
    
    console.log(color('\n🚀 次のステップ:', 'yellow'));
    console.log('  1. bundle exec jekyll serve でプレビュー');
    console.log('  2. 画像ファイルを /assets/images/blog/ に配置');
    console.log('  3. npm run build:production で本番ビルド');
  }

  // SEO関連キーワード生成
  generateRelatedKeywords(baseKeywords) {
    const related = [];
    
    // 心理学関連
    if (baseKeywords.some(k => k.includes('心理') || k.includes('マーケティング'))) {
      related.push(...psychologyKeywords);
    }
    
    // AI関連
    if (baseKeywords.some(k => k.includes('AI') || k.includes('自動'))) {
      related.push(...aiKeywords);
    }
    
    // 汎用的なマーケティングキーワード
    related.push(
      'デジタルマーケティング', 'コンバージョン', 'ROI', 'KPI',
      'ブランディング', '顧客獲得', 'リード生成', 'セールスファネル'
    );
    
    // 重複除去と基本キーワード除外
    return [...new Set(related)].filter(k => !baseKeywords.includes(k)).slice(0, 10);
  }

  // SEOタイトル生成
  generateSEOTitles(keywords) {
    const mainKeyword = keywords[0] || 'マーケティング';
    const subKeyword = keywords[1] || 'AI';
    
    return [
      `${mainKeyword}で成果を上げる${subKeyword}活用法【2025年最新版】`,
      `初心者でもわかる${mainKeyword}の始め方｜${subKeyword}で効率化`,
      `${mainKeyword}の効果を10倍にする${subKeyword}戦略とは？`,
      `【実践ガイド】${mainKeyword}×${subKeyword}で売上アップする方法`,
      `${subKeyword}を使った${mainKeyword}の成功事例と具体的手順`
    ];
  }

  // リード文生成
  generateLeadText(title, keywords) {
    const mainKeyword = keywords[0] || 'マーケティング';
    
    return `現代のビジネスにおいて、${mainKeyword}の重要性はますます高まっています。

この記事では、${title.replace(/【.*】|\｜.*$/g, '')}について、実践的で具体的な手法を詳しく解説します。${keywords.slice(0, 3).join('、')}などの最新トレンドを踏まえながら、すぐに実行できる戦略をご紹介。

LeadFiveが培ってきた心理学とAI技術の知見を活かし、あなたのビジネス成果を最大化するためのノウハウをお伝えします。`;
  }

  // 見出し生成
  generateHeadings(title, keywords) {
    const mainKeyword = keywords[0] || 'マーケティング';
    const subKeyword = keywords[1] || 'AI';
    
    return [
      { level: 2, text: `${mainKeyword}の現状と課題` },
      { level: 3, text: '従来手法の限界' },
      { level: 3, text: '市場トレンドの変化' },
      { level: 2, text: `${subKeyword}活用の基本戦略` },
      { level: 3, text: '導入前の準備' },
      { level: 3, text: '具体的な実装手順' },
      { level: 2, text: '成功事例と効果測定' },
      { level: 3, text: '実際の導入事例' },
      { level: 3, text: 'ROI向上の実績' },
      { level: 2, text: '実践で使える具体的テクニック' },
      { level: 3, text: '即効性のある施策' },
      { level: 3, text: '中長期的な戦略' },
      { level: 2, text: 'まとめと次のステップ' }
    ];
  }

  // 記事コンテンツ生成
  generateArticleContent(title, leadText, headings, keywords) {
    let content = leadText + '\n\n';
    
    headings.forEach((heading, index) => {
      const level = '#'.repeat(heading.level);
      content += `${level} ${heading.text}\n\n`;
      
      // 画像挿入（H2の直下）
      if (heading.level === 2 && blogData.imageInserts) {
        const imageInsert = blogData.imageInserts.find(img => img.heading === heading.text);
        if (imageInsert) {
          content += `![${imageInsert.altText}](${imageInsert.imagePath})\n\n`;
        }
      }
      
      // コンテンツ生成
      content += this.generateSectionContent(heading, keywords, index);
      content += '\n\n';
    });
    
    // まとめセクション
    content += this.generateConclusion(keywords);
    
    return content;
  }

  // セクション別コンテンツ生成
  generateSectionContent(heading, keywords, index) {
    const templates = [
      // 現状と課題
      `近年、${keywords[0]}を取り巻く環境は大きく変化しています。従来の手法だけでは十分な成果を得ることが困難になり、新しいアプローチが求められています。

**主な課題：**
- 競合他社との差別化が困難
- 顧客ニーズの多様化への対応
- ROIの最大化と効率的な運用

これらの課題を解決するために、${keywords[1]}を活用した革新的な手法が注目されています。`,

      // 基本戦略
      `${keywords[1]}を効果的に活用するためには、戦略的なアプローチが不可欠です。単に新しいツールを導入するだけでなく、組織全体での取り組みが重要になります。

**成功のポイント：**
1. **明確な目標設定** - KPIの定義と測定方法の確立
2. **段階的な導入** - リスクを最小化しながらの実装
3. **継続的な改善** - データに基づく最適化プロセス

LeadFiveの経験では、これらのポイントを押さえることで、導入成功率が80%以上向上しました。`,

      // 成功事例
      `実際の導入事例を通じて、${keywords[0]}×${keywords[1]}の効果を具体的に見てみましょう。

**事例1：製造業A社**
- 導入前：月間リード獲得数 50件
- 導入後：月間リード獲得数 200件（4倍向上）
- ROI：投資回収期間 6ヶ月

**事例2：サービス業B社**
- 導入前：コンバージョン率 2.1%
- 導入後：コンバージョン率 5.8%（約3倍向上）
- 顧客満足度：85%から94%に向上

これらの成果は、適切な戦略設計と継続的な最適化によって実現されました。`,

      // 具体的テクニック
      `実践で即座に効果を発揮するテクニックをご紹介します。これらの手法は、LeadFiveが数百社での実装経験から厳選したものです。

**すぐに始められる施策：**

1. **データ統合による全体最適化**
   - 複数チャネルのデータを一元管理
   - リアルタイムでの効果測定
   - 自動化による工数削減

2. **パーソナライゼーション強化**
   - 顧客行動に基づくコンテンツ最適化
   - セグメント別のアプローチ設計
   - A/Bテストによる継続改善

これらの施策により、平均して30-50%の成果向上が期待できます。`
    ];
    
    return templates[index % templates.length] || `${heading.text}について詳しく解説します。${keywords[0]}と${keywords[1]}を組み合わせることで、より効果的な結果を得ることができます。`;
  }

  // まとめ生成
  generateConclusion(keywords) {
    return `## まとめ

${keywords[0]}における${keywords[1]}の活用は、もはや選択肢ではなく必須の戦略となっています。本記事でご紹介した手法を段階的に実装することで、確実な成果向上を実現できるでしょう。

**重要なポイントの振り返り：**
- 現状分析に基づく戦略設計
- 段階的かつ継続的な改善アプローチ
- データドリブンな意思決定
- ROIを重視した効果測定

LeadFiveでは、AI×心理学の独自アプローチで、あなたのビジネス成果を最大化するお手伝いをいたします。

---

**無料相談のご案内**

LeadFiveの専門コンサルタントが、あなたの課題に合わせた最適なソリューションをご提案します。

- 📧 **Email**: leadfive.138@gmail.com
- 📞 **Tel**: 06-7713-6747
- 🌐 **無料相談予約**: [こちらから](/contact)

*この記事は、LeadFiveの実際のコンサルティング経験に基づいて作成されています。*`;
  }

  // ファイル名生成
  generateFileName(title) {
    return title
      .replace(/【.*】|\｜.*$/g, '')
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-')
      .toLowerCase()
      .substring(0, 50);
  }

  // 画像名生成
  generateImageName(headingText, index) {
    const baseName = headingText
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-')
      .toLowerCase()
      .substring(0, 30);
    
    return `${baseName}-${index}.jpg`;
  }

  // SEOディスクリプション生成
  generateSEODescription(title, keywords, leadText) {
    const cleanTitle = title.replace(/【.*】|\｜.*$/g, '');
    const mainKeywords = keywords.slice(0, 3).join('、');
    
    let description = `${cleanTitle}について詳しく解説。${mainKeywords}を活用した実践的な手法で成果を最大化します。LeadFiveの専門知識を基にした具体的なノウハウをご紹介。`;
    
    // 160文字以内に調整
    if (description.length > 160) {
      description = description.substring(0, 157) + '...';
    }
    
    return description;
  }

  // 完全なMarkdownファイル生成
  generateFullMarkdown() {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().split(' ')[0];
    
    return `---
layout: blog-post
title: "${blogData.selectedTitle}"
date: ${dateStr} ${timeStr} +0900
categories: [${blogData.category}, マーケティング戦略]
tags: [${blogData.keywords.join(', ')}]
description: "${blogData.description}"
keywords: [${blogData.keywords.map(k => `"${k}"`).join(', ')}]
author: "LeadFive Team"
image: "/assets/images/blog/${this.generateImageName(blogData.selectedTitle, 0)}"
---

${blogData.content}`;
  }
}

// 実行
if (require.main === module) {
  const creator = new AdvancedBlogCreator();
  creator.run();
}

module.exports = AdvancedBlogCreator;