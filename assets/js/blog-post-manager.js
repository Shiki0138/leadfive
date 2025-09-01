/**
 * Blog Post Manager - ブログ投稿管理システム
 * Jekyllブログ記事の生成、保存、管理を行う
 */

class BlogPostManager {
  constructor() {
    this.generator = new AIBlogGenerator();
    this.posts = [];
    this.githubToken = localStorage.getItem('github_token');
    this.repoOwner = 'Shiki0138';
    this.repoName = 'leadfive';
    this.currentPage = 1;
    this.postsPerPage = 10;
    this.filteredPosts = [];
    this.init();
  }
  
  async init() {
    await this.loadPostsFromGitHub();
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
   * GitHubから記事を読み込み
   */
  async loadPostsFromGitHub() {
    try {
      const response = await fetch(`https://api.github.com/repos/${this.repoOwner}/${this.repoName}/contents/_posts`, {
        headers: this.githubToken ? {
          'Authorization': `token ${this.githubToken}`,
          'Accept': 'application/vnd.github.v3+json'
        } : {
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (!response.ok) {
        throw new Error(`GitHub API Error: ${response.status}`);
      }

      const files = await response.json();
      const posts = [];

      for (const file of files.filter(f => f.name.endsWith('.md'))) {
        try {
          const post = await this.loadPostContent(file);
          if (post) posts.push(post);
        } catch (error) {
          console.error(`Error loading post ${file.name}:`, error);
        }
      }

      this.posts = posts.sort((a, b) => new Date(b.date) - new Date(a.date));
      this.filteredPosts = [...this.posts];
      
      console.log(`Loaded ${this.posts.length} posts from GitHub`);
      
      return this.posts;
    } catch (error) {
      console.error('Error loading posts from GitHub:', error);
      // フォールバック: ローカルストレージから読み込み
      const saved = localStorage.getItem('blogPosts');
      this.posts = saved ? JSON.parse(saved) : [];
      this.filteredPosts = [...this.posts];
      return this.posts;
    }
  }

  /**
   * 個別の記事コンテンツを読み込み
   */
  async loadPostContent(file) {
    try {
      const response = await fetch(file.download_url);
      const content = await response.text();
      
      // フロントマターを解析
      const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)/);
      if (!frontMatterMatch) return null;

      const frontMatter = this.parseFrontMatter(frontMatterMatch[1]);
      const bodyContent = frontMatterMatch[2];

      return {
        id: file.sha,
        filename: file.name,
        path: file.path,
        sha: file.sha,
        title: frontMatter.title || 'Untitled',
        date: frontMatter.date || file.name.match(/^(\d{4}-\d{2}-\d{2})/)?.[1] || '2025-01-01',
        categories: frontMatter.categories || [],
        tags: frontMatter.tags || [],
        description: frontMatter.description || '',
        author: frontMatter.author || 'Unknown',
        content: content,
        bodyContent: bodyContent,
        frontMatter: frontMatter,
        status: 'published', // GitHub上のファイルは公開済み
        lastModified: file.last_modified || new Date().toISOString(),
        size: file.size,
        downloadUrl: file.download_url
      };
    } catch (error) {
      console.error(`Error loading content for ${file.name}:`, error);
      return null;
    }
  }

  /**
   * フロントマターをパース
   */
  parseFrontMatter(yamlString) {
    const result = {};
    const lines = yamlString.split('\n');
    
    for (const line of lines) {
      const match = line.match(/^([^:]+):\s*(.*)$/);
      if (match) {
        const key = match[1].trim();
        let value = match[2].trim();
        
        // 配列の処理
        if (value.startsWith('[') && value.endsWith(']')) {
          value = value.slice(1, -1).split(',').map(v => v.trim().replace(/['"]/g, ''));
        }
        // 文字列のクォート除去
        else if ((value.startsWith('"') && value.endsWith('"')) || 
                 (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        
        result[key] = value;
      }
    }
    
    return result;
  }

  /**
   * 投稿を読み込み（後方互換性のため残す）
   */
  loadPosts() {
    return this.posts;
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

  /**
   * 記事を編集
   */
  async updatePost(postId, updatedContent) {
    try {
      const post = this.posts.find(p => p.id === postId);
      if (!post) {
        throw new Error('記事が見つかりません');
      }

      if (!this.githubToken) {
        throw new Error('GitHub認証が必要です');
      }

      // GitHub APIで記事を更新
      const response = await fetch(`https://api.github.com/repos/${this.repoOwner}/${this.repoName}/contents/${post.path}`, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${this.githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: `記事更新: ${post.title}`,
          content: btoa(unescape(encodeURIComponent(updatedContent))), // Base64エンコード
          sha: post.sha
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`GitHub API Error: ${response.status} - ${errorData.message}`);
      }

      const result = await response.json();
      
      // ローカルの記事データを更新
      const postIndex = this.posts.findIndex(p => p.id === postId);
      if (postIndex !== -1) {
        const updatedPost = await this.loadPostContent({
          name: post.filename,
          download_url: result.content.download_url,
          sha: result.content.sha,
          path: result.content.path,
          size: result.content.size
        });

        if (updatedPost) {
          this.posts[postIndex] = updatedPost;
          this.filteredPosts = [...this.posts];
        }
      }

      return {
        success: true,
        message: '記事が正常に更新されました',
        post: this.posts[postIndex]
      };

    } catch (error) {
      console.error('記事更新エラー:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 記事を削除
   */
  async deletePost(postId) {
    try {
      const post = this.posts.find(p => p.id === postId);
      if (!post) {
        throw new Error('記事が見つかりません');
      }

      if (!this.githubToken) {
        throw new Error('GitHub認証が必要です');
      }

      // 削除確認
      if (!confirm(`記事「${post.title}」を削除しますか？この操作は取り消せません。`)) {
        return { success: false, message: 'キャンセルされました' };
      }

      // GitHub APIで記事を削除
      const response = await fetch(`https://api.github.com/repos/${this.repoOwner}/${this.repoName}/contents/${post.path}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `token ${this.githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: `記事削除: ${post.title}`,
          sha: post.sha
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`GitHub API Error: ${response.status} - ${errorData.message}`);
      }

      // ローカルから削除
      this.posts = this.posts.filter(p => p.id !== postId);
      this.filteredPosts = this.filteredPosts.filter(p => p.id !== postId);

      return {
        success: true,
        message: '記事が正常に削除されました'
      };

    } catch (error) {
      console.error('記事削除エラー:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 記事を検索・フィルタ
   */
  filterPosts(searchTerm = '', category = '') {
    this.filteredPosts = this.posts.filter(post => {
      const matchesSearch = !searchTerm || 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory = !category || 
        post.categories.includes(category) ||
        post.categories.some(cat => cat.toLowerCase().includes(category.toLowerCase()));

      return matchesSearch && matchesCategory;
    });

    this.currentPage = 1; // 検索時は1ページ目にリセット
    return this.filteredPosts;
  }

  /**
   * ページネーション用の記事を取得
   */
  getPagedPosts(page = 1) {
    const startIndex = (page - 1) * this.postsPerPage;
    const endIndex = startIndex + this.postsPerPage;
    
    return {
      posts: this.filteredPosts.slice(startIndex, endIndex),
      currentPage: page,
      totalPages: Math.ceil(this.filteredPosts.length / this.postsPerPage),
      totalPosts: this.filteredPosts.length
    };
  }

  /**
   * GitHub認証を設定
   */
  setGitHubToken(token) {
    this.githubToken = token;
    localStorage.setItem('github_token', token);
  }

  /**
   * GitHub認証を削除
   */
  removeGitHubToken() {
    this.githubToken = null;
    localStorage.removeItem('github_token');
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
  const bpmStyleEl = document.createElement('style');
  bpmStyleEl.textContent = `
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
  document.head.appendChild(bpmStyleEl);
}

// エクスポート
if (typeof window !== 'undefined') {
  window.BlogPostManager = BlogPostManager;
}
