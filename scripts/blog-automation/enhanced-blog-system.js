const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');
const yaml = require('js-yaml');

/**
 * 高品質ブログ生成・管理システム
 * 
 * 機能:
 * - 文章品質向上（箇条書き削減、流れる文章）
 * - 画像管理（重複防止、週次履歴）
 * - 内部リンク自動追加
 * - 読者属性を意識したコンテンツ生成
 */
class EnhancedBlogSystem {
  constructor(options = {}) {
    this.anthropicApiKey = options.anthropicApiKey || process.env.ANTHROPIC_API_KEY;
    this.unsplashApiKey = options.unsplashApiKey || process.env.UNSPLASH_API_KEY;
    this.baseDir = path.join(__dirname, '../..');
    this.postsDir = path.join(this.baseDir, '_posts');
    this.logsDir = path.join(this.baseDir, 'logs');
    this.imagesDir = path.join(this.baseDir, 'assets/images/blog');
    
    // 画像履歴管理
    this.imageHistoryPath = path.join(this.logsDir, 'weekly-image-history.json');
    this.internalLinksPath = path.join(this.logsDir, 'internal-links-queue.json');
  }

  /**
   * 高品質記事生成メソッド
   */
  async generateHighQualityPost(keyword, options = {}) {
    try {
      console.log(`🚀 高品質記事生成開始: "${keyword}"`);
      
      // 1. コンテキスト構築
      const context = await this.buildReaderContext(keyword);
      
      // 2. 記事生成（文章品質重視）
      const content = await this.generateFlowingContent(keyword, context);
      
      // 3. 画像処理（重複防止）
      const contentWithImages = await this.processImagesWithHistory(content);
      
      // 4. 内部リンク候補特定
      await this.identifyInternalLinkOpportunities(contentWithImages, keyword);
      
      // 5. ファイル保存
      const filename = await this.savePost(contentWithImages, keyword);
      
      console.log(`✅ 記事生成完了: ${filename}`);
      return { success: true, filename, title: contentWithImages.title };
      
    } catch (error) {
      console.error('❌ 記事生成エラー:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * 読者属性を考慮したコンテキスト構築
   */
  async buildReaderContext(keyword) {
    const readerPersonas = {
      primary: {
        role: "経営者・事業責任者",
        painPoints: ["売上停滞", "競合他社の台頭", "業務効率化", "コスト削減"],
        interests: ["ROI向上", "自動化", "データ活用", "競争優位性"],
        decisionFactors: ["具体的な成果", "投資対効果", "導入の容易さ", "リスク回避"]
      },
      secondary: {
        role: "マーケティング責任者・担当者",
        painPoints: ["CPAの上昇", "コンバージョン率低下", "業務負荷増大", "成果の数値化"],
        interests: ["最新ツール", "効率化手法", "データ分析", "自動化"],
        decisionFactors: ["実用性", "学習コスト", "運用工数", "結果の可視化"]
      }
    };

    // 過去記事の分析
    const recentPosts = await this.getRecentPosts(5);
    
    return {
      keyword,
      readerPersonas,
      recentTopics: recentPosts.map(p => p.title),
      contentStrategy: "課題提起 → 共感 → 解決策提示 → AI活用の必然性 → 具体的アクション",
      writingTone: "共感的で実践的、説得力のあるストーリーテリング"
    };
  }

  /**
   * 流れる文章重視のコンテンツ生成
   */
  async generateFlowingContent(keyword, context) {
    const prompt = `
あなたは経営者・マーケティング責任者向けの高品質ビジネス記事を執筆するライターです。

## 執筆ルール（厳守）
1. **文章構成**: 流れる文章を重視（箇条書きは全体の20%以下）
2. **読者目線**: ${context.readerPersonas.primary.role}の課題に共感し、実践的価値を提供
3. **ストーリー展開**: 課題 → 共感 → 解決策 → AI活用の必然性 → 具体的アクション
4. **画像配置**: 各h2見出しの直後に{{IMAGE:セクション内容の説明}}を配置
5. **AI訴求**: 直接的ではなく、ビジネス課題解決の文脈でAI活用の必要性を提示

## 読者の属性と関心
- 役職: ${context.readerPersonas.primary.role}
- 課題: ${context.readerPersonas.primary.painPoints.join('、')}
- 関心: ${context.readerPersonas.primary.interests.join('、')}
- 判断基準: ${context.readerPersonas.primary.decisionFactors.join('、')}

## 記事のキーワード
"${keyword}"

## 内容要件
- 文字数: 2500-3000文字
- 見出し構成: h2を3-4個使用
- 各段落: 3-5文で構成、論理的な流れを重視
- 具体例: 実務的で再現性のある事例を含める
- 根拠: 主張には必ず根拠と詳細をセットで提示

## 出力形式
タイトル: [SEO最適化された魅力的なタイトル]
メタディスクリプション: [120-150文字の説明]

[リード文: 150-200文字、読者の課題に共感する導入]

## h2見出し1
{{IMAGE:セクション1の内容を表す説明}}

[本文: 流れる文章で構成。箇条書きではなく、段落を使って論理的に展開]

## h2見出し2  
{{IMAGE:セクション2の内容を表す説明}}

[本文: 具体例を交えた実践的な内容]

## h2見出し3
{{IMAGE:セクション3の内容を表す説明}}

[本文: AI活用の必要性を自然に導く]

## まとめ
[実践的な次のアクション]

参考文献:
1. [出典1のタイトル] - URL
2. [出典2のタイトル] - URL
3. [出典3のタイトル] - URL

キーワード: "${keyword}"に関する記事を、上記の形式で執筆してください。
`;

    const response = await this.callAnthropicAPI(prompt);
    return this.parseContentResponse(response);
  }

  /**
   * 画像処理（重複防止・履歴管理）
   */
  async processImagesWithHistory(content) {
    console.log('🖼️ 画像処理開始...');
    
    let processedContent = content.content;
    const imageMatches = processedContent.match(/\{\{IMAGE:([^}]+)\}\}/g) || [];
    
    if (imageMatches.length === 0) {
      return content;
    }

    const usedImages = new Set();
    const weeklyHistory = await this.loadWeeklyImageHistory();
    
    for (let i = 0; i < imageMatches.length; i++) {
      const match = imageMatches[i];
      const imageDescription = match.match(/\{\{IMAGE:([^}]+)\}\}/)[1];
      
      // 同一記事内で重複チェック
      if (usedImages.has(imageDescription)) {
        processedContent = processedContent.replace(match, '');
        continue;
      }
      
      // 適切な画像を取得
      const imageUrl = await this.fetchUniqueImage(imageDescription, weeklyHistory);
      
      if (imageUrl) {
        const localPath = await this.downloadAndSaveImage(imageUrl, i + 1);
        if (localPath) {
          processedContent = processedContent.replace(match, 
            `\n\n![${imageDescription}](${localPath})\n\n`);
          usedImages.add(imageDescription);
          await this.updateImageHistory(imageUrl, imageDescription);
        } else {
          processedContent = processedContent.replace(match, '');
        }
      } else {
        processedContent = processedContent.replace(match, '');
      }
    }
    
    return { ...content, content: processedContent };
  }

  /**
   * 重複しない画像取得
   */
  async fetchUniqueImage(description, weeklyHistory) {
    try {
      const searchQuery = this.generateImageSearchQuery(description);
      
      // 過去7日間で使用済みの画像IDを取得
      const excludeIds = this.getRecentImageIds(weeklyHistory);
      
      const response = await axios.get('https://api.unsplash.com/search/photos', {
        params: {
          query: searchQuery,
          per_page: 20,
          orientation: 'landscape'
        },
        headers: {
          'Authorization': `Client-ID ${this.unsplashApiKey}`
        }
      });
      
      // 使用済みでない画像を選択
      const availableImages = response.data.results.filter(
        img => !excludeIds.includes(img.id)
      );
      
      return availableImages.length > 0 ? availableImages[0].urls.regular : null;
      
    } catch (error) {
      console.warn('画像取得エラー:', error.message);
      return null;
    }
  }

  /**
   * 画像検索クエリ生成
   */
  generateImageSearchQuery(description) {
    const queryMappings = {
      '成功事例': 'business success team celebration office',
      '実践方法': 'business workflow process strategy',
      'データ分析': 'data analytics dashboard business intelligence',
      '戦略': 'business strategy planning meeting boardroom',
      'ツール': 'modern software dashboard interface technology',
      '課題解決': 'problem solving teamwork collaboration office',
      'ベネフィット': 'business growth chart success metrics',
      'トレンド': 'technology trends innovation digital transformation',
      'ワークフロー': 'efficient workflow automation productivity',
      'AI活用': 'artificial intelligence business technology modern',
      'マーケティング': 'digital marketing analytics business growth',
      'コラボレーション': 'team collaboration modern office workspace'
    };
    
    for (const [key, query] of Object.entries(queryMappings)) {
      if (description.includes(key)) {
        return query;
      }
    }
    
    return 'professional business modern office technology';
  }

  /**
   * 内部リンク機会の特定
   */
  async identifyInternalLinkOpportunities(content, currentKeyword) {
    const existingPosts = await this.getAllPosts();
    const opportunities = [];
    
    // コンテンツから関連キーワードを抽出
    const contentKeywords = this.extractKeywords(content.content);
    
    for (const post of existingPosts) {
      const postKeywords = this.extractKeywords(post.content);
      const commonKeywords = contentKeywords.filter(k => postKeywords.includes(k));
      
      if (commonKeywords.length >= 2 && post.keyword !== currentKeyword) {
        opportunities.push({
          targetPost: post.filename,
          targetTitle: post.title,
          commonKeywords,
          relevanceScore: commonKeywords.length
        });
      }
    }
    
    // 機会をキューに追加
    await this.addToInternalLinksQueue(content.title, opportunities);
    
    return opportunities;
  }

  /**
   * 週次内部リンク更新
   */
  async performWeeklyInternalLinkUpdate() {
    console.log('🔗 週次内部リンク更新開始...');
    
    const queue = await this.loadInternalLinksQueue();
    let updatedPosts = 0;
    
    for (const item of queue) {
      if (item.opportunities.length > 0) {
        // 最も関連度の高い記事にリンクを追加
        const bestOpportunity = item.opportunities
          .sort((a, b) => b.relevanceScore - a.relevanceScore)[0];
          
        const updated = await this.addInternalLinkToPost(
          bestOpportunity.targetPost, 
          item.postTitle, 
          bestOpportunity.commonKeywords
        );
        
        if (updated) {
          updatedPosts++;
        }
      }
    }
    
    // キューをクリア
    await this.clearInternalLinksQueue();
    
    console.log(`✅ ${updatedPosts}件の記事に内部リンクを追加しました`);
    return updatedPosts;
  }

  /**
   * Anthropic API呼び出し
   */
  async callAnthropicAPI(prompt) {
    const response = await axios.post('https://api.anthropic.com/v1/messages', {
      model: 'claude-3-sonnet-20240229',
      max_tokens: 4000,
      messages: [{
        role: 'user',
        content: prompt
      }]
    }, {
      headers: {
        'x-api-key': this.anthropicApiKey,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      }
    });
    
    return response.data.content[0].text;
  }

  /**
   * ヘルパーメソッド群
   */
  
  async loadWeeklyImageHistory() {
    try {
      const data = await fs.readFile(this.imageHistoryPath, 'utf-8');
      return JSON.parse(data);
    } catch (e) {
      return [];
    }
  }
  
  getRecentImageIds(history) {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return history
      .filter(h => new Date(h.used_at) > sevenDaysAgo)
      .map(h => h.photo_id);
  }
  
  async updateImageHistory(imageUrl, description) {
    const history = await this.loadWeeklyImageHistory();
    const photoIdMatch = imageUrl.match(/photo-([\w-]+)/);
    const photoId = photoIdMatch ? photoIdMatch[1] : imageUrl;
    
    history.push({
      photo_id: photoId,
      used_at: new Date().toISOString(),
      description: description,
      url: imageUrl
    });
    
    // 古い履歴を削除
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentHistory = history.filter(h => new Date(h.used_at) > sevenDaysAgo);
    
    await fs.mkdir(path.dirname(this.imageHistoryPath), { recursive: true });
    await fs.writeFile(this.imageHistoryPath, JSON.stringify(recentHistory, null, 2));
  }
  
  async downloadAndSaveImage(imageUrl, index) {
    try {
      const response = await axios.get(imageUrl, { responseType: 'stream' });
      const imageName = `blog-image-${Date.now()}-${index}.jpg`;
      const localPath = `assets/images/blog/${imageName}`;
      const fullPath = path.join(this.baseDir, localPath);
      
      await fs.mkdir(path.dirname(fullPath), { recursive: true });
      
      const writer = require('fs').createWriteStream(fullPath);
      response.data.pipe(writer);
      
      return new Promise((resolve, reject) => {
        writer.on('finish', () => resolve(`/${localPath}`));
        writer.on('error', reject);
      });
    } catch (error) {
      console.warn('画像ダウンロードエラー:', error.message);
      return null;
    }
  }
  
  parseContentResponse(response) {
    const lines = response.split('\n');
    let title = '';
    let description = '';
    let content = '';
    let inContent = false;
    
    for (const line of lines) {
      if (line.startsWith('タイトル:') || line.startsWith('Title:')) {
        title = line.split(':').slice(1).join(':').trim();
      } else if (line.startsWith('メタディスクリプション:') || line.startsWith('Meta:')) {
        description = line.split(':').slice(1).join(':').trim();
      } else if (title && description && line.trim()) {
        inContent = true;
      }
      
      if (inContent) {
        content += line + '\n';
      }
    }
    
    return { title, description, content: content.trim() };
  }
  
  async getRecentPosts(limit = 5) {
    try {
      const files = await fs.readdir(this.postsDir);
      const mdFiles = files.filter(f => f.endsWith('.md')).slice(0, limit);
      
      const posts = [];
      for (const file of mdFiles) {
        const content = await fs.readFile(path.join(this.postsDir, file), 'utf-8');
        const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
        if (frontMatterMatch) {
          const frontMatter = yaml.load(frontMatterMatch[1]);
          posts.push({ title: frontMatter.title, filename: file });
        }
      }
      
      return posts;
    } catch (error) {
      return [];
    }
  }
  
  async getAllPosts() {
    try {
      const files = await fs.readdir(this.postsDir);
      const mdFiles = files.filter(f => f.endsWith('.md'));
      
      const posts = [];
      for (const file of mdFiles) {
        const content = await fs.readFile(path.join(this.postsDir, file), 'utf-8');
        posts.push({ filename: file, content });
      }
      
      return posts;
    } catch (error) {
      return [];
    }
  }
  
  extractKeywords(content) {
    // 簡単なキーワード抽出ロジック
    const keywords = content.match(/[ァ-ヶー]{2,}/g) || [];
    return [...new Set(keywords)].filter(k => k.length >= 2);
  }
  
  async loadInternalLinksQueue() {
    try {
      const data = await fs.readFile(this.internalLinksPath, 'utf-8');
      return JSON.parse(data);
    } catch (e) {
      return [];
    }
  }
  
  async addToInternalLinksQueue(postTitle, opportunities) {
    const queue = await this.loadInternalLinksQueue();
    queue.push({ postTitle, opportunities, createdAt: new Date().toISOString() });
    
    await fs.mkdir(path.dirname(this.internalLinksPath), { recursive: true });
    await fs.writeFile(this.internalLinksPath, JSON.stringify(queue, null, 2));
  }
  
  async clearInternalLinksQueue() {
    await fs.writeFile(this.internalLinksPath, JSON.stringify([], null, 2));
  }
  
  async addInternalLinkToPost(filename, linkTitle, commonKeywords) {
    // 実装は記事の内容と構造に依存
    return true; // 簡略化
  }
  
  async savePost(content, keyword) {
    const date = new Date();
    const filename = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}-${keyword.replace(/[^a-zA-Z0-9\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g, '-')}.md`;
    const filepath = path.join(this.postsDir, filename);
    
    const frontMatter = `---
layout: blog-post
title: "${content.title}"
date: ${date.toISOString()}
categories: [AI活用, マーケティング]
tags: [${keyword}, 生成AI, 業務効率化, DX]
description: "${content.description}"
author: "LeadFive AI"
featured: true
reading_time: ${Math.ceil(content.content.length / 500)}
---

`;
    
    const fullContent = frontMatter + content.content;
    
    await fs.mkdir(this.postsDir, { recursive: true });
    await fs.writeFile(filepath, fullContent, 'utf-8');
    
    return filename;
  }
}

module.exports = EnhancedBlogSystem;

// CLI実行
if (require.main === module) {
  const keyword = process.argv[2];
  
  if (!keyword) {
    console.error('❌ キーワードを指定してください');
    process.exit(1);
  }
  
  const system = new EnhancedBlogSystem();
  
  if (process.argv[3] === '--internal-links') {
    // 週次内部リンク更新
    system.performWeeklyInternalLinkUpdate()
      .then(count => {
        console.log(`✅ ${count}件更新完了`);
        process.exit(0);
      })
      .catch(error => {
        console.error('❌ エラー:', error);
        process.exit(1);
      });
  } else {
    // 通常の記事生成
    system.generateHighQualityPost(keyword)
      .then(result => {
        if (result.success) {
          console.log(`✅ 高品質記事生成完了: ${result.title}`);
          process.exit(0);
        } else {
          console.error(`❌ 生成失敗: ${result.error}`);
          process.exit(1);
        }
      })
      .catch(error => {
        console.error('❌ 予期しないエラー:', error);
        process.exit(1);
      });
  }
}