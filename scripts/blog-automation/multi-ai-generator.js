#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');

/**
 * 複数のAIを組み合わせて最適なブログを生成するハイブリッドジェネレーター
 */
class MultiAIBlogGenerator {
  constructor(config = {}) {
    this.keyword = config.keyword;
    this.primaryAI = config.primaryAI || 'claude';
    this.apis = {
      claude: {
        key: process.env.ANTHROPIC_API_KEY,
        model: 'claude-3-sonnet-20240229',
        endpoint: 'https://api.anthropic.com/v1/messages'
      },
      openai: {
        key: process.env.OPENAI_API_KEY,
        model: 'gpt-4-turbo-preview',
        endpoint: 'https://api.openai.com/v1/chat/completions'
      },
      gemini: {
        key: process.env.GEMINI_API_KEY,
        model: 'gemini-1.5-pro',
        endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent'
      }
    };
    this.postsDir = path.join(__dirname, '../../_posts');
  }

  async generateBlogPost() {
    console.log(`🤖 マルチAIブログ生成開始: ${this.keyword}`);
    console.log(`📌 プライマリAI: ${this.primaryAI}`);
    
    try {
      // 1. 利用可能なAIを確認
      const availableAIs = this.checkAvailableAIs();
      if (availableAIs.length === 0) {
        throw new Error('利用可能なAI APIキーがありません');
      }
      
      console.log(`✅ 利用可能なAI: ${availableAIs.join(', ')}`);
      
      // 2. 最適なAI組み合わせを決定
      const aiStrategy = this.determineStrategy(availableAIs);
      console.log(`🎯 戦略: ${JSON.stringify(aiStrategy)}`);
      
      // 3. コンテンツ生成
      let content;
      if (aiStrategy.hybrid) {
        content = await this.generateHybridContent(aiStrategy);
      } else {
        content = await this.generateSingleAIContent(aiStrategy.primary);
      }
      
      // 4. ファイル保存
      const filename = await this.savePost(content);
      
      console.log(`✅ ブログ生成完了: ${filename}`);
      return { success: true, filename, title: content.title, ai: aiStrategy };
      
    } catch (error) {
      console.error('❌ エラー:', error.message);
      return { success: false, error: error.message };
    }
  }

  checkAvailableAIs() {
    const available = [];
    for (const [name, config] of Object.entries(this.apis)) {
      if (config.key) {
        available.push(name);
      }
    }
    return available;
  }

  determineStrategy(availableAIs) {
    // 優先順位: Claude > OpenAI > Gemini
    const priority = ['claude', 'openai', 'gemini'];
    
    // ハイブリッド戦略の判定
    if (availableAIs.length >= 2) {
      // 複数AI利用可能な場合
      if (availableAIs.includes('openai') && availableAIs.includes('claude')) {
        return {
          hybrid: true,
          research: 'openai',  // GPTでリサーチ（Web検索可能）
          writing: 'claude',   // Claudeで執筆（日本語品質）
          optimization: availableAIs.includes('gemini') ? 'gemini' : null
        };
      }
    }
    
    // 単一AI戦略
    for (const ai of priority) {
      if (availableAIs.includes(ai)) {
        return {
          hybrid: false,
          primary: ai
        };
      }
    }
    
    return { hybrid: false, primary: availableAIs[0] };
  }

  async generateHybridContent(strategy) {
    console.log('🔄 ハイブリッド生成モード');
    
    // 1. リサーチフェーズ（GPT）
    let structure = null;
    if (strategy.research) {
      console.log(`🔍 ${strategy.research}でリサーチ中...`);
      structure = await this.researchTopic(strategy.research);
    }
    
    // 2. 執筆フェーズ（Claude）
    console.log(`✍️ ${strategy.writing}で執筆中...`);
    const content = await this.writeBlogPost(strategy.writing, structure);
    
    // 3. 最適化フェーズ（Gemini）
    if (strategy.optimization) {
      console.log(`🎯 ${strategy.optimization}で最適化中...`);
      return await this.optimizeContent(strategy.optimization, content);
    }
    
    return content;
  }

  async generateSingleAIContent(ai) {
    console.log(`📝 ${ai}で生成中...`);
    
    const prompt = this.createComprehensivePrompt();
    
    switch (ai) {
      case 'claude':
        return await this.generateWithClaude(prompt);
      case 'openai':
        return await this.generateWithOpenAI(prompt);
      case 'gemini':
        return await this.generateWithGemini(prompt);
      default:
        throw new Error(`未対応のAI: ${ai}`);
    }
  }

  async researchTopic(ai) {
    const researchPrompt = `
「${this.keyword}」について、ブログ記事の構成案を作成してください。
以下の形式で出力してください：

1. ターゲット読者
2. 記事の目的
3. キーフレーズ（5個）
4. 記事構成（見出しと概要）
5. 関連トピック（内部リンク用）
`;
    
    const response = await this.callAI(ai, researchPrompt);
    return response;
  }

  async writeBlogPost(ai, structure) {
    const writingPrompt = `
「${this.keyword}」について、以下の条件で高品質な日本語ブログ記事を作成してください：

${structure ? `構成案：\n${structure}\n` : ''}

条件：
- 文字数：2500-3000文字
- トーン：プロフェッショナルかつ親しみやすい
- 読者：企業の意思決定者
- 必須要素：具体的な数値、事例、実践的なアドバイス

タイトル、メタディスクリプション、本文を含めて出力してください。
`;
    
    const response = await this.callAI(ai, writingPrompt);
    return this.parseAIResponse(response);
  }

  async optimizeContent(ai, content) {
    const optimizationPrompt = `
以下のブログ記事をSEO最適化してください：

${content.content}

最適化ポイント：
1. キーワード密度の調整
2. 見出しタグの最適化
3. メタディスクリプションの改善
4. 内部リンクの提案（{{INTERNAL_LINK:トピック}}形式で）
`;
    
    const response = await this.callAI(ai, optimizationPrompt);
    // 元のコンテンツと最適化を統合
    return {
      ...content,
      content: response,
      optimized: true
    };
  }

  async callAI(aiName, prompt) {
    const api = this.apis[aiName];
    
    switch (aiName) {
      case 'claude':
        return await this.callClaude(api, prompt);
      case 'openai':
        return await this.callOpenAI(api, prompt);
      case 'gemini':
        return await this.callGemini(api, prompt);
    }
  }

  async callClaude(api, prompt) {
    const response = await axios.post(
      api.endpoint,
      {
        model: api.model,
        max_tokens: 4000,
        messages: [{ role: 'user', content: prompt }]
      },
      {
        headers: {
          'X-API-Key': api.key,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data.content[0].text;
  }

  async callOpenAI(api, prompt) {
    const response = await axios.post(
      api.endpoint,
      {
        model: api.model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 4000
      },
      {
        headers: {
          'Authorization': `Bearer ${api.key}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data.choices[0].message.content;
  }

  async callGemini(api, prompt) {
    const response = await axios.post(
      `${api.endpoint}?key=${api.key}`,
      {
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          maxOutputTokens: 4000,
          temperature: 0.7
        }
      }
    );
    
    return response.data.candidates[0].content.parts[0].text;
  }

  createComprehensivePrompt() {
    return `
「${this.keyword}」について、以下の条件で高品質な日本語ブログ記事を作成してください：

【必須条件】
- 文字数：2500-3000文字（厳守）
- 対象読者：企業の意思決定者、マーケティング担当者
- トーン：プロフェッショナルかつ親しみやすい
- 文体：です・ます調

【構成要素】
1. タイトル（SEO最適化、数字を含む）
2. メタディスクリプション（150文字）
3. 導入部（読者の課題に共感）
4. 本文（5-7つのセクション、各h2見出し付き）
5. 結論（行動を促すCTA）

【必須要素】
- 具体的な数値データ（3つ以上）
- 実例または事例（2つ以上）
- 実践的なステップ（箇条書き）
- 内部リンクポイント（{{INTERNAL_LINK:関連トピック}}形式で3-5箇所）

【SEO要件】
- キーワードを自然に配置
- 読みやすい段落（3-5文）
- 専門用語には説明を追加

出力形式：
# [タイトル]

メタディスクリプション: [150文字の説明]

## [本文...]
`;
  }

  parseAIResponse(response) {
    // AIレスポンスからタイトル、説明、本文を抽出
    const titleMatch = response.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1] : `${this.keyword}完全ガイド`;
    
    const metaMatch = response.match(/メタディスクリプション[:：]\s*(.+)$/m);
    const description = metaMatch ? metaMatch[1] : title.substring(0, 150);
    
    const contentStart = response.indexOf('##');
    const content = contentStart > -1 ? response.substring(contentStart) : response;
    
    return { title, description, content };
  }

  async savePost(content) {
    const date = new Date();
    const dateStr = date.toISOString().split('T')[0];
    const slug = this.keyword
      .replace(/[【】「」『』（）]/g, '')
      .replace(/\s+/g, '-')
      .toLowerCase()
      .substring(0, 50);
    
    const filename = `${dateStr}-${slug}.md`;
    const filepath = path.join(this.postsDir, filename);
    
    const frontMatter = `---
layout: blog-post
title: "${content.title}"
date: ${date.toISOString()}
categories: [AIマーケティング]
tags: [${this.keyword}, AI活用, マルチAI生成]
description: "${content.description}"
author: "Multi-AI System"
ai_generated: true
ai_models: ${JSON.stringify(content.ai || { primary: this.primaryAI })}
---

`;
    
    const fullContent = frontMatter + content.content;
    
    await fs.mkdir(this.postsDir, { recursive: true });
    await fs.writeFile(filepath, fullContent, 'utf-8');
    
    return filename;
  }
}

// CLI実行
if (require.main === module) {
  const keyword = process.argv[2];
  const primaryAI = process.argv[3] || 'claude';
  
  if (!keyword) {
    console.log('使用方法: node multi-ai-generator.js "キーワード" [AI名]');
    console.log('AI名: claude, openai, gemini (デフォルト: claude)');
    process.exit(1);
  }
  
  const generator = new MultiAIBlogGenerator({ keyword, primaryAI });
  
  generator.generateBlogPost()
    .then(result => {
      if (result.success) {
        console.log(`\n✅ 成功: ${result.title}`);
        console.log(`📄 ファイル: ${result.filename}`);
        console.log(`🤖 使用AI: ${JSON.stringify(result.ai)}`);
      } else {
        console.error(`\n❌ 失敗: ${result.error}`);
      }
    })
    .catch(error => {
      console.error('\n❌ エラー:', error);
      process.exit(1);
    });
}

module.exports = MultiAIBlogGenerator;