#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const readline = require('readline');

class BlogEditor {
  constructor() {
    this.postsDir = path.join(__dirname, '../../_posts');
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  async listPosts() {
    const files = await fs.readdir(this.postsDir);
    const posts = files
      .filter(f => f.endsWith('.md'))
      .sort((a, b) => b.localeCompare(a));
    
    console.log('\n📝 投稿済みのブログ記事:');
    console.log('='.repeat(60));
    
    for (let i = 0; i < posts.length; i++) {
      const content = await fs.readFile(path.join(this.postsDir, posts[i]), 'utf-8');
      const titleMatch = content.match(/^title:\s*"([^"]+)"/m);
      const dateMatch = content.match(/^date:\s*(.+)$/m);
      
      console.log(`${i + 1}. ${posts[i]}`);
      if (titleMatch) {
        console.log(`   タイトル: ${titleMatch[1]}`);
      }
      if (dateMatch) {
        console.log(`   投稿日: ${new Date(dateMatch[1]).toLocaleDateString('ja-JP')}`);
      }
      console.log('');
    }
    
    return posts;
  }

  async selectPost(posts) {
    return new Promise((resolve) => {
      this.rl.question('\n編集する記事の番号を入力してください (0でキャンセル): ', (answer) => {
        const num = parseInt(answer);
        if (num === 0 || isNaN(num) || num < 1 || num > posts.length) {
          resolve(null);
        } else {
          resolve(posts[num - 1]);
        }
      });
    });
  }

  async editPost(filename) {
    const filepath = path.join(this.postsDir, filename);
    const content = await fs.readFile(filepath, 'utf-8');
    
    // フロントマターと本文を分離
    const frontMatterEnd = content.indexOf('---', 4);
    const frontMatter = content.substring(0, frontMatterEnd + 3);
    const body = content.substring(frontMatterEnd + 3);
    
    console.log('\n現在の記事情報:');
    console.log('='.repeat(60));
    
    const titleMatch = frontMatter.match(/^title:\s*"([^"]+)"/m);
    const descMatch = frontMatter.match(/^description:\s*"([^"]+)"/m);
    const tagsMatch = frontMatter.match(/^tags:\s*\[([^\]]+)\]/m);
    
    if (titleMatch) console.log(`タイトル: ${titleMatch[1]}`);
    if (descMatch) console.log(`説明: ${descMatch[1]}`);
    if (tagsMatch) console.log(`タグ: ${tagsMatch[1]}`);
    
    console.log('\n編集オプション:');
    console.log('1. タイトルを編集');
    console.log('2. 説明文を編集');
    console.log('3. タグを編集');
    console.log('4. 本文を編集（エディタで開く）');
    console.log('5. 記事全体を再生成');
    console.log('0. キャンセル');
    
    return new Promise((resolve) => {
      this.rl.question('\n選択してください: ', async (choice) => {
        switch (choice) {
          case '1':
            await this.editTitle(filepath, frontMatter, body);
            break;
          case '2':
            await this.editDescription(filepath, frontMatter, body);
            break;
          case '3':
            await this.editTags(filepath, frontMatter, body);
            break;
          case '4':
            await this.openInEditor(filepath);
            break;
          case '5':
            await this.regeneratePost(filename);
            break;
          default:
            console.log('キャンセルしました。');
        }
        resolve();
      });
    });
  }

  async editTitle(filepath, frontMatter, body) {
    return new Promise((resolve) => {
      this.rl.question('新しいタイトルを入力してください: ', async (newTitle) => {
        const updatedFrontMatter = frontMatter.replace(
          /^title:\s*"[^"]+"/m,
          `title: "${newTitle}"`
        );
        await fs.writeFile(filepath, updatedFrontMatter + body, 'utf-8');
        console.log('✅ タイトルを更新しました。');
        resolve();
      });
    });
  }

  async editDescription(filepath, frontMatter, body) {
    return new Promise((resolve) => {
      this.rl.question('新しい説明文を入力してください: ', async (newDesc) => {
        const updatedFrontMatter = frontMatter.replace(
          /^description:\s*"[^"]+"/m,
          `description: "${newDesc}"`
        );
        await fs.writeFile(filepath, updatedFrontMatter + body, 'utf-8');
        console.log('✅ 説明文を更新しました。');
        resolve();
      });
    });
  }

  async editTags(filepath, frontMatter, body) {
    return new Promise((resolve) => {
      this.rl.question('新しいタグを入力してください (カンマ区切り): ', async (newTags) => {
        const tagsArray = newTags.split(',').map(t => t.trim());
        const updatedFrontMatter = frontMatter.replace(
          /^tags:\s*\[[^\]]+\]/m,
          `tags: [${tagsArray.join(', ')}]`
        );
        await fs.writeFile(filepath, updatedFrontMatter + body, 'utf-8');
        console.log('✅ タグを更新しました。');
        resolve();
      });
    });
  }

  async openInEditor(filepath) {
    const { spawn } = require('child_process');
    
    // 環境変数EDITORを確認、なければnanoを使用
    const editor = process.env.EDITOR || 'nano';
    
    console.log(`\n${editor}でファイルを開いています...`);
    const editorProcess = spawn(editor, [filepath], { stdio: 'inherit' });
    
    return new Promise((resolve) => {
      editorProcess.on('close', () => {
        console.log('✅ 編集を完了しました。');
        resolve();
      });
    });
  }

  async regeneratePost(filename) {
    console.log('\n⚠️  この操作は現在の記事を完全に置き換えます。');
    
    return new Promise((resolve) => {
      this.rl.question('続行しますか？ (y/N): ', async (answer) => {
        if (answer.toLowerCase() !== 'y') {
          console.log('キャンセルしました。');
          resolve();
          return;
        }
        
        // 既存の記事から情報を抽出
        const filepath = path.join(this.postsDir, filename);
        const content = await fs.readFile(filepath, 'utf-8');
        const titleMatch = content.match(/^title:\s*"([^"]+)"/m);
        const tagsMatch = content.match(/^tags:\s*\[([^\]]+)\]/m);
        
        if (!titleMatch) {
          console.log('❌ タイトルが見つかりません。');
          resolve();
          return;
        }
        
        const title = titleMatch[1];
        const tags = tagsMatch ? tagsMatch[1].split(',')[0].trim() : 'AIマーケティング';
        
        console.log(`\n記事を再生成します: ${title}`);
        console.log(`キーワード: ${tags}`);
        
        // ブログジェネレーターを使用して再生成
        const ClaudeBlogGenerator = require('./claude-blog-generator');
        const generator = new ClaudeBlogGenerator({
          anthropicApiKey: process.env.ANTHROPIC_API_KEY,
          keyword: tags,
          customTitle: title,
          unsplashApiKey: process.env.UNSPLASH_API_KEY
        });
        
        try {
          const result = await generator.generateBlogPost();
          if (result.success) {
            console.log('✅ 記事を再生成しました。');
            
            // 古いファイルを削除
            await fs.unlink(filepath);
            console.log('古い記事を削除しました。');
          } else {
            console.log('❌ 再生成に失敗しました:', result.error);
          }
        } catch (error) {
          console.log('❌ エラーが発生しました:', error.message);
        }
        
        resolve();
      });
    });
  }

  async run() {
    console.log('🖊️  ブログ記事エディタ');
    console.log('='.repeat(60));
    
    try {
      const posts = await this.listPosts();
      
      if (posts.length === 0) {
        console.log('投稿済みの記事がありません。');
        this.rl.close();
        return;
      }
      
      const selectedPost = await this.selectPost(posts);
      
      if (selectedPost) {
        await this.editPost(selectedPost);
      }
      
    } catch (error) {
      console.error('エラーが発生しました:', error.message);
    }
    
    this.rl.close();
  }
}

// メイン実行
if (require.main === module) {
  // 環境変数を読み込み
  try {
    require('dotenv').config({ path: path.join(__dirname, '../../.env') });
  } catch (e) {
    // .envがない場合は続行
  }
  
  const editor = new BlogEditor();
  editor.run();
}

module.exports = BlogEditor;