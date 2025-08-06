#!/usr/bin/env node

// 簡単なブログ記事作成デモ
const fs = require('fs').promises;
const path = require('path');

async function createQuickBlogPost() {
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const filename = `${dateStr}-blog-wizard-demo.md`;
  const filepath = path.join('_posts', filename);

  // ランダムな本能とトピックを選択
  const instincts = [
    { name: '生存本能', keywords: ['安全', 'セキュリティ', '信頼性'] },
    { name: '快適本能', keywords: ['効率', '自動化', '便利'] },
    { name: '学習本能', keywords: ['知識', '成長', '革新'] },
    { name: '承認本能', keywords: ['成功', '実績', 'ブランド'] }
  ];

  const topics = [
    'ChatGPTを活用したマーケティング戦略',
    '顧客心理を読み解くデータ分析手法', 
    'SNSマーケティングの心理学的アプローチ',
    'ブランディングにおける感情マーケティング'
  ];

  const selectedInstinct = instincts[Math.floor(Math.random() * instincts.length)];
  const selectedTopic = topics[Math.floor(Math.random() * topics.length)];

  const content = `---
layout: blog-post
title: "${selectedTopic}"
date: ${dateStr} ${now.toTimeString().split(' ')[0]} +0900
categories: [AI心理学, マーケティング戦略]
instinct: ${selectedInstinct.name}
keywords: ${JSON.stringify(selectedInstinct.keywords.concat(['AI', 'マーケティング', 'LeadFive']))}
description: "${selectedInstinct.name}に訴求する${selectedTopic}について詳しく解説します。"
author: "LeadFive Team"
---

# ${selectedTopic}

## ${selectedInstinct.name}とマーケティング

人間の**${selectedInstinct.name}**を理解することで、より効果的なマーケティング戦略を構築できます。

### ${selectedInstinct.name}の特徴
${selectedInstinct.keywords.map(keyword => `- **${keyword}**: ${selectedInstinct.name}が求める重要な要素`).join('\n')}

## 実践的なアプローチ

### 1. 顧客理解の深化
${selectedInstinct.name}に訴求するためには、顧客の深層心理を理解する必要があります。

### 2. メッセージの最適化
効果的なコミュニケーションで${selectedInstinct.name}に響くメッセージを作成します。

### 3. 体験設計の改善
顧客体験全体を通じて${selectedInstinct.name}を満たすデザインを行います。

## まとめ

${selectedInstinct.name}を理解したマーケティング戦略により、顧客とのより深いつながりを築くことができます。

LeadFiveでは、8つの根源的欲求に基づく科学的なアプローチで、あなたのマーケティング成果を最大化します。

---

**お問い合わせ**: leadfive.138@gmail.com  
**無料相談**: [こちらから](/contact)

*この記事は、LeadFiveのブログウィザードによって自動生成されたデモ記事です。*
`;

  try {
    await fs.writeFile(filepath, content, 'utf8');
    console.log(`🎉 ブログ記事を作成しました！`);
    console.log(`📄 ファイル: ${filepath}`);
    console.log(`📝 タイトル: ${selectedTopic}`);
    console.log(`🎯 本能: ${selectedInstinct.name}`);
    console.log(`🔑 キーワード: ${selectedInstinct.keywords.join(', ')}`);
    console.log(`\n✨ 記事の内容をプレビューするには:`);
    console.log(`   bundle exec jekyll serve`);
    console.log(`   http://localhost:4000 でサイトを確認できます\n`);
  } catch (error) {
    console.error('❌ エラー:', error.message);
  }
}

// 使用例の表示
console.log(`
🚀 LeadFive ブログウィザード - 使用方法

📝 インタラクティブ記事作成:
   node blog-wizard.js

🤖 AI記事生成アシスタント:
   node blog-ai-assistant.js

⚡ クイック記事作成（このスクリプト）:
   node quick-blog-demo.js

🔧 Jekyll開発サーバー:
   bundle exec jekyll serve

📦 本番ビルド:
   npm run build:production

🚀 デプロイ:
   ./scripts/deploy.sh production

============================================
`);

createQuickBlogPost();