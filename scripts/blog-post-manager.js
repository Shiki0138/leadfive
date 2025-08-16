#!/usr/bin/env node

/**
 * ブログ記事管理ツール
 * - 記事の一覧表示
 * - 記事の編集
 * - 記事の削除
 * - 内部リンク管理
 */

const fs = require('fs').promises;
const path = require('path');
const readline = require('readline');

class BlogPostManager {
  constructor() {
    this.postsDir = path.join(__dirname, '../_posts');
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  // 記事一覧を取得
  async listPosts() {
    const files = await fs.readdir(this.postsDir);
    const posts = files
      .filter(f => f.endsWith('.md'))
      .sort()
      .reverse();
    
    console.log('\n📝 ブログ記事一覧:\n');
    posts.forEach((post, index) => {
      console.log(`${index + 1}. ${post}`);
    });
    
    return posts;
  }

  // 記事を編集
  async editPost(filename) {
    const filepath = path.join(this.postsDir, filename);
    
    try {
      const content = await fs.readFile(filepath, 'utf-8');
      console.log('\n現在の内容:');
      console.log('---');
      console.log(content.substring(0, 500) + '...');
      console.log('---\n');
      
      const action = await this.prompt('編集内容を選択 (1:タイトル, 2:タグ, 3:本文, 4:キャンセル): ');
      
      let updatedContent = content;
      
      switch (action) {
        case '1':
          const newTitle = await this.prompt('新しいタイトル: ');
          updatedContent = content.replace(/^title:.*$/m, `title: "${newTitle}"`);
          break;
          
        case '2':
          const newTags = await this.prompt('新しいタグ (カンマ区切り): ');
          const tagArray = newTags.split(',').map(t => t.trim());
          updatedContent = content.replace(/^tags:.*$/m, `tags: [${tagArray.join(', ')}]`);
          break;
          
        case '3':
          console.log('本文の編集は別途エディタで行ってください。');
          return;
          
        default:
          console.log('キャンセルしました。');
          return;
      }
      
      await fs.writeFile(filepath, updatedContent, 'utf-8');
      console.log('✅ 記事を更新しました。');
      
    } catch (error) {
      console.error('❌ エラー:', error.message);
    }
  }

  // 記事を削除
  async deletePost(filename) {
    const filepath = path.join(this.postsDir, filename);
    
    const confirm = await this.prompt(`本当に ${filename} を削除しますか？ (yes/no): `);
    
    if (confirm.toLowerCase() === 'yes') {
      await fs.unlink(filepath);
      console.log('✅ 記事を削除しました。');
    } else {
      console.log('キャンセルしました。');
    }
  }

  // 日付範囲で記事を削除
  async deletePostsByDateRange(startDate, endDate) {
    const files = await fs.readdir(this.postsDir);
    const postsToDelete = [];
    
    for (const file of files) {
      if (file.endsWith('.md')) {
        const dateMatch = file.match(/^(\d{4}-\d{2}-\d{2})/);
        if (dateMatch) {
          const postDate = dateMatch[1];
          if (postDate >= startDate && postDate <= endDate) {
            postsToDelete.push(file);
          }
        }
      }
    }
    
    if (postsToDelete.length === 0) {
      console.log('削除対象の記事はありません。');
      return;
    }
    
    console.log('\n削除対象:');
    postsToDelete.forEach(post => console.log(`- ${post}`));
    
    const confirm = await this.prompt(`\n${postsToDelete.length}件の記事を削除しますか？ (yes/no): `);
    
    if (confirm.toLowerCase() === 'yes') {
      for (const post of postsToDelete) {
        await fs.unlink(path.join(this.postsDir, post));
      }
      console.log(`✅ ${postsToDelete.length}件の記事を削除しました。`);
    }
  }

  // プロンプト表示
  prompt(question) {
    return new Promise(resolve => {
      this.rl.question(question, resolve);
    });
  }

  // メインメニュー
  async showMenu() {
    console.log('\n=== ブログ記事管理ツール ===\n');
    console.log('1. 記事一覧');
    console.log('2. 記事編集');
    console.log('3. 記事削除');
    console.log('4. 日付範囲で削除');
    console.log('5. 終了');
    
    const choice = await this.prompt('\n選択してください (1-5): ');
    
    switch (choice) {
      case '1':
        await this.listPosts();
        break;
        
      case '2':
        const posts = await this.listPosts();
        const editIndex = await this.prompt('\n編集する記事番号: ');
        if (posts[editIndex - 1]) {
          await this.editPost(posts[editIndex - 1]);
        }
        break;
        
      case '3':
        const deleteList = await this.listPosts();
        const deleteIndex = await this.prompt('\n削除する記事番号: ');
        if (deleteList[deleteIndex - 1]) {
          await this.deletePost(deleteList[deleteIndex - 1]);
        }
        break;
        
      case '4':
        const startDate = await this.prompt('開始日 (YYYY-MM-DD): ');
        const endDate = await this.prompt('終了日 (YYYY-MM-DD): ');
        await this.deletePostsByDateRange(startDate, endDate);
        break;
        
      case '5':
        this.rl.close();
        return;
    }
    
    // メニューに戻る
    await this.showMenu();
  }
}

// CLIとして実行
if (require.main === module) {
  const manager = new BlogPostManager();
  
  // コマンドライン引数をチェック
  const args = process.argv.slice(2);
  
  if (args[0] === 'delete-range' && args[1] && args[2]) {
    // 日付範囲削除を直接実行
    manager.deletePostsByDateRange(args[1], args[2])
      .then(() => process.exit(0))
      .catch(console.error);
  } else {
    // インタラクティブメニュー
    manager.showMenu().catch(console.error);
  }
}

module.exports = BlogPostManager;