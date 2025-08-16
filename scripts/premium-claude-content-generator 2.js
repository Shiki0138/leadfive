// ===== 🤖 Claude AI コンテンツ生成システム =====

const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');
const path = require('path');
const slugify = require('slugify');

// 設定
const CONFIG = {
  anthropicApiKey: process.env.ANTHROPIC_API_KEY,
  blogDir: path.join(__dirname, '..', '_posts'),
  maxTokens: 4000,
  model: 'claude-3-haiku-20240307'
};

// ===== 🧠 Claude AI でユニークコンテンツ生成 =====
async function generateUniqueContentWithClaude(dailyProposal, customInstruction = '') {
  const anthropic = new Anthropic({
    apiKey: CONFIG.anthropicApiKey
  });

  // カスタマイズ指示を解析
  const focusArea = analyzeFocusArea(customInstruction);
  
  const prompt = `あなたはLeadFive（AI×心理学マーケティング専門企業）の優秀なコンテンツライターです。

【記事要件】
- タイトル: ${dailyProposal.topic}
- テーマ: ${dailyProposal.weeklyTheme}
- カスタマイズ指示: ${customInstruction}
- 重点領域: ${focusArea}

【LeadFive独自の8つの本能アプローチを必ず含む】
1. 生存本能 - リスク回避の心理
2. 競争本能 - 他社との差別化  
3. 好奇心 - 新しい可能性への興味
4. 社会的承認 - 他者からの評価
5. 快楽追求 - 満足感・達成感
6. 帰属欲求 - コミュニティへの所属
7. 支配欲求 - コントロール感
8. 自己実現 - 成長・向上への欲求

【必須構成要素】
1. 問題提起（読み手の関心を即座に引きつける）
2. 解決策の段階的提示（実践しやすい形で）
3. 具体的事例とデータ（LeadFiveの実績を活用）
4. 失敗パターンと回避法
5. 今すぐできるアクションプラン

【記事品質要件】
- 文字数: 2500-3500文字
- 読了時間: 8-12分
- 見出し構造: h2-h6の階層的構成
- 引き込み要素: データ、事例、具体的数値を多用
- CTA: LeadFiveサービスへの自然な誘導

【文体・トーン】
- 専門的だが親しみやすい
- 断定的で自信のある表現
- 読者の行動を促す積極的な文体
- エビデンスベースの信頼性

【避けるべき表現】
- 一般的すぎる内容
- 他社でも言えること  
- 抽象的で実践性の低い提案
- データの裏付けのない主張

以下の形式でMarkdown記事を生成してください：

---
layout: blog-post
title: "[記事タイトル]"
date: [YYYY-MM-DD]
categories: [カテゴリ]
tags: [タグ1, タグ2, タグ3]
author: "LeadFive AI"
description: "[120文字以内のメタ説明]"
image: "[画像URL]"
---

# [記事タイトル]

## 🎯 この記事で得られること

[3-5行で記事の価値を明確に提示]

## [見出し1: 問題提起] 

[読者の抱える課題を具体的に提示し、共感を生む内容]

## [見出し2: LeadFive独自の解決アプローチ]

[8つの本能アプローチを具体的に説明]

### [小見出し2-1]
### [小見出し2-2] 
### [小見出し2-3]

## [見出し3: 実践的な実装方法]

[ステップバイステップの具体的手順]

## [見出し4: 成功事例とデータ]

[LeadFiveの実績と具体的な数値データ]

## [見出し5: よくある失敗と対策]

[読者が陥りがちな失敗パターンと回避法]

## [見出し6: 今すぐ実践できるアクションプラン]

[明日から実践できる具体的なステップ]

## まとめ：[テーマ]で成果を出す秘訣

[要点をまとめ、LeadFiveサービスへの自然な誘導]

---

**この記事はAI×心理学マーケティングの専門企業LeadFiveが、最新のトレンド分析と豊富な実例を基に作成しました。**

記事を生成してください。`;

  try {
    const message = await anthropic.messages.create({
      model: CONFIG.model,
      max_tokens: CONFIG.maxTokens,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    const content = message.content[0].text;
    
    // コンテンツを後処理
    const processedContent = postProcessContent(content, dailyProposal);
    
    console.log('✅ Claude AIによるユニークコンテンツ生成完了');
    return processedContent;

  } catch (error) {
    console.error('❌ Claude AI生成エラー:', error);
    
    // フォールバック：テンプレートベースの生成
    return generateFallbackContent(dailyProposal, customInstruction);
  }
}

// ===== 📝 コンテンツ後処理 =====
function postProcessContent(content, dailyProposal) {
  const today = new Date();
  const dateStr = new Date().toISOString().split('T')[0];
  
  // 日付とメタデータを設定
  let processedContent = content.replace('[YYYY-MM-DD]', dateStr);
  
  // カテゴリ設定
  const category = mapToCategory(dailyProposal.topic);
  processedContent = processedContent.replace('[カテゴリ]', category);
  
  // タグ生成
  const tags = generateTags(dailyProposal.topic, dailyProposal.weeklyTheme);
  processedContent = processedContent.replace('[タグ1, タグ2, タグ3]', tags.join(', '));
  
  // 画像URL処理（Unsplash最適化画像があれば置換）
  if (process.env.OPTIMIZED_IMAGE_URL) {
    processedContent = processedContent.replace('[画像URL]', process.env.OPTIMIZED_IMAGE_URL);
    processedContent = processedContent.replace('image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&h=630&fit=crop"', `image: "${process.env.OPTIMIZED_IMAGE_URL}"`);
  }
  
  return processedContent;
}

// ===== 🏷️ カテゴリマッピング =====
function mapToCategory(topic) {
  const categoryMap = {
    'ChatGPT': 'AIマーケティング',
    'AI': 'AIマーケティング', 
    '美容': '美容業界',
    'データ': 'データ分析',
    'SNS': 'データ分析',
    'マーケティング': 'AIマーケティング'
  };
  
  for (const [keyword, category] of Object.entries(categoryMap)) {
    if (topic.includes(keyword)) {
      return category;
    }
  }
  
  return 'AIマーケティング';
}

// ===== 🏷️ タグ生成 =====
function generateTags(topic, weeklyTheme) {
  const baseTags = ['LeadFive', 'AI活用'];
  
  // トピックからタグ抽出
  const topicTags = [];
  if (topic.includes('ChatGPT')) topicTags.push('ChatGPT');
  if (topic.includes('マーケティング')) topicTags.push('マーケティング戦略');
  if (topic.includes('美容')) topicTags.push('美容業界');
  if (topic.includes('データ')) topicTags.push('データ分析');
  if (topic.includes('SNS')) topicTags.push('SNSマーケティング');
  
  // 週次テーマからタグ抽出
  const themeTag = weeklyTheme.replace('週間', '').replace('AI', '').trim();
  if (themeTag) topicTags.push(themeTag);
  
  return [...baseTags, ...topicTags.slice(0, 3)];
}

// ===== 🎯 フォーカス領域分析 =====
function analyzeFocusArea(customInstruction) {
  if (!customInstruction) return '汎用的バランス重視';
  
  const instruction = customInstruction.toLowerCase();
  
  if (instruction.includes('データ') || instruction.includes('統計')) {
    return 'データ・統計重視';
  } else if (instruction.includes('事例') || instruction.includes('ケース')) {
    return '実例・ケーススタディ重視';
  } else if (instruction.includes('美容')) {
    return '美容業界特化';
  } else if (instruction.includes('初心者')) {
    return '初心者向け基本重視';
  } else if (instruction.includes('実践') || instruction.includes('手順')) {
    return '実践的手順重視';
  } else if (instruction.includes('技術') || instruction.includes('専門')) {
    return '技術・専門性重視';
  }
  
  return 'カスタマイズ対応';
}

// ===== 🔄 フォールバックコンテンツ生成 =====
function generateFallbackContent(dailyProposal, customInstruction) {
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0];
  const category = mapToCategory(dailyProposal.topic);
  const tags = generateTags(dailyProposal.topic, dailyProposal.weeklyTheme);
  
  return `---
layout: blog-post
title: "${dailyProposal.topic}"
date: ${dateStr}
categories: [${category}]
tags: [${tags.join(', ')}]
author: "LeadFive AI"
description: "${dailyProposal.topic.substring(0, 100)}についてLeadFive独自の8つの本能マーケティング手法で解説します。"
image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&h=630&fit=crop"
---

# ${dailyProposal.topic}

## 🎯 この記事で得られること

${dailyProposal.topic}について、LeadFive独自の心理学アプローチを用いた実践的な手法を学べます。読了後には具体的なアクションプランを持って実践を開始できるようになります。

## 📊 なぜ今、この取り組みが重要なのか

現在の市場環境では、${category.replace('業界', '')}分野における競争が激化しています。しかし、多くの企業が表面的な対応に留まり、顧客の深層心理を理解した戦略的アプローチを実践できていないのが現状です。

${customInstruction ? `**カスタマイズポイント**: ${customInstruction}を重視した内容で構成します。` : ''}

## 💡 LeadFive独自の8つの本能アプローチ

### 1. 生存本能 - リスク回避の心理
顧客が最も恐れるリスクを特定し、それを解決する提案をすることで深い信頼関係を築きます。

### 2. 競争本能 - 他社との差別化
競合他社がまだ気づいていない優位性を発見し、圧倒的なポジションを確立します。

### 3. 好奇心 - 新しい可能性への興味  
革新的なアプローチを示すことで、顧客の知的好奇心を刺激し、関心を引きつけます。

## 🚀 実践的な実装ステップ

### ステップ1: 現状分析
まず、あなたの現在のポジションと課題を明確にします。

### ステップ2: 戦略立案
8つの本能アプローチを活用した戦略を立案します。

### ステップ3: 実装開始
小さく始めて、効果を確認しながらスケールアップしていきます。

## 📈 期待できる効果

この手法を実践することで以下のような効果が期待できます：

- **売上向上**: 平均20-50%の改善
- **効率化**: 作業時間30-40%短縮  
- **顧客満足度**: リピート率15-25%向上

## ⚠️ よくある失敗パターンと対策

### 失敗パターン1: 表面的な導入
多くの企業が犯す最大の間違いは、手法を表面的にしか理解せずに導入することです。

**対策**: 根本的な仕組みを理解してから段階的に導入する

### 失敗パターン2: 短期的な視点
すぐに結果を求めすぎて、継続性を軽視してしまうケースです。

**対策**: 中長期的な視点で取り組み、小さな改善を積み重ねる

## 🎯 今すぐ実践できるアクションプラン

1. **正しい理解**: 表面的でなく、本質を理解する
2. **段階的実装**: 小さく始めて着実に拡大
3. **継続的改善**: データを基に常に最適化

## まとめ：${dailyProposal.topic.replace(/：.*/, '')}で成功する秘訣

${dailyProposal.topic}を成功させるためには、顧客の深層心理を理解したアプローチが不可欠です。LeadFiveの8つの本能マーケティング手法を活用することで、競合他社との明確な差別化を実現できます。

### 🚀 LeadFiveでさらに効果を最大化

LeadFiveでは、あなたのビジネスに特化したAI×心理学マーケティングサポートを提供しています。今回ご紹介した手法の実装から最適化まで、カスタマイズされたソリューションで確実な成果を実現します。

**無料相談で、あなたのビジネスに最適な戦略をご提案いたします。**

---

**この記事はAI×心理学マーケティングの専門企業LeadFiveが、最新のトレンド分析と豊富な実例を基に作成しました。**`;
}

// ===== 📁 ファイル保存 =====
async function saveBlogPost(content, topic) {
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0];
  const slug = slugify(topic, {
    lower: true,
    remove: /[*+~.()'"!:@]/g,
    replacement: '-'
  }).substring(0, 50);
  
  const filename = `${dateStr}-${slug}.md`;
  const filepath = path.join(CONFIG.blogDir, filename);
  
  // _postsディレクトリが存在しない場合は作成
  if (!fs.existsSync(CONFIG.blogDir)) {
    fs.mkdirSync(CONFIG.blogDir, { recursive: true });
  }
  
  fs.writeFileSync(filepath, content, 'utf8');
  console.log(`✅ ブログ記事保存完了: ${filename}`);
  
  return filename;
}

// ===== 🚀 メイン実行関数 =====
async function main() {
  try {
    const topic = process.env.TOPIC || 'ChatGPT-4でマーケティング戦略を革新する5つの方法';
    const customInstruction = process.env.CUSTOM_INSTRUCTION || '';
    const weeklyTheme = process.env.WEEKLY_THEME || 'ChatGPT活用週間';
    
    const dailyProposal = {
      topic,
      weeklyTheme,
      focus: process.env.CATEGORY || 'AIマーケティング'
    };
    
    console.log('🚀 プレミアムブログ記事生成開始...');
    console.log(`📝 タイトル: ${topic}`);
    console.log(`🎯 カスタマイズ: ${customInstruction}`);
    
    // Claude AIでユニークコンテンツ生成
    const content = await generateUniqueContentWithClaude(dailyProposal, customInstruction);
    
    // ファイル保存
    const filename = await saveBlogPost(content, topic);
    
    console.log('✅ プレミアムブログ記事生成完了');
    console.log(`📄 ファイル: ${filename}`);
    
  } catch (error) {
    console.error('❌ メイン実行エラー:', error);
    process.exit(1);
  }
}

// 直接実行の場合
if (require.main === module) {
  main();
}

module.exports = {
  generateUniqueContentWithClaude,
  saveBlogPost
};