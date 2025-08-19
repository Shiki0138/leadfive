/**
 * Blog Post Manager - ブログ投稿管理システム
 * Jekyllブログ記事の生成、保存、管理を行う
 */

class BlogPostManager {
  constructor() {
    this.generator = new AIBlogGenerator();
    this.posts = this.loadPosts();
  }

  /**
   * 新しいブログ記事を生成して保存
   */
  async createPost(params) {
    try {
      // AI記事生成
      const article = await this.generator.generateArticle(params);
      
      // Jekyll用のフロントマターを生成
      const frontMatter = this.generateFrontMatter({
        title: article.title,
        category: params.category,
        keywords: params.keywords,
        metadata: article.metadata,
        publishDate: params.publishDate || new Date()
      });
      
      // Markdownファイルの内容を生成
      const markdownContent = this.generateMarkdownFile(frontMatter, article);
      
      // ファイル名を生成
      const filename = this.generateFilename(article.title, params.publishDate);
      
      // 投稿データを保存
      const post = {
        id: Date.now(),
        filename: filename,
        title: article.title,
        content: markdownContent,
        category: params.category,
        status: params.publishType || 'draft',
        publishDate: params.publishDate,
        createdAt: new Date().toISOString(),
        metadata: article.metadata,
        instinct: article.instinct.name,
        pattern: article.pattern.name,
        readTime: article.estimatedReadTime
      };
      
      this.savePost(post);
      
      return {
        success: true,
        post: post,
        preview: this.generatePreview(post)
      };
      
    } catch (error) {
      console.error('記事生成エラー:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Jekyllフロントマターを生成
   */
  generateFrontMatter({ title, category, keywords, metadata, publishDate }) {
    const date = new Date(publishDate);
    
    return {
      layout: 'post',
      title: title,
      date: date.toISOString(),
      categories: [this.getCategoryName(category)],
      tags: keywords.split(',').map(k => k.trim()),
      excerpt: metadata.metaDescription,
      seo: {
        title: metadata.metaTitle,
        description: metadata.metaDescription,
        keywords: keywords,
        canonical_url: metadata.canonicalUrl
      },
      structured_data: metadata.structuredData
    };
  }

  /**
   * Markdownファイルを生成
   */
  generateMarkdownFile(frontMatter, article) {
    let markdown = '---\n';
    
    // フロントマターをYAML形式で出力
    markdown += `layout: ${frontMatter.layout}\n`;
    markdown += `title: "${frontMatter.title}"\n`;
    markdown += `date: ${frontMatter.date}\n`;
    markdown += `categories: [${frontMatter.categories.join(', ')}]\n`;
    markdown += `tags: [${frontMatter.tags.join(', ')}]\n`;
    markdown += `excerpt: "${frontMatter.excerpt}"\n`;
    
    // SEO情報
    markdown += 'seo:\n';
    markdown += `  title: "${frontMatter.seo.title}"\n`;
    markdown += `  description: "${frontMatter.seo.description}"\n`;
    markdown += `  keywords: "${frontMatter.seo.keywords}"\n`;
    
    markdown += '---\n\n';
    
    // 記事本文
    markdown += article.content;
    
    return markdown;
  }

  /**
   * ファイル名を生成
   */
  generateFilename(title, publishDate) {
    const date = new Date(publishDate || new Date());
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    // タイトルをスラッグ化
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9ぁ-んァ-ン一-龥]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 50);
    
    return `${year}-${month}-${day}-${slug}.md`;
  }

  /**
   * カテゴリー名を取得
   */
  getCategoryName(categoryId) {
    const categories = {
      'ai-marketing': 'AIマーケティング',
      'psychology': '消費者心理',
      'case-study': '導入事例',
      'tips': '実践テクニック',
      'news': 'お知らせ'
    };
    
    return categories[categoryId] || 'その他';
  }

  /**
   * 投稿を保存
   */
  savePost(post) {
    this.posts.push(post);
    localStorage.setItem('blogPosts', JSON.stringify(this.posts));
    
    // 自動公開のスケジュール設定
    if (post.status === 'scheduled') {
      this.schedulePublication(post);
    }
  }

  /**
   * 投稿を読み込み
   */
  loadPosts() {
    const saved = localStorage.getItem('blogPosts');
    return saved ? JSON.parse(saved) : [];
  }

  /**
   * プレビューを生成
   */
  generatePreview(post) {
    const previewHtml = `
      <article class="blog-preview">
        <header>
          <div class="preview-meta">
            <time>${new Date(post.publishDate).toLocaleDateString('ja-JP')}</time>
            <span class="category">${this.getCategoryName(post.category)}</span>
            <span class="read-time">${post.readTime}分で読了</span>
          </div>
          <h1>${post.title}</h1>
          <div class="preview-badges">
            <span class="badge instinct">${post.instinct}</span>
            <span class="badge pattern">${post.pattern}</span>
          </div>
        </header>
        <div class="preview-content">
          ${this.convertMarkdownToHtml(post.content)}
        </div>
      </article>
    `;
    
    return previewHtml;
  }

  /**
   * MarkdownをHTMLに変換（簡易版）
   */
  convertMarkdownToHtml(markdown) {
    // フロントマターを除去
    const content = markdown.replace(/^---[\s\S]*?---\n\n/, '');
    
    // 基本的なMarkdown変換
    let html = content
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^/, '<p>')
      .replace(/$/, '</p>');
    
    return html;
  }

  /**
   * 公開をスケジュール
   */
  schedulePublication(post) {
    const now = new Date();
    const publishDate = new Date(post.publishDate);
    const delay = publishDate - now;
    
    if (delay > 0) {
      setTimeout(() => {
        this.publishPost(post.id);
      }, delay);
    }
  }

  /**
   * 投稿を公開
   */
  publishPost(postId) {
    const postIndex = this.posts.findIndex(p => p.id === postId);
    
    if (postIndex !== -1) {
      this.posts[postIndex].status = 'published';
      this.posts[postIndex].publishedAt = new Date().toISOString();
      
      localStorage.setItem('blogPosts', JSON.stringify(this.posts));
      
      console.log(`記事「${this.posts[postIndex].title}」が公開されました`);
      
      // 公開通知を表示
      if (window.showNotification) {
        window.showNotification('記事が公開されました', 'success');
      }
    }
  }

  /**
   * 統計情報を取得
   */
  getStatistics() {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    return {
      total: this.posts.length,
      published: this.posts.filter(p => p.status === 'published').length,
      scheduled: this.posts.filter(p => p.status === 'scheduled').length,
      draft: this.posts.filter(p => p.status === 'draft').length,
      thisWeek: this.posts.filter(p => new Date(p.createdAt) > weekAgo).length,
      thisMonth: this.posts.filter(p => new Date(p.createdAt) > monthAgo).length,
      byCategory: this.getStatsByCategory(),
      byInstinct: this.getStatsByInstinct()
    };
  }

  /**
   * カテゴリー別統計
   */
  getStatsByCategory() {
    const stats = {};
    
    this.posts.forEach(post => {
      const category = post.category;
      if (!stats[category]) {
        stats[category] = 0;
      }
      stats[category]++;
    });
    
    return stats;
  }

  /**
   * 本能別統計
   */
  getStatsByInstinct() {
    const stats = {};
    
    this.posts.forEach(post => {
      const instinct = post.instinct;
      if (!stats[instinct]) {
        stats[instinct] = 0;
      }
      stats[instinct]++;
    });
    
    return stats;
  }

  /**
   * 最近の投稿を取得
   */
  getRecentPosts(limit = 10) {
    return this.posts
      .filter(p => p.status === 'published')
      .sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))
      .slice(0, limit);
  }

  /**
   * 関連記事を取得
   */
  getRelatedPosts(postId, limit = 3) {
    const post = this.posts.find(p => p.id === postId);
    if (!post) return [];
    
    // 同じカテゴリーまたは同じ本能を使用している記事を検索
    return this.posts
      .filter(p => 
        p.id !== postId && 
        p.status === 'published' &&
        (p.category === post.category || p.instinct === post.instinct)
      )
      .sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))
      .slice(0, limit);
  }
}

// 通知表示機能
window.showNotification = function(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
};

// スタイルを追加
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    .notification {
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 1rem 2rem;
      background: #8b5cf6;
      color: white;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      opacity: 0;
      transform: translateX(100%);
      transition: all 0.3s ease;
      z-index: 10000;
    }
    
    .notification.show {
      opacity: 1;
      transform: translateX(0);
    }
    
    .notification-success {
      background: #10b981;
    }
    
    .notification-error {
      background: #ef4444;
    }
    
    .blog-preview {
      padding: 2rem;
      background: #f9fafb;
      border-radius: 15px;
      margin: 2rem 0;
    }
    
    .preview-meta {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
      color: #6b7280;
      font-size: 0.875rem;
    }
    
    .preview-badges {
      display: flex;
      gap: 0.5rem;
      margin-top: 1rem;
    }
    
    .badge {
      padding: 0.25rem 1rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 500;
    }
    
    .badge.instinct {
      background: #dbeafe;
      color: #1e40af;
    }
    
    .badge.pattern {
      background: #fef3c7;
      color: #92400e;
    }
  `;
  document.head.appendChild(style);
}

// エクスポート
if (typeof window !== 'undefined') {
  window.BlogPostManager = BlogPostManager;
}