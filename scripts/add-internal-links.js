#!/usr/bin/env node

/**
 * 内部リンク自動追加スクリプト
 * 新規記事に関連する過去記事へのリンクを自動で追加
 */

const fs = require('fs').promises;
const path = require('path');

class InternalLinkManager {
  constructor() {
    this.postsDir = path.join(__dirname, '../_posts');
  }

  // すべての記事を読み込み
  async loadAllPosts() {
    const files = await fs.readdir(this.postsDir);
    const posts = [];
    
    for (const file of files) {
      if (file.endsWith('.md')) {
        const content = await fs.readFile(path.join(this.postsDir, file), 'utf-8');
        const title = this.extractTitle(content);
        const tags = this.extractTags(content);
        const date = file.match(/^(\d{4}-\d{2}-\d{2})/)?.[1];
        
        // permalinkフォーマット: /blog/:year/:month/:day/:title/
        const dateMatch = file.match(/^(\d{4})-(\d{2})-(\d{2})-(.+)\.md$/);
        let url = '#';
        if (dateMatch) {
          const [_, year, month, day, slug] = dateMatch;
          url = `/blog/${year}/${month}/${day}/${slug}/`;
        }
        
        posts.push({
          filename: file,
          title,
          tags,
          date,
          url
        });
      }
    }
    
    return posts.sort((a, b) => b.date.localeCompare(a.date));
  }

  // タイトル抽出
  extractTitle(content) {
    const match = content.match(/^title:\s*"?([^"\n]+)"?/m);
    return match ? match[1] : '';
  }

  // タグ抽出
  extractTags(content) {
    const match = content.match(/^tags:\s*\[(.*?)\]/m);
    if (match) {
      return match[1].split(',').map(tag => tag.trim());
    }
    return [];
  }

  // 関連記事を検索
  findRelatedPosts(currentPost, allPosts, limit = 3) {
    const related = [];
    
    // 現在の記事以外から検索
    const otherPosts = allPosts.filter(p => p.filename !== currentPost.filename);
    
    // スコア計算
    for (const post of otherPosts) {
      let score = 0;
      
      // タグの一致をチェック
      const commonTags = currentPost.tags.filter(tag => 
        post.tags.some(pTag => pTag.toLowerCase() === tag.toLowerCase())
      );
      score += commonTags.length * 10;
      
      // タイトルのキーワード一致をチェック
      const currentKeywords = this.extractKeywords(currentPost.title);
      const postKeywords = this.extractKeywords(post.title);
      const commonKeywords = currentKeywords.filter(kw => 
        postKeywords.includes(kw)
      );
      score += commonKeywords.length * 5;
      
      if (score > 0) {
        related.push({ ...post, score });
      }
    }
    
    // スコア順にソートして上位を返す
    return related
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  // キーワード抽出（簡易版）
  extractKeywords(text) {
    const stopWords = ['の', 'を', 'に', 'で', 'と', 'が', 'は', 'て', 'する', 'こと'];
    return text
      .split(/[\s、。！？・「」『』（）]/g)
      .filter(word => word.length > 1 && !stopWords.includes(word))
      .map(word => word.toLowerCase());
  }

  // 内部リンクセクションを生成
  generateInternalLinksSection(relatedPosts) {
    if (relatedPosts.length === 0) return '';
    
    let section = '\n\n## 関連記事\n\n';
    section += 'こちらの記事もおすすめです：\n\n';
    
    for (const post of relatedPosts) {
      section += `- [${post.title}](${post.url})\n`;
    }
    
    return section;
  }

  // 記事に内部リンクを追加
  async addInternalLinksToPost(filename) {
    const filepath = path.join(this.postsDir, filename);
    let content = await fs.readFile(filepath, 'utf-8');
    
    // すでに関連記事セクションがある場合はスキップ
    if (content.includes('## 関連記事')) {
      console.log(`ℹ️ ${filename} には既に関連記事セクションがあります`);
      return false;
    }
    
    // 現在の記事情報を取得
    const currentPost = {
      filename,
      title: this.extractTitle(content),
      tags: this.extractTags(content)
    };
    
    // すべての記事を読み込み
    const allPosts = await this.loadAllPosts();
    
    // 関連記事を検索
    const relatedPosts = this.findRelatedPosts(currentPost, allPosts);
    
    if (relatedPosts.length > 0) {
      // 内部リンクセクションを生成
      const linksSection = this.generateInternalLinksSection(relatedPosts);
      
      // 記事の最後（フッター前）に追加
      const footerMatch = content.match(/\n---\n\n\*Photo by/);
      if (footerMatch) {
        // フッターの前に挿入
        content = content.replace(
          /(\n---\n\n\*Photo by)/,
          linksSection + '$1'
        );
      } else {
        // 記事の最後に追加
        content += linksSection;
      }
      
      // ファイルを保存
      await fs.writeFile(filepath, content, 'utf-8');
      console.log(`✅ ${filename} に関連記事を追加しました（${relatedPosts.length}件）`);
      return true;
    } else {
      console.log(`ℹ️ ${filename} の関連記事が見つかりませんでした`);
      return false;
    }
  }

  // すべての記事に内部リンクを追加
  async addInternalLinksToAllPosts() {
    const files = await fs.readdir(this.postsDir);
    const posts = files.filter(f => f.endsWith('.md'));
    let updated = 0;
    
    console.log(`📝 ${posts.length}件の記事を処理中...`);
    
    for (const post of posts) {
      const result = await this.addInternalLinksToPost(post);
      if (result) updated++;
    }
    
    console.log(`\n✅ 完了: ${updated}件の記事を更新しました`);
  }

  // 最新の記事にのみ内部リンクを追加
  async addInternalLinksToLatestPost() {
    const files = await fs.readdir(this.postsDir);
    const posts = files
      .filter(f => f.endsWith('.md'))
      .sort()
      .reverse();
    
    if (posts.length > 0) {
      await this.addInternalLinksToPost(posts[0]);
    }
  }
}

// CLIとして実行
if (require.main === module) {
  const manager = new InternalLinkManager();
  const args = process.argv.slice(2);
  
  if (args[0] === 'all') {
    // すべての記事に追加
    manager.addInternalLinksToAllPosts().catch(console.error);
  } else if (args[0] === 'latest') {
    // 最新記事のみ
    manager.addInternalLinksToLatestPost().catch(console.error);
  } else if (args[0]) {
    // 特定の記事
    manager.addInternalLinksToPost(args[0]).catch(console.error);
  } else {
    console.log('使い方:');
    console.log('  node add-internal-links.js all      # すべての記事');
    console.log('  node add-internal-links.js latest   # 最新記事のみ');
    console.log('  node add-internal-links.js [ファイル名]  # 特定の記事');
  }
}

module.exports = InternalLinkManager;