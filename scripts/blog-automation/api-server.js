#!/usr/bin/env node

const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const matter = require('gray-matter');
const ClaudeBlogGenerator = require('./claude-blog-generator');

const app = express();
const PORT = process.env.PORT || 3333;

// ミドルウェア
app.use(express.json());
app.use(express.static(__dirname));

// CORS設定（開発用）
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

const postsDir = path.join(__dirname, '../../_posts');

// 記事一覧を取得
app.get('/api/posts', async (req, res) => {
  try {
    const files = await fs.readdir(postsDir);
    const posts = [];
    
    for (const file of files) {
      if (!file.endsWith('.md')) continue;
      
      const content = await fs.readFile(path.join(postsDir, file), 'utf-8');
      const { data, content: body } = matter(content);
      
      posts.push({
        id: file.replace('.md', ''),
        filename: file,
        title: data.title || 'Untitled',
        date: data.date,
        description: data.description || '',
        tags: data.tags || [],
        categories: data.categories || [],
        author: data.author || 'LeadFive AI',
        content: body
      });
    }
    
    // 日付で降順ソート
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    res.json(posts);
  } catch (error) {
    console.error('Error reading posts:', error);
    res.status(500).json({ error: 'Failed to read posts' });
  }
});

// 特定の記事を取得
app.get('/api/posts/:id', async (req, res) => {
  try {
    const filename = req.params.id + '.md';
    const filepath = path.join(postsDir, filename);
    
    const content = await fs.readFile(filepath, 'utf-8');
    const { data, content: body } = matter(content);
    
    res.json({
      id: req.params.id,
      filename: filename,
      title: data.title || 'Untitled',
      date: data.date,
      description: data.description || '',
      tags: data.tags || [],
      categories: data.categories || [],
      author: data.author || 'LeadFive AI',
      image: data.image || '',
      content: body
    });
  } catch (error) {
    res.status(404).json({ error: 'Post not found' });
  }
});

// 記事を更新
app.put('/api/posts/:id', async (req, res) => {
  try {
    const filename = req.params.id + '.md';
    const filepath = path.join(postsDir, filename);
    
    // 既存のファイルを読み込み
    const existingContent = await fs.readFile(filepath, 'utf-8');
    const { data: existingData } = matter(existingContent);
    
    // 更新データをマージ
    const updatedData = {
      ...existingData,
      title: req.body.title || existingData.title,
      description: req.body.description || existingData.description,
      tags: req.body.tags || existingData.tags,
      updated_at: new Date().toISOString()
    };
    
    // フロントマターを再構成
    const frontMatter = Object.entries(updatedData)
      .map(([key, value]) => {
        if (typeof value === 'string') {
          return `${key}: "${value}"`;
        } else if (Array.isArray(value)) {
          return `${key}: [${value.join(', ')}]`;
        } else {
          return `${key}: ${value}`;
        }
      })
      .join('\n');
    
    // 新しいコンテンツを作成
    const newContent = `---\n${frontMatter}\n---\n\n${req.body.content || ''}`;
    
    // ファイルを保存
    await fs.writeFile(filepath, newContent, 'utf-8');
    
    res.json({ 
      success: true, 
      message: 'Post updated successfully',
      id: req.params.id 
    });
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ error: 'Failed to update post' });
  }
});

// 記事を再生成
app.post('/api/posts/:id/regenerate', async (req, res) => {
  try {
    const filename = req.params.id + '.md';
    const filepath = path.join(postsDir, filename);
    
    // 環境変数を確認
    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(400).json({ error: 'API key not configured' });
    }
    
    // ブログジェネレーターを初期化
    const generator = new ClaudeBlogGenerator({
      anthropicApiKey: process.env.ANTHROPIC_API_KEY,
      keyword: req.body.keyword || 'AIマーケティング',
      customTitle: req.body.title,
      unsplashApiKey: process.env.UNSPLASH_API_KEY
    });
    
    // 記事を生成
    const result = await generator.generateBlogPost();
    
    if (result.success) {
      // 古いファイルを削除
      await fs.unlink(filepath);
      
      // 新しい記事の情報を取得
      const newFilepath = path.join(postsDir, result.filename);
      const content = await fs.readFile(newFilepath, 'utf-8');
      const { data, content: body } = matter(content);
      
      res.json({
        id: result.filename.replace('.md', ''),
        filename: result.filename,
        title: data.title,
        date: data.date,
        description: data.description,
        tags: data.tags,
        content: body
      });
    } else {
      res.status(500).json({ error: result.error });
    }
  } catch (error) {
    console.error('Error regenerating post:', error);
    res.status(500).json({ error: 'Failed to regenerate post' });
  }
});

// 記事を削除
app.delete('/api/posts/:id', async (req, res) => {
  try {
    const filename = req.params.id + '.md';
    const filepath = path.join(postsDir, filename);
    
    await fs.unlink(filepath);
    
    res.json({ 
      success: true, 
      message: 'Post deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`\n🚀 ブログエディタAPIサーバーが起動しました`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`📝 エディタ: http://localhost:${PORT}/blog-web-editor.html`);
  console.log('\nCtrl+C で終了します。\n');
});

// 環境変数を読み込み
if (require.main === module) {
  try {
    require('dotenv').config({ path: path.join(__dirname, '../../.env') });
  } catch (e) {
    console.warn('⚠️  .envファイルが見つかりません。');
  }
}