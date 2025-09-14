const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const BlogAIAssistant = require('./blog-ai-assistant');

const app = express();
const PORT = process.env.PORT || 3000;
const aiAssistant = new BlogAIAssistant();

// Middleware
app.use(express.json());
app.use(express.static('.'));

// CORS設定（開発用）
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next();
});

// API: タイトル候補生成
app.post('/api/generate-titles', (req, res) => {
    const { instinct, category, keywords } = req.body;
    
    try {
        const titles = aiAssistant.generateTitleSuggestions(instinct, category, keywords);
        res.json({ success: true, titles });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// API: アウトライン生成
app.post('/api/generate-outline', (req, res) => {
    const { instinct, template, title } = req.body;
    
    try {
        const outline = aiAssistant.generateOutline(instinct, template, title);
        res.json({ success: true, outline });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// API: コンテンツ最適化
app.post('/api/enhance-content', (req, res) => {
    const { content, instinct, keywords } = req.body;
    
    try {
        const enhanced = aiAssistant.enhanceContent(content, instinct, keywords);
        res.json({ success: true, enhanced });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// API: SEO最適化
app.post('/api/optimize-seo', (req, res) => {
    const { title, description, keywords, instinct } = req.body;
    
    try {
        const optimization = aiAssistant.optimizeForSEO(title, description, keywords, instinct);
        res.json({ success: true, optimization });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// API: 品質スコア計算
app.post('/api/quality-score', (req, res) => {
    const { postData } = req.body;
    
    try {
        const result = aiAssistant.calculateQualityScore(postData);
        res.json({ success: true, ...result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// API: ブログ記事保存
app.post('/api/save-post', async (req, res) => {
    const { title, content, category, keywords, instinct, isDraft = false } = req.body;
    
    try {
        // 日付とスラッグ生成
        const date = new Date();
        const dateStr = date.toISOString().split('T')[0];
        const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '')
            .substring(0, 50);
        
        // ファイル名
        const filename = `${dateStr}-${slug}.md`;
        const filepath = path.join('_posts', filename);
        
        // Jekyllフロントマター付きコンテンツ
        const jekyllContent = `---
layout: post
title: "${title}"
date: ${date.toISOString()}
categories: [${category}]
tags: [${keywords.join(', ')}]
author: LeadFive編集部
description: "${title} - AI×心理学マーケティングの最新手法を解説"
image: /assets/images/blog/${dateStr}-thumbnail.jpg
instinct: ${instinct}
published: ${!isDraft}
---

${content}

## まとめ

本記事では、${title}について解説しました。${instinct}に訴求するアプローチは、現代のマーケティングにおいて非常に効果的です。

LeadFiveでは、AI×心理学を活用したマーケティング戦略の立案から実行まで、包括的にサポートしています。

<div class="cta-box">
  <h3>無料相談実施中</h3>
  <p>あなたのビジネスに最適なAI×心理学マーケティング戦略をご提案します。</p>
  <a href="/contact" class="btn btn-primary">お問い合わせはこちら</a>
</div>
`;

        // ファイル保存
        await fs.writeFile(filepath, jekyllContent, 'utf8');
        
        // 履歴保存
        const historyDir = path.join('.blog-wizard', 'history');
        await fs.mkdir(historyDir, { recursive: true });
        const historyFile = path.join(historyDir, `${uuidv4()}.json`);
        await fs.writeFile(historyFile, JSON.stringify({
            title,
            category,
            keywords,
            instinct,
            isDraft,
            createdAt: date.toISOString(),
            filepath
        }, null, 2), 'utf8');
        
        res.json({ 
            success: true, 
            message: isDraft ? '下書きとして保存しました' : '記事を公開しました',
            filepath 
        });
        
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// API: 記事一覧取得
app.get('/api/posts', async (req, res) => {
    try {
        const postsDir = '_posts';
        const files = await fs.readdir(postsDir);
        const posts = [];
        
        for (const file of files) {
            if (file.endsWith('.md')) {
                const content = await fs.readFile(path.join(postsDir, file), 'utf8');
                const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
                
                if (frontMatterMatch) {
                    const frontMatter = frontMatterMatch[1];
                    const titleMatch = frontMatter.match(/title:\s*"([^"]+)"/);
                    const dateMatch = frontMatter.match(/date:\s*(\S+)/);
                    const publishedMatch = frontMatter.match(/published:\s*(\S+)/);
                    
                    posts.push({
                        filename: file,
                        title: titleMatch ? titleMatch[1] : 'Untitled',
                        date: dateMatch ? dateMatch[1] : '',
                        isDraft: publishedMatch ? publishedMatch[1] === 'false' : false
                    });
                }
            }
        }
        
        // 日付でソート（新しい順）
        posts.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        res.json({ success: true, posts });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// API: AIコンテンツ生成（プレースホルダー）
app.post('/api/generate-content', async (req, res) => {
    const { outline, instinct, keywords } = req.body;
    
    try {
        // 実際のAI生成はここで行う（OpenAI API等を使用）
        // 現在はサンプルコンテンツを返す
        const content = outline.map(section => {
            return `## ${section.section}\n\n${section.content}\n\n[ここに詳細な内容を記述します。${instinct}の観点から、${keywords.join('、')}などのキーワードを自然に組み込みながら、読者に価値を提供する内容を展開してください。]\n`;
        }).join('\n');
        
        res.json({ success: true, content });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// サーバー起動
app.listen(PORT, () => {
    console.log(`ブログウィザードサーバーが起動しました: http://localhost:${PORT}`);
    console.log(`Webインターフェース: http://localhost:${PORT}/blog-wizard-web.html`);
});

// エラーハンドリング
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (error) => {
    console.error('Unhandled Rejection:', error);
});