const fs = require('fs').promises;
const path = require('path');
const Anthropic = require('@anthropic-ai/sdk');
const slugify = require('slugify');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// カテゴリを自動判定
function determineCategory(topic) {
  const categories = {
    'ai-marketing': ['AI', '人工知能', '自動化', 'ChatGPT', 'Claude', 'GPT'],
    'psychology': ['心理', '本能', '行動', '感情', '欲求', '購買'],
    'case-study': ['事例', '成功', '実績', '導入', '効果', '結果'],
    'tips': ['方法', 'テクニック', 'コツ', 'ハック', '戦略', '施策'],
    'news': ['お知らせ', '新機能', 'アップデート', 'リリース', '発表']
  };
  
  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => topic.includes(keyword))) {
      return category;
    }
  }
  return 'ai-marketing'; // デフォルト
}

async function generateBlogPost() {
  const topic = process.env.TOPIC || '最新のAI×マーケティングトレンド';
  const description = process.env.DESCRIPTION || '';
  const audience = process.env.AUDIENCE || '';
  const customization = process.env.CUSTOMIZATION || '';
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0];
  const category = determineCategory(topic);
  
  console.log(`Generating blog post for topic: ${topic}`);
  console.log(`Category: ${category}`);
  
  const prompt = `
あなたはLeadFiveのAI×心理学マーケティングの専門家です。
以下のトピックについて、読者の心に響く実践的なブログ記事を作成してください。

トピック: ${topic}
${description ? `説明: ${description}` : ''}
${audience ? `想定読者: ${audience}` : ''}
${customization ? `カスタマイズ要望: ${customization}` : ''}
カテゴリ: ${category}

要件:
1. タイトル: 
   - 25-35文字
   - 数字を含める（例：3つの方法、5つのステップ）
   - 読者のメリットが明確
   
2. 構成:
   - 導入: 読者の共感を得る問題提起
   - 本文: 8つの本能理論を1-2個組み込む
   - 実践方法: 具体的なステップや事例
   - まとめ: 行動を促すCTA

3. トーン:
   - 専門的だが親しみやすい
   - 具体例を多用
   - データや数値を含める

4. SEO:
   - キーワードを自然に配置
   - 見出しは<h2><h3>を適切に使用
   - 内部リンクの提案を含める

以下のフォーマットで出力してください：

---
layout: blog-post
title: "[タイトル]"
date: ${dateStr}
author: LeadFive Marketing Team
categories: [${category}]
tags: [タグ1, タグ2, タグ3]
excerpt: "[150文字程度の要約]"
---

[本文をMarkdown形式で]
`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 4000,
      temperature: 0.7,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });
    
    const content = response.content[0].text;
    
    // ファイル名を生成
    const titleMatch = content.match(/title:\s*"([^"]+)"/);
    const title = titleMatch ? titleMatch[1] : topic;
    const slug = slugify(title, {
      lower: true,
      strict: true,
      locale: 'ja'
    }).substring(0, 50);
    
    const filename = `${dateStr}-${slug}.md`;
    const filepath = path.join('_posts', filename);
    
    // _postsディレクトリが存在しない場合は作成
    await fs.mkdir('_posts', { recursive: true });
    
    // ファイルを保存
    await fs.writeFile(filepath, content, 'utf8');
    
    console.log(`✅ Blog post created successfully: ${filepath}`);
    console.log(`Title: ${title}`);
    
    // 成功メッセージ用のサマリーを生成
    const excerptMatch = content.match(/excerpt:\s*"([^"]+)"/);
    const excerpt = excerptMatch ? excerptMatch[1] : '';
    console.log(`Summary: ${excerpt}`);
    
  } catch (error) {
    console.error('Error generating blog post:', error);
    process.exit(1);
  }
}

// メイン実行
generateBlogPost().catch(console.error);