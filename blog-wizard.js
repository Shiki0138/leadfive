#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const readline = require('readline');
const { v4: uuidv4 } = require('uuid');
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

const color = (text, color) => `${colors[color]}${text}${colors.reset}`;

// 8つの本能に基づくテーマ
const instinctThemes = {
  '1': { name: '生存本能', keywords: ['安全', 'セキュリティ', 'リスク回避', '保護', '信頼性'] },
  '2': { name: '食欲本能', keywords: ['満足', '充実', '豊かさ', '品質', '価値'] },
  '3': { name: '性的本能', keywords: ['魅力', '美しさ', 'デザイン', 'エレガンス', '洗練'] },
  '4': { name: '危機回避本能', keywords: ['予防', '対策', '問題解決', '改善', '最適化'] },
  '5': { name: '快適本能', keywords: ['便利', '効率', '自動化', '簡単', 'スマート'] },
  '6': { name: '愛情本能', keywords: ['つながり', 'コミュニティ', '共感', 'サポート', '関係性'] },
  '7': { name: '承認本能', keywords: ['成功', '実績', '評価', 'ブランド', 'ステータス'] },
  '8': { name: '学習本能', keywords: ['知識', '成長', 'スキル', '革新', 'トレンド'] }
};

// ブログカテゴリー
const categories = {
  '1': 'AI心理学',
  '2': 'マーケティング戦略',
  '3': 'ケーススタディ',
  '4': '業界トレンド',
  '5': 'ツール・技術',
  '6': 'ベストプラクティス'
};

// 記事テンプレート
const articleTemplates = {
  'how-to': {
    name: 'ハウツー記事',
    structure: ['問題提起', '解決策の概要', 'ステップバイステップ', '実例', 'まとめ']
  },
  'analysis': {
    name: '分析・考察記事',
    structure: ['現状分析', 'データ・根拠', '考察', '予測', '提言']
  },
  'case-study': {
    name: 'ケーススタディ',
    structure: ['背景', '課題', '解決アプローチ', '結果', '学び']
  },
  'trend': {
    name: 'トレンド記事',
    structure: ['トレンドの概要', '背景・要因', '影響', '活用方法', '今後の展望']
  },
  'comparison': {
    name: '比較記事',
    structure: ['比較対象の紹介', '評価基準', '詳細比較', '結論', '推奨事項']
  }
};

class BlogWizard {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    this.postData = {
      id: uuidv4(),
      date: new Date(),
      instinct: null,
      category: null,
      template: null,
      title: '',
      description: '',
      keywords: [],
      outline: [],
      content: '',
      metadata: {}
    };
  }

  async question(prompt) {
    return new Promise((resolve) => {
      this.rl.question(prompt, resolve);
    });
  }

  async displayWelcome() {
    console.clear();
    console.log(color('='.repeat(60), 'cyan'));
    console.log(color('  LeadFive ブログ投稿ウィザード', 'bright'));
    console.log(color('  AI×心理学マーケティングの記事を作成します', 'yellow'));
    console.log(color('='.repeat(60), 'cyan'));
    console.log();
  }

  async selectInstinct() {
    console.log(color('\n📍 ステップ 1: 本能の選択', 'bright'));
    console.log('どの本能に訴求する記事を作成しますか？\n');
    
    Object.entries(instinctThemes).forEach(([key, value]) => {
      console.log(`  ${color(key, 'green')}. ${value.name}`);
      console.log(`     キーワード: ${value.keywords.join(', ')}`);
    });

    const choice = await this.question('\n番号を選択してください: ');
    if (instinctThemes[choice]) {
      this.postData.instinct = instinctThemes[choice];
      console.log(color(`\n✓ ${this.postData.instinct.name}を選択しました`, 'green'));
    } else {
      console.log(color('\n無効な選択です。もう一度お試しください。', 'red'));
      return this.selectInstinct();
    }
  }

  async selectCategory() {
    console.log(color('\n📍 ステップ 2: カテゴリーの選択', 'bright'));
    console.log('記事のカテゴリーを選択してください：\n');
    
    Object.entries(categories).forEach(([key, value]) => {
      console.log(`  ${color(key, 'green')}. ${value}`);
    });

    const choice = await this.question('\n番号を選択してください: ');
    if (categories[choice]) {
      this.postData.category = categories[choice];
      console.log(color(`\n✓ ${this.postData.category}を選択しました`, 'green'));
    } else {
      console.log(color('\n無効な選択です。もう一度お試しください。', 'red'));
      return this.selectCategory();
    }
  }

  async selectTemplate() {
    console.log(color('\n📍 ステップ 3: 記事テンプレートの選択', 'bright'));
    console.log('使用する記事の構成を選択してください：\n');
    
    let index = 1;
    const templateKeys = Object.keys(articleTemplates);
    
    Object.entries(articleTemplates).forEach(([key, value]) => {
      console.log(`  ${color(index.toString(), 'green')}. ${value.name}`);
      console.log(`     構成: ${value.structure.join(' → ')}`);
      index++;
    });

    const choice = await this.question('\n番号を選択してください: ');
    const selectedKey = templateKeys[parseInt(choice) - 1];
    
    if (selectedKey) {
      this.postData.template = { key: selectedKey, ...articleTemplates[selectedKey] };
      console.log(color(`\n✓ ${this.postData.template.name}を選択しました`, 'green'));
    } else {
      console.log(color('\n無効な選択です。もう一度お試しください。', 'red'));
      return this.selectTemplate();
    }
  }

  async generateTitleSuggestions() {
    console.log(color('\n📍 ステップ 4: タイトルの作成', 'bright'));
    console.log('\nAIがタイトル案を生成しています...\n');

    // タイトル案の生成ロジック
    const suggestions = [
      `${this.postData.category}で${this.postData.instinct.name}を刺激する5つの方法`,
      `なぜ${this.postData.instinct.keywords[0]}が${this.postData.category}の成功の鍵なのか`,
      `${new Date().getFullYear()}年の${this.postData.category}：${this.postData.instinct.keywords[1]}を重視すべき理由`,
      `${this.postData.instinct.name}×AI：次世代の${this.postData.category}戦略`,
      `実践！${this.postData.instinct.keywords[2]}を活用した${this.postData.category}の成功事例`
    ];

    suggestions.forEach((title, index) => {
      console.log(`  ${color((index + 1).toString(), 'green')}. ${title}`);
    });

    console.log(`  ${color('6', 'green')}. カスタムタイトルを入力`);

    const choice = await this.question('\n番号を選択してください: ');
    
    if (choice >= 1 && choice <= 5) {
      this.postData.title = suggestions[choice - 1];
    } else if (choice === '6') {
      this.postData.title = await this.question('タイトルを入力してください: ');
    } else {
      console.log(color('\n無効な選択です。もう一度お試しください。', 'red'));
      return this.generateTitleSuggestions();
    }

    console.log(color(`\n✓ タイトル: ${this.postData.title}`, 'green'));
  }

  async createOutline() {
    console.log(color('\n📍 ステップ 5: 記事構成の作成', 'bright'));
    console.log(`\n${this.postData.template.name}の構成に基づいて、各セクションの内容を決めます。\n`);

    this.postData.outline = [];

    for (const section of this.postData.template.structure) {
      console.log(color(`\n【${section}】`, 'yellow'));
      
      // セクションごとのヒントを表示
      const hints = this.getSectionHints(section);
      console.log(`ヒント: ${hints}`);
      
      const content = await this.question('このセクションの概要を入力してください: ');
      this.postData.outline.push({
        section,
        content
      });
    }

    console.log(color('\n✓ 記事構成が完成しました', 'green'));
  }

  getSectionHints(section) {
    const hints = {
      '問題提起': '読者が共感する課題や悩みを明確に',
      '解決策の概要': 'AIと心理学を組み合わせた独自のアプローチ',
      'ステップバイステップ': '具体的で実践可能な手順',
      '実例': 'LeadFiveの成功事例や具体的な数値',
      'まとめ': '重要ポイントの再確認と行動喚起',
      '現状分析': '市場データや統計を活用',
      'データ・根拠': '信頼できるソースからの引用',
      '考察': '独自の視点での分析',
      '予測': '今後のトレンドや展望',
      '提言': '読者への具体的なアドバイス'
    };
    return hints[section] || '具体的で価値のある情報を提供';
  }

  async addMetadata() {
    console.log(color('\n📍 ステップ 6: メタデータの設定', 'bright'));
    
    this.postData.description = await this.question('\n記事の説明（SEO用、150文字程度）: ');
    
    const keywordsInput = await this.question('キーワード（カンマ区切り）: ');
    this.postData.keywords = keywordsInput.split(',').map(k => k.trim());
    
    const authorName = await this.question('著者名（デフォルト: LeadFive編集部）: ') || 'LeadFive編集部';
    this.postData.metadata.author = authorName;

    console.log(color('\n✓ メタデータの設定が完了しました', 'green'));
  }

  async generateContent() {
    console.log(color('\n📍 ステップ 7: 記事の生成', 'bright'));
    console.log('\nAIアシスタントが記事の下書きを生成しています...\n');

    // 記事の下書きを生成
    let content = `---
layout: post
title: "${this.postData.title}"
date: ${this.postData.date.toISOString()}
categories: [${this.postData.category}]
tags: [${this.postData.keywords.join(', ')}]
author: ${this.postData.metadata.author}
description: "${this.postData.description}"
image: /assets/images/blog/${this.postData.date.toISOString().split('T')[0]}-thumbnail.jpg
instinct: ${this.postData.instinct.name}
---

`;

    // アウトラインに基づいてコンテンツを生成
    for (const section of this.postData.outline) {
      content += `## ${section.section}\n\n`;
      content += `${section.content}\n\n`;
      
      // AIによる内容の拡張（プレースホルダー）
      content += `[このセクションの詳細な内容をここに記述します。${this.postData.instinct.keywords.join('、')}などのキーワードを自然に組み込み、読者に価値を提供する内容にしてください。]\n\n`;
    }

    // CTAセクションを追加
    content += `## まとめ\n\n`;
    content += `本記事では、${this.postData.title}について解説しました。${this.postData.instinct.name}に訴求するアプローチは、現代のマーケティングにおいて非常に効果的です。\n\n`;
    content += `LeadFiveでは、AI×心理学を活用したマーケティング戦略の立案から実行まで、包括的にサポートしています。\n\n`;
    content += `<div class="cta-box">\n`;
    content += `  <h3>無料相談実施中</h3>\n`;
    content += `  <p>あなたのビジネスに最適なAI×心理学マーケティング戦略をご提案します。</p>\n`;
    content += `  <a href="/contact" class="btn btn-primary">お問い合わせはこちら</a>\n`;
    content += `</div>\n`;

    this.postData.content = content;
    console.log(color('✓ 記事の下書きが生成されました', 'green'));
  }

  async reviewAndEdit() {
    console.log(color('\n📍 ステップ 8: レビューと編集', 'bright'));
    console.log('\n生成された記事の概要：\n');
    
    console.log(color('タイトル:', 'yellow'), this.postData.title);
    console.log(color('カテゴリー:', 'yellow'), this.postData.category);
    console.log(color('本能:', 'yellow'), this.postData.instinct.name);
    console.log(color('説明:', 'yellow'), this.postData.description);
    console.log(color('キーワード:', 'yellow'), this.postData.keywords.join(', '));
    console.log();

    const actions = [
      '1. 記事を保存して公開',
      '2. 記事を下書きとして保存',
      '3. エディタで開いて編集',
      '4. 破棄して最初からやり直す'
    ];

    actions.forEach(action => console.log(color(action, 'cyan')));
    
    const choice = await this.question('\n選択してください: ');
    return choice;
  }

  async savePost(isDraft = false) {
    const date = this.postData.date.toISOString().split('T')[0];
    const slug = this.postData.title
      .toLowerCase()
      .replace(/[^a-z0-9\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 50);
    
    const filename = `${date}-${slug}.md`;
    const filepath = path.join('_posts', filename);

    if (isDraft) {
      this.postData.content = this.postData.content.replace('layout: post', 'layout: post\npublished: false');
    }

    try {
      await fs.writeFile(filepath, this.postData.content, 'utf8');
      console.log(color(`\n✓ 記事を保存しました: ${filepath}`, 'green'));
      
      // サムネイル画像のプレースホルダーも作成
      const imageDir = path.join('assets', 'images', 'blog');
      await fs.mkdir(imageDir, { recursive: true });
      
      // 記事の履歴を保存
      const historyDir = path.join('.blog-wizard', 'history');
      await fs.mkdir(historyDir, { recursive: true });
      const historyFile = path.join(historyDir, `${this.postData.id}.json`);
      await fs.writeFile(historyFile, JSON.stringify(this.postData, null, 2), 'utf8');
      
    } catch (error) {
      console.log(color(`\nエラー: ${error.message}`, 'red'));
    }
  }

  async openInEditor() {
    const tempFile = path.join('.blog-wizard', 'temp', `${this.postData.id}.md`);
    const tempDir = path.dirname(tempFile);
    
    await fs.mkdir(tempDir, { recursive: true });
    await fs.writeFile(tempFile, this.postData.content, 'utf8');
    
    console.log(color(`\n記事をエディタで開きます: ${tempFile}`, 'yellow'));
    console.log('編集が完了したら、このウィザードに戻って保存してください。');
    
    // エディタで開く（環境に応じて変更）
    const { exec } = require('child_process');
    exec(`${process.env.EDITOR || 'code'} "${tempFile}"`);
  }

  async run() {
    await this.displayWelcome();
    await this.selectInstinct();
    await this.selectCategory();
    await this.selectTemplate();
    await this.generateTitleSuggestions();
    await this.createOutline();
    await this.addMetadata();
    await this.generateContent();
    
    const action = await this.reviewAndEdit();
    
    switch (action) {
      case '1':
        await this.savePost(false);
        console.log(color('\n🎉 記事が公開されました！', 'bright'));
        break;
      case '2':
        await this.savePost(true);
        console.log(color('\n📝 記事が下書きとして保存されました。', 'bright'));
        break;
      case '3':
        await this.openInEditor();
        const continueChoice = await this.question('\n編集が完了しましたか？ (y/n): ');
        if (continueChoice.toLowerCase() === 'y') {
          await this.savePost(false);
        }
        break;
      case '4':
        console.log(color('\n記事の作成をキャンセルしました。', 'yellow'));
        break;
    }

    this.rl.close();
  }
}

// メイン実行
if (require.main === module) {
  const wizard = new BlogWizard();
  wizard.run().catch(error => {
    console.error(color(`\nエラーが発生しました: ${error.message}`, 'red'));
    process.exit(1);
  });
}

module.exports = BlogWizard;