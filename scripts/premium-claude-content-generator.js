// ===== 🤖 Claude AI コンテンツ生成システム =====

const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');
const path = require('path');
const slugify = require('slugify');

// 設定
const CONFIG = {
  anthropicApiKey: process.env.ANTHROPIC_API_KEY,
  blogDir: path.join(__dirname, '..', '_posts'),
  maxTokens: 8000, // 文字数確保のため増加
  model: 'claude-3-sonnet-20240229' // より強力なモデルに変更
};

// ===== 🧠 Claude AI でユニークコンテンツ生成 =====
async function generateUniqueContentWithClaude(dailyProposal, customInstruction = '') {
  const anthropic = new Anthropic({
    apiKey: CONFIG.anthropicApiKey
  });

  // カスタマイズ指示を解析
  const focusArea = analyzeFocusArea(customInstruction);
  
  const prompt = `あなたはLeadFive（AI×心理学マーケティング専門企業）の優秀なコンテンツライターです。

【🚨 最重要要件 - 絶対に厳守】
📝 **文字数**: 必ず2500文字以上3500文字未満で作成してください。これより短い記事は絶対に作成しないでください。
📊 **品質基準**: 各見出しごとに十分なボリュームのある詳細な内容を記述してください。

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

【必須構成要素 - 各セクション最低300-500文字】
1. 問題提起（読み手の関心を即座に引きつける）- 400文字以上
2. 解決策の段階的提示（実践しやすい形で）- 600文字以上
3. 具体的事例とデータ（LeadFiveの実績を活用）- 500文字以上
4. 失敗パターンと回避法 - 400文字以上
5. 今すぐできるアクションプラン - 400文字以上

【記事品質要件】
- 🎯 **文字数**: 2500-3500文字（厳守）
- ⏰ 読了時間: 8-12分
- 📋 見出し構造: h2-h6の階層的構成
- 💡 引き込み要素: データ、事例、具体的数値を多用
- 🚀 CTA: LeadFiveサービスへの自然な誘導

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

🚨 **重要**: 必ず2500文字以上3500文字未満の記事を生成してください。各見出しごとに十分な詳細と具体例を含めてください。短すぎる記事は品質基準を満たしません。`;

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
    
    // 文字数チェック
    const wordCount = content.replace(/\s+/g, '').length;
    console.log(`📝 生成された文字数: ${wordCount}文字`);
    
    let finalContent = content;
    
    // 文字数が不足している場合は追加コンテンツを生成
    if (wordCount < 2500) {
      console.log('⚠️ 文字数不足のため追加コンテンツを生成中...');
      finalContent = await enhanceContentForWordCount(content, dailyProposal, customInstruction, 2500 - wordCount);
    }
    
    // コンテンツを後処理
    const processedContent = postProcessContent(finalContent, dailyProposal);
    
    const finalWordCount = processedContent.replace(/\s+/g, '').length;
    console.log(`✅ Claude AIによるユニークコンテンツ生成完了 (最終文字数: ${finalWordCount}文字)`);
    return processedContent;

  } catch (error) {
    console.error('❌ Claude AI生成エラー:', error);
    
    // フォールバック：テンプレートベースの生成
    return generateFallbackContent(dailyProposal, customInstruction);
  }
}

// ===== 📝 文字数不足時の追加コンテンツ生成 =====
async function enhanceContentForWordCount(originalContent, dailyProposal, customInstruction, additionalWordsNeeded) {
  const anthropic = new Anthropic({
    apiKey: CONFIG.anthropicApiKey
  });
  
  const enhancePrompt = `以下の記事に追加コンテンツを生成してください。約${additionalWordsNeeded}文字の追加が必要です。

【現在の記事】
${originalContent}

【追加要件】
- 文字数: 約${additionalWordsNeeded}文字
- テーマ: ${dailyProposal.topic}
- カスタマイズ: ${customInstruction}

【追加できるセクション例】
1. さらなる深掘り解説
2. 実際の導入事例（詳細）
3. よくある質問（FAQ）
4. 業界別の応用方法
5. 関連する最新トレンド
6. 専門家の視点

以下の形式で追加コンテンツのみを出力してください：

## [追加セクションタイトル]

[追加コンテンツ本文...]

## [必要に応じて2つ目のセクション]

[追加コンテンツ本文...]`;

  try {
    const enhanceMessage = await anthropic.messages.create({
      model: CONFIG.model,
      max_tokens: Math.min(4000, additionalWordsNeeded * 2),
      messages: [{
        role: 'user',
        content: enhancePrompt
      }]
    });
    
    const additionalContent = enhanceMessage.content[0].text;
    
    // 元の記事のまとめ部分の前に追加コンテンツを挿入
    const summaryPattern = /## まとめ：/;
    if (summaryPattern.test(originalContent)) {
      return originalContent.replace(summaryPattern, `${additionalContent}\n\n## まとめ：`);
    } else {
      // まとめ部分がない場合は末尾に追加
      return originalContent + '\n\n' + additionalContent;
    }
    
  } catch (error) {
    console.error('❌ 追加コンテンツ生成エラー:', error);
    return originalContent;
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

実際、LeadFiveが実施した業界調査（対象：中小企業500社）によると、マーケティング施策で期待する成果を得られている企業は全体のわずか23%という結果が明らかになりました。その主な原因は、顧客の感情的な動機を軽視し、論理的な説得のみに頼った施策を実行していることにあります。

${customInstruction ? `**カスタマイズポイント**: ${customInstruction}を重視した内容で構成します。` : ''}

このような状況下で、顧客の本能的な欲求に訴えかけるアプローチは、単なる差別化要因ではなく、ビジネス存続のための必須戦略となっています。従来の手法では到達できない深いレベルでの顧客理解こそが、持続的な成長を実現する鍵となるのです。

## 💡 LeadFive独自の8つの本能アプローチ

### 1. 生存本能 - リスク回避の心理
顧客が最も恐れるリスクを特定し、それを解決する提案をすることで深い信頼関係を築きます。この本能は人間の最も根深い部分に働きかけるため、一度信頼を獲得すると長期的な関係構築が可能になります。

具体的には、「失敗したらどうなるか」という不安を明確にし、その不安を解消する具体的なソリューションを提示します。例えば、導入失敗のリスクを0にする保証制度や、段階的導入による安全な移行プランなどが効果的です。

### 2. 競争本能 - 他社との差別化
競合他社がまだ気づいていない優位性を発見し、圧倒的なポジションを確立します。この本能を刺激するには、「他社が知らない秘密」や「限定的な機会」といった独占性を演出することが重要です。

市場分析により明らかになった競合の盲点を活用し、顧客にとって「今だけ」「ここだけ」の価値を提供します。これにより、価格競争に巻き込まれることなく、付加価値で勝負できるポジションを確立できます。

### 3. 好奇心 - 新しい可能性への興味  
革新的なアプローチを示すことで、顧客の知的好奇心を刺激し、関心を引きつけます。人間の好奇心は学習欲求と直結しているため、新しい知識や技術に対する興味を適切に刺激することで、自然な関心を獲得できます。

最新のトレンドや技術動向を踏まえつつ、それらがもたらす具体的なメリットを分かりやすく解説することで、顧客の「知りたい」「試してみたい」という欲求を喚起します。

### 4. 社会的承認 - 他者からの評価
他者からの評価や承認を得たいという欲求を活用し、顧客の自尊心を満たす提案を行います。成功事例の共有や業界内での地位向上につながる施策を提示することで、この本能に訴えかけます。

### 5. 快楽追求 - 満足感・達成感
目標達成による満足感や、プロセス自体の楽しさを強調することで、顧客のモチベーションを維持します。短期的な成果を実感できる仕組みづくりが重要です。

### 6. 帰属欲求 - コミュニティへの所属
同じ価値観や目標を持つグループへの所属欲求を満たすコミュニティ形成により、長期的な関係性を構築します。

### 7. 支配欲求 - コントロール感
状況をコントロールできているという感覚を提供することで、顧客の主体性を尊重し、自発的な行動を促進します。

### 8. 自己実現 - 成長・向上への欲求
個人やビジネスの成長につながる価値を提供し、顧客の自己実現を支援する姿勢を示します。

## 🚀 実践的な実装ステップ

### ステップ1: 現状分析と基盤づくり
まず、あなたの現在のポジションと課題を明確にします。既存のマーケティング施策の効果測定データを収集し、顧客の行動パターンや反応を詳細に分析します。

この段階では、以下の要素を重点的に調査します：
- 顧客の購買プロセスにおける離脱ポイント
- 競合他社との差別化要因の不足部分
- 現在のメッセージが刺激できていない本能的欲求
- 既存顧客からの定性的フィードバック

データ収集が完了したら、8つの本能アプローチの観点から現状を評価し、最も効果が期待できる改善ポイントを特定します。

### ステップ2: 戦略立案と優先順位付け
8つの本能アプローチを活用した包括的な戦略を立案します。ただし、すべてを同時に実装するのではなく、現状分析の結果に基づいて優先順位を設定します。

通常、以下の順序で実装することを推奨します：
1. 生存本能（リスク回避）- 信頼関係の基盤構築
2. 好奇心（新しい可能性）- 関心の喚起
3. 競争本能（差別化）- 独自価値の明確化
4. その他の本能的欲求 - 関係性の深化

各段階において、具体的なKPI（重要業績評価指標）を設定し、効果測定の仕組みを整備します。

### ステップ3: パイロット実装とテスト
小さく始めて、効果を確認しながらスケールアップしていきます。最初は限定的なターゲットセグメントに対してテスト実装を行い、反応や効果を詳細に測定します。

パイロット期間中は、以下の指標を重点的にモニタリングします：
- エンゲージメント率の変化
- コンバージョン率の改善度
- 顧客の感情的反応（定性的調査）
- 競合との差別化認知度

### ステップ4: 段階的スケールアップ
パイロット結果が良好であれば、対象範囲を徐々に拡大していきます。この段階では、各本能アプローチの相乗効果を最大化するための最適化を継続的に実行します。

## 📈 期待できる効果と具体的数値

この手法を実践することで以下のような効果が期待できます：

### 短期効果（1-3ヶ月）
- **エンゲージメント率**: 平均35-60%向上
- **問い合わせ数**: 平均25-45%増加
- **初回面談設定率**: 平均20-35%改善

### 中期効果（3-6ヶ月）
- **売上向上**: 平均20-50%の改善
- **効率化**: 作業時間30-40%短縮  
- **顧客満足度**: リピート率15-25%向上

### 長期効果（6-12ヶ月）
- **顧客生涯価値（LTV）**: 平均40-70%向上
- **紹介による新規獲得**: 平均30-50%増加
- **ブランド認知度**: 業界内での地位向上

これらの数値は、LeadFiveが過去2年間で支援した150社以上のクライアント実績に基づいています。

## ⚠️ よくある失敗パターンと具体的対策

### 失敗パターン1: 表面的な導入
多くの企業が犯す最大の間違いは、手法を表面的にしか理解せずに導入することです。「生存本能に訴える」という概念を単純な恐怖訴求と勘違いし、顧客を不安にさせるだけの結果に終わってしまうケースが頻発しています。

**具体的対策**: 
- 根本的な仕組みを理解するための学習期間（最低1ヶ月）を設ける
- 専門家による指導を受けながら段階的に導入する
- 顧客の反応を定期的に調査し、不適切なアプローチを早期に修正する

### 失敗パターン2: 短期的な視点での実装
すぐに結果を求めすぎて、継続性を軽視してしまうケースです。本能的欲求への訴求は信頼関係の構築が前提となるため、短期的な成果のみを追求すると逆効果になります。

**具体的対策**: 
- 中長期的な視点（最低6ヶ月）で取り組む計画を立てる
- 小さな改善を積み重ねる仕組みを構築する
- 短期指標と長期指標の両方を追跡する

### 失敗パターン3: 一律アプローチの適用
すべての顧客に同じアプローチを適用してしまい、セグメント別の最適化を怠るケースです。顧客の属性や状況によって、最も効果的な本能アプローチは異なります。

**具体的対策**: 
- 詳細な顧客セグメンテーションを実施する
- セグメント別に最適な本能アプローチの組み合わせを設計する
- A/Bテストによる継続的な最適化を実行する

## 🎯 今すぐ実践できるアクションプラン

### 明日から始められること
1. **顧客インタビューの実施**: 既存顧客5-10名に対して、購入決定要因に関するインタビューを実施
2. **競合分析の強化**: 競合他社のメッセージが刺激している本能的欲求を分析
3. **現在のコンテンツの見直し**: 既存の営業資料やWebサイトで活用されていない本能アプローチを特定

### 1週間以内に完了すべきこと
1. **現状分析レポートの作成**: 8つの本能アプローチの観点から現状を評価
2. **改善優先順位の決定**: 最も効果が期待できる本能アプローチを特定
3. **パイロット施策の企画**: 限定的なテスト実装の計画立案

### 1ヶ月以内の目標
1. **パイロット施策の実装開始**: 選定した本能アプローチによるテストマーケティングの開始
2. **効果測定システムの構築**: KPI設定と測定ツールの導入
3. **チーム内での知識共有**: 8つの本能アプローチに関する社内研修の実施

## まとめ：${dailyProposal.topic.replace(/：.*/, '')}で成功する秘訣

${dailyProposal.topic}を成功させるためには、顧客の深層心理を理解したアプローチが不可欠です。LeadFiveの8つの本能マーケティング手法を活用することで、競合他社との明確な差別化を実現できます。

重要なのは、これらの手法を単なるテクニックとして捉えるのではなく、顧客との真の信頼関係構築のためのコミュニケーション改善として理解することです。表面的な施策では一時的な成果は得られても、持続的な成長は期待できません。

今回ご紹介したアプローチを実践することで、以下の3つの核心的価値を顧客に提供できるようになります：

**1. 安心感の提供**: 生存本能に働きかけることで、顧客の不安を解消し、安心して意思決定できる環境を整備します。

**2. 成長機会の創出**: 好奇心や自己実現欲求を刺激することで、顧客自身の成長につながる価値提案を行います。

**3. 独自価値の明確化**: 競争本能や社会的承認欲求を活用し、他社では提供できない独自の価値を明確に伝えます。

これらの価値提供を通じて、単なる商品・サービスの提供者から、顧客の成功パートナーとしての地位を確立できます。その結果として、価格競争に巻き込まれることなく、適正な利益を確保しながら持続的な成長を実現できるのです。

### 🚀 LeadFiveでさらに効果を最大化

LeadFiveでは、あなたのビジネスに特化したAI×心理学マーケティングサポートを提供しています。今回ご紹介した手法の実装から最適化まで、カスタマイズされたソリューションで確実な成果を実現します。

私たちのサービスでは、以下のような包括的支援を行っています：

- **個別診断による現状分析**: あなたのビジネス特性に合わせた詳細な現状分析
- **カスタム戦略の立案**: 8つの本能アプローチを最適に組み合わせた独自戦略の設計
- **実装サポート**: 戦略の実行段階における具体的な施策支援
- **効果測定と改善**: データ分析による継続的な最適化

これまでに150社以上のクライアントが、平均して6ヶ月以内に売上20-50%向上という具体的成果を実現しています。

**まずは無料相談で、あなたのビジネスに最適な戦略をご提案いたします。**今なら、初回コンサルティング（通常5万円）を無料で提供しています。この機会をお見逃しなく、今すぐお申し込みください。

### 📞 お問い合わせ・無料相談のご予約

LeadFive公式サイトのお問い合わせフォーム、またはお電話にて、お気軽にご連絡ください。専門のコンサルタントが、あなたのビジネス課題に合わせた最適なソリューションをご提案いたします。

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