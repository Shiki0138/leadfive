#!/usr/bin/env node

/**
 * Gemini API テスト用モックジェネレーター
 * APIキーなしで動作確認可能
 */

const fs = require('fs').promises;
const path = require('path');

async function generateMockPost(keyword) {
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0];
  const title = `【Gemini生成】${keyword}で成果を出す実践ガイド`;
  
  const content = `---
layout: post
title: "${title}"
date: ${dateStr}
categories: [AIマーケティング, 自動化]
tags: [${keyword}, Gemini, AI活用, マーケティング自動化]
author: AI Assistant
excerpt: "${keyword}を活用した最新のマーケティング手法について、実践的なアプローチを解説します。"
featured: true
image: /assets/images/blog/${dateStr}-gemini-test.jpg
---

# ${title}

## はじめに

${keyword}は、現代のビジネスにおいて欠かせない要素となっています。本記事では、実践的な活用方法を詳しく解説します。

## 主要なポイント

### 1. 基本概念の理解
${keyword}を効果的に活用するためには、まず基本的な概念を理解することが重要です。

### 2. 実装手順
1. 初期設定を行う
2. 必要なツールを準備する
3. 段階的に実装を進める

### 3. 効果測定
- KPIの設定
- データ収集
- 分析と改善

## 成功事例

多くの企業が${keyword}を活用して成果を上げています：

- **事例1**: 売上30%向上
- **事例2**: 作業時間50%削減
- **事例3**: 顧客満足度20%改善

## まとめ

${keyword}は適切に活用すれば、大きな成果をもたらします。まずは小さく始めて、徐々に規模を拡大していくことをお勧めします。

---

*この記事はGemini APIモックジェネレーターによって生成されました。*
`;

  const filename = `${dateStr}-gemini-test-${keyword.replace(/\s+/g, '-').toLowerCase()}.md`;
  const filepath = path.join(__dirname, '../../_posts', filename);
  
  await fs.writeFile(filepath, content, 'utf-8');
  
  console.log(`✅ モック記事を生成しました: ${filename}`);
  console.log(`📍 保存先: ${filepath}`);
  return filename;
}

// メイン実行
if (require.main === module) {
  const keyword = process.argv[2] || 'AIマーケティング';
  generateMockPost(keyword).catch(console.error);
}

module.exports = { generateMockPost };