#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

/**
 * Claude API を使用せずにモックでブログを生成するジェネレーター
 * 開発・テスト用途に使用
 */
class MockBlogGenerator {
  constructor(config = {}) {
    this.keyword = config.keyword;
    this.postsDir = path.join(__dirname, '../../_posts');
    this.imagesDir = path.join(__dirname, '../../assets/images/blog');
    this.dataDir = path.join(__dirname, '../../_data/blog');
  }

  async generateBlogPost() {
    console.log(`🧪 モックブログ記事生成開始: ${this.keyword}`);
    
    try {
      // モックコンテンツを生成
      const content = await this.generateMockContent();
      
      // 内部リンクを挿入
      const linkedContent = await this.insertInternalLinks(content);
      
      // 画像プレースホルダーを挿入
      const finalContent = await this.insertImagePlaceholders(linkedContent);
      
      // ファイルを保存
      const filename = await this.savePost(finalContent);
      
      // 統計を更新
      await this.updateStats(filename, finalContent.title);
      
      console.log(`✅ モックブログ記事生成完了: ${filename}`);
      return { success: true, filename, title: finalContent.title };
      
    } catch (error) {
      console.error('❌ モックブログ生成エラー:', error);
      return { success: false, error: error.message };
    }
  }

  async generateMockContent() {
    console.log('📝 モックコンテンツ生成中...');
    
    // テンプレートベースのコンテンツ生成（結論ファースト型）
    const templates = {
      'AIマーケティング': {
        title: `なぜ${this.keyword}で成功する企業は27%しかいないのか？逆説的アプローチの真実`,
        intro: `衝撃的な事実から始めましょう。${this.keyword}を導入した企業の73%が期待した成果を得られていません。成功の秘訣は、実は「使いすぎない」ことにありました。`,
        sections: [
          {
            heading: `結論: ${this.keyword}の真実`,
            content: `${this.keyword}で本当に成功するには、**AIに頼りすぎないこと**が重要です。\n\n成功企業の共通点：\n- AIは補助ツールとして限定使用\n- 人間の創造性を最優先\n- 顧客との直接対話を重視\n\n{{IMAGE:衝撃的な統計グラフ}}\n\n{{INTERNAL_LINK:AI活用の新常識}}`
          },
          {
            heading: '導入のメリット',
            content: `${this.keyword}を導入することで、以下のようなメリットが期待できます：\n\n1. **効率化**: 作業時間を最大70%削減\n2. **精度向上**: ターゲティング精度が平均35%向上\n3. **ROI改善**: マーケティングROIが平均150%改善\n\n{{IMAGE:ビジネス成長のイメージ}}`
          },
          {
            heading: '実装ステップ',
            content: `実際に${this.keyword}を導入する際の具体的なステップを解説します：\n\n### ステップ1: 現状分析\n現在のマーケティング課題を明確化し、改善ポイントを特定します。\n\n### ステップ2: ツール選定\n自社のニーズに合ったAIツールを選定します。\n\n{{INTERNAL_LINK:おすすめAIツール比較}}\n\n### ステップ3: 段階的導入\nスモールスタートで始め、徐々に適用範囲を拡大していきます。`
          },
          {
            heading: '成功事例',
            content: `実際に${this.keyword}を活用して成功した企業の事例を紹介します：\n\n**事例1: A社（小売業）**\n- 課題: 顧客エンゲージメントの低下\n- 施策: AIによるパーソナライズドレコメンデーション\n- 結果: CVR 45%向上、顧客満足度 32%向上\n\n{{IMAGE:成功事例のグラフ}}\n\n**事例2: B社（サービス業）**\n- 課題: マーケティングコストの増大\n- 施策: AI予測分析による広告最適化\n- 結果: CPA 60%削減、ROI 200%向上`
          },
          {
            heading: 'よくある課題と対策',
            content: `${this.keyword}導入時によく直面する課題と、その対策について解説します：\n\n1. **データ不足**: 小規模から始めて徐々にデータを蓄積\n2. **スキル不足**: 外部パートナーの活用や研修の実施\n3. **組織の抵抗**: 小さな成功体験を積み重ねて理解を促進\n\n{{INTERNAL_LINK:AI導入の障壁を乗り越える方法}}`
          },
          {
            heading: '今後の展望',
            content: `${this.keyword}の今後の発展について、以下のようなトレンドが予測されています：\n\n- マルチモーダルAIの活用拡大\n- リアルタイム最適化の高度化\n- 倫理的AIの重要性増大\n\n{{IMAGE:未来のマーケティング}}`
          }
        ],
        conclusion: `${this.keyword}は、これからのマーケティング戦略において必須の要素となります。本記事で紹介した内容を参考に、ぜひ自社での導入を検討してみてください。`
      }
    };
    
    // デフォルトテンプレートを使用
    const template = templates['AIマーケティング'];
    
    // コンテンツを組み立て
    let content = `# ${template.title}\n\n`;
    content += `${template.intro}\n\n`;
    
    for (const section of template.sections) {
      content += `## ${section.heading}\n\n`;
      content += `${section.content}\n\n`;
    }
    
    content += `## まとめ\n\n${template.conclusion}\n\n`;
    content += `{{INTERNAL_LINK:お問い合わせはこちら}}`;
    
    // メタデータを生成
    const description = template.intro.substring(0, 150) + '...';
    
    return {
      title: template.title,
      description: description,
      content: content,
      wordCount: content.length
    };
  }

  async insertInternalLinks(content) {
    console.log('🔗 内部リンク挿入中...');
    
    // モック内部リンクマッピング
    const linkMap = {
      'AI活用の基礎知識': '/blog/ai-basics-guide/',
      'おすすめAIツール比較': '/blog/ai-tools-comparison/',
      'AI導入の障壁を乗り越える方法': '/blog/overcome-ai-challenges/',
      'お問い合わせはこちら': '/contact/'
    };
    
    let linkedContent = content.content;
    
    // {{INTERNAL_LINK:xxx}}を実際のリンクに置換
    for (const [text, url] of Object.entries(linkMap)) {
      const pattern = `{{INTERNAL_LINK:${text}}}`;
      const link = `[${text}](${url})`;
      linkedContent = linkedContent.replace(new RegExp(pattern, 'g'), link);
    }
    
    return { ...content, content: linkedContent };
  }

  async insertImagePlaceholders(content) {
    console.log('🖼️ 画像プレースホルダー挿入中...');
    
    let finalContent = content.content;
    const imageMatches = finalContent.match(/\{\{IMAGE:([^}]+)\}\}/g) || [];
    
    for (let i = 0; i < imageMatches.length; i++) {
      const match = imageMatches[i];
      const description = match.match(/\{\{IMAGE:([^}]+)\}\}/)[1];
      
      // プレースホルダー画像のパス
      const imagePath = `/assets/images/blog/placeholder-${i + 1}.jpg`;
      
      // マークダウン形式の画像タグに置換
      const imageTag = `\n\n![${description}](${imagePath})\n\n`;
      finalContent = finalContent.replace(match, imageTag);
    }
    
    return { ...content, content: finalContent };
  }

  async savePost(content) {
    const date = new Date();
    const dateStr = date.toISOString().split('T')[0];
    const slug = this.keyword
      .replace(/[【】「」『』（）]/g, '')
      .replace(/\s+/g, '-')
      .toLowerCase()
      .substring(0, 50);
    
    const filename = `${dateStr}-mock-${slug}.md`;
    const filepath = path.join(this.postsDir, filename);
    
    const frontMatter = `---
layout: blog-post
title: "${content.title}"
date: ${date.toISOString()}
categories: [AIマーケティング, テスト]
tags: [${this.keyword}, モック記事, テスト]
description: "${content.description}"
author: "Mock Generator"
image: "/assets/images/blog/placeholder-1.jpg"
featured: false
reading_time: ${Math.ceil(content.wordCount / 500)}
mock_generated: true
---

`;
    
    const fullContent = frontMatter + content.content;
    
    await fs.mkdir(this.postsDir, { recursive: true });
    await fs.writeFile(filepath, fullContent, 'utf-8');
    
    return filename;
  }

  async updateStats(filename, title) {
    const statsFile = path.join(this.dataDir, 'mock-blog-stats.json');
    
    let stats = {
      totalMockPosts: 0,
      monthlyMockPosts: {},
      lastMockGenerated: null
    };
    
    try {
      const existing = await fs.readFile(statsFile, 'utf-8');
      stats = JSON.parse(existing);
    } catch (error) {
      // ファイルが存在しない場合は初期値を使用
    }
    
    const month = new Date().toISOString().substring(0, 7);
    
    stats.totalMockPosts++;
    stats.monthlyMockPosts[month] = (stats.monthlyMockPosts[month] || 0) + 1;
    stats.lastMockGenerated = {
      date: new Date().toISOString(),
      filename,
      title,
      keyword: this.keyword
    };
    
    await fs.mkdir(this.dataDir, { recursive: true });
    await fs.writeFile(statsFile, JSON.stringify(stats, null, 2), 'utf-8');
  }
}

// CLIとして実行
if (require.main === module) {
  const keyword = process.argv[2] || 'AIマーケティング 自動化';
  
  console.log('🧪 モックブログジェネレーターを実行します');
  console.log('⚠️  これはテスト用のモック生成です。本番では Claude API を使用してください。\n');
  
  const generator = new MockBlogGenerator({ keyword });
  
  generator.generateBlogPost()
    .then(result => {
      if (result.success) {
        console.log(`\n✅ モック記事生成成功: ${result.title}`);
        console.log(`📄 ファイル: ${result.filename}`);
        console.log('\n💡 本番環境では ANTHROPIC_API_KEY を設定して claude-blog-generator.js を使用してください。');
      } else {
        console.error(`\n❌ 生成失敗: ${result.error}`);
      }
    })
    .catch(error => {
      console.error('\n❌ 予期しないエラー:', error);
      process.exit(1);
    });
}

module.exports = MockBlogGenerator;