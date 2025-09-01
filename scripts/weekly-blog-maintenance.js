const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

/**
 * 週次ブログメンテナンス
 * 
 * 機能:
 * 1. 内部リンクの自動追加
 * 2. 画像履歴のクリーンアップ
 * 3. SEO分析とレポート生成
 * 4. コンテンツ品質チェック
 */
class WeeklyBlogMaintenance {
  constructor() {
    this.baseDir = path.join(__dirname, '..');
    this.logsDir = path.join(this.baseDir, 'logs');
    this.postsDir = path.join(this.baseDir, '_posts');
  }

  async runWeeklyMaintenance() {
    console.log('🔄 週次ブログメンテナンス開始...');
    
    try {
      // 1. 内部リンク更新
      await this.updateInternalLinks();
      
      // 2. 画像履歴整理
      await this.cleanupImageHistory();
      
      // 3. コンテンツ品質分析
      const qualityReport = await this.analyzeContentQuality();
      
      // 4. SEO分析
      const seoReport = await this.analyzeSEOMetrics();
      
      // 5. 週次レポート生成
      await this.generateWeeklyReport(qualityReport, seoReport);
      
      console.log('✅ 週次メンテナンス完了');
      return { success: true };
      
    } catch (error) {
      console.error('❌ 週次メンテナンスエラー:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * 内部リンク自動追加
   */
  async updateInternalLinks() {
    console.log('🔗 内部リンク更新中...');
    
    const EnhancedBlogSystem = require('./blog-automation/enhanced-blog-system');
    const system = new EnhancedBlogSystem();
    
    const updatedCount = await system.performWeeklyInternalLinkUpdate();
    console.log(`✅ ${updatedCount}件の内部リンクを追加しました`);
    
    return updatedCount;
  }

  /**
   * 画像履歴クリーンアップ
   */
  async cleanupImageHistory() {
    console.log('🖼️ 画像履歴整理中...');
    
    const historyPath = path.join(this.logsDir, 'weekly-image-history.json');
    
    try {
      const data = await fs.readFile(historyPath, 'utf-8');
      const history = JSON.parse(data);
      
      // 7日以上古い履歴を削除
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const recentHistory = history.filter(h => new Date(h.used_at) > sevenDaysAgo);
      
      await fs.writeFile(historyPath, JSON.stringify(recentHistory, null, 2));
      
      const cleanedCount = history.length - recentHistory.length;
      console.log(`✅ ${cleanedCount}件の古い画像履歴を削除しました`);
      
      return cleanedCount;
      
    } catch (error) {
      console.log('画像履歴ファイルが存在しないか、読み取りできませんでした');
      return 0;
    }
  }

  /**
   * コンテンツ品質分析
   */
  async analyzeContentQuality() {
    console.log('📊 コンテンツ品質分析中...');
    
    const posts = await this.getAllPosts();
    const qualityMetrics = {
      totalPosts: posts.length,
      averageLength: 0,
      bulletPointRatio: 0,
      imageCount: 0,
      internalLinksCount: 0,
      qualityScores: []
    };

    let totalLength = 0;
    let totalBulletPoints = 0;
    let totalImages = 0;
    let totalInternalLinks = 0;

    for (const post of posts) {
      const content = post.content;
      const wordCount = content.length;
      const bulletPoints = (content.match(/^[\s]*[-*+]\s/gm) || []).length;
      const images = (content.match(/!\[.*?\]\(.*?\)/g) || []).length;
      const internalLinks = (content.match(/\[.*?\]\(\/.*?\)/g) || []).length;
      
      totalLength += wordCount;
      totalBulletPoints += bulletPoints;
      totalImages += images;
      totalInternalLinks += internalLinks;
      
      // 品質スコア計算（0-100）
      const qualityScore = this.calculateQualityScore(wordCount, bulletPoints, images, internalLinks);
      qualityMetrics.qualityScores.push({
        filename: post.filename,
        score: qualityScore,
        length: wordCount,
        bulletPoints,
        images,
        internalLinks
      });
    }

    qualityMetrics.averageLength = Math.round(totalLength / posts.length);
    qualityMetrics.bulletPointRatio = Math.round((totalBulletPoints / totalLength) * 1000) / 10; // パーミル
    qualityMetrics.imageCount = totalImages;
    qualityMetrics.internalLinksCount = totalInternalLinks;

    return qualityMetrics;
  }

  /**
   * 品質スコア計算
   */
  calculateQualityScore(wordCount, bulletPoints, images, internalLinks) {
    let score = 50; // ベーススコア
    
    // 文字数評価（2500-3000が理想）
    if (wordCount >= 2500 && wordCount <= 3000) {
      score += 20;
    } else if (wordCount >= 2000) {
      score += 10;
    }
    
    // 箇条書き比率評価（20%以下が理想）
    const bulletPointRatio = (bulletPoints / wordCount) * 100;
    if (bulletPointRatio <= 20) {
      score += 15;
    } else if (bulletPointRatio <= 30) {
      score += 5;
    }
    
    // 画像評価（2-4枚が理想）
    if (images >= 2 && images <= 4) {
      score += 10;
    } else if (images >= 1) {
      score += 5;
    }
    
    // 内部リンク評価（1-3個が理想）
    if (internalLinks >= 1 && internalLinks <= 3) {
      score += 5;
    }
    
    return Math.min(100, Math.max(0, score));
  }

  /**
   * SEO分析
   */
  async analyzeSEOMetrics() {
    console.log('🔍 SEO分析中...');
    
    const posts = await this.getAllPosts();
    const seoMetrics = {
      totalPosts: posts.length,
      avgTitleLength: 0,
      avgDescriptionLength: 0,
      h2Count: 0,
      keywordDensity: {},
      seoScores: []
    };

    let totalTitleLength = 0;
    let totalDescLength = 0;
    let totalH2Count = 0;

    for (const post of posts) {
      const frontMatter = this.extractFrontMatter(post.content);
      const content = post.content;
      
      const titleLength = frontMatter.title ? frontMatter.title.length : 0;
      const descLength = frontMatter.description ? frontMatter.description.length : 0;
      const h2Count = (content.match(/^##\s/gm) || []).length;
      
      totalTitleLength += titleLength;
      totalDescLength += descLength;
      totalH2Count += h2Count;
      
      // キーワード密度分析
      if (frontMatter.tags) {
        frontMatter.tags.forEach(tag => {
          seoMetrics.keywordDensity[tag] = (seoMetrics.keywordDensity[tag] || 0) + 1;
        });
      }
      
      // SEOスコア計算
      const seoScore = this.calculateSEOScore(titleLength, descLength, h2Count, content);
      seoMetrics.seoScores.push({
        filename: post.filename,
        score: seoScore,
        titleLength,
        descLength,
        h2Count
      });
    }

    seoMetrics.avgTitleLength = Math.round(totalTitleLength / posts.length);
    seoMetrics.avgDescriptionLength = Math.round(totalDescLength / posts.length);
    seoMetrics.h2Count = totalH2Count;

    return seoMetrics;
  }

  /**
   * SEOスコア計算
   */
  calculateSEOScore(titleLength, descLength, h2Count, content) {
    let score = 50; // ベーススコア
    
    // タイトル長評価（30-60文字が理想）
    if (titleLength >= 30 && titleLength <= 60) {
      score += 20;
    } else if (titleLength >= 20 && titleLength <= 70) {
      score += 10;
    }
    
    // ディスクリプション長評価（120-150文字が理想）
    if (descLength >= 120 && descLength <= 150) {
      score += 15;
    } else if (descLength >= 100 && descLength <= 160) {
      score += 10;
    }
    
    // 見出し構造評価（3-4個のh2が理想）
    if (h2Count >= 3 && h2Count <= 4) {
      score += 10;
    } else if (h2Count >= 2) {
      score += 5;
    }
    
    // 内容の構造評価
    const hasIntro = content.includes('##') && content.indexOf('##') > 200; // リード文の存在
    const hasConclusion = content.includes('まとめ') || content.includes('結論');
    
    if (hasIntro) score += 5;
    if (hasConclusion) score += 5;
    
    return Math.min(100, Math.max(0, score));
  }

  /**
   * 週次レポート生成
   */
  async generateWeeklyReport(qualityReport, seoReport) {
    console.log('📋 週次レポート生成中...');
    
    const reportDate = new Date().toISOString().split('T')[0];
    const report = {
      date: reportDate,
      summary: {
        totalPosts: qualityReport.totalPosts,
        averageQualityScore: Math.round(qualityReport.qualityScores.reduce((sum, item) => sum + item.score, 0) / qualityReport.qualityScores.length),
        averageSEOScore: Math.round(seoReport.seoScores.reduce((sum, item) => sum + item.score, 0) / seoReport.seoScores.length),
        averageLength: qualityReport.averageLength,
        bulletPointRatio: qualityReport.bulletPointRatio
      },
      qualityMetrics: qualityReport,
      seoMetrics: seoReport,
      recommendations: this.generateRecommendations(qualityReport, seoReport)
    };

    const reportPath = path.join(this.logsDir, `weekly-report-${reportDate}.json`);
    await fs.mkdir(this.logsDir, { recursive: true });
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));

    // 簡易版テキストレポートも生成
    const textReport = this.generateTextReport(report);
    const textReportPath = path.join(this.logsDir, `weekly-report-${reportDate}.txt`);
    await fs.writeFile(textReportPath, textReport);

    console.log(`✅ 週次レポート生成完了: ${reportPath}`);
    return report;
  }

  /**
   * 改善提案生成
   */
  generateRecommendations(qualityReport, seoReport) {
    const recommendations = [];

    // 品質改善提案
    if (qualityReport.bulletPointRatio > 20) {
      recommendations.push({
        type: 'quality',
        priority: 'high',
        message: `箇条書きの比率が${qualityReport.bulletPointRatio}%と高めです。流れる文章を増やすことをお勧めします。`
      });
    }

    if (qualityReport.averageLength < 2500) {
      recommendations.push({
        type: 'quality',
        priority: 'medium',
        message: `平均文字数が${qualityReport.averageLength}文字と少なめです。2500-3000文字を目標にしてください。`
      });
    }

    // SEO改善提案
    if (seoReport.avgTitleLength < 30) {
      recommendations.push({
        type: 'seo',
        priority: 'medium',
        message: `タイトルの平均文字数が${seoReport.avgTitleLength}文字と短めです。30-60文字を目安にしてください。`
      });
    }

    if (seoReport.avgDescriptionLength < 120) {
      recommendations.push({
        type: 'seo',
        priority: 'medium',
        message: `メタディスクリプションが${seoReport.avgDescriptionLength}文字と短めです。120-150文字を目安にしてください。`
      });
    }

    return recommendations;
  }

  /**
   * テキストレポート生成
   */
  generateTextReport(report) {
    return `
📊 週次ブログレポート - ${report.date}
================================================

📈 サマリー
・総記事数: ${report.summary.totalPosts}件
・平均品質スコア: ${report.summary.averageQualityScore}/100
・平均SEOスコア: ${report.summary.averageSEOScore}/100
・平均文字数: ${report.summary.averageLength}文字
・箇条書き比率: ${report.summary.bulletPointRatio}%

🎯 品質メトリクス
・総画像数: ${report.qualityMetrics.imageCount}枚
・総内部リンク数: ${report.qualityMetrics.internalLinksCount}個

🔍 SEOメトリクス
・平均タイトル長: ${report.seoMetrics.avgTitleLength}文字
・平均ディスクリプション長: ${report.seoMetrics.avgDescriptionLength}文字
・総見出し数: ${report.seoMetrics.h2Count}個

💡 改善提案
${report.recommendations.map(r => `・[${r.priority.toUpperCase()}] ${r.message}`).join('\n')}

================================================
生成日時: ${new Date().toISOString()}
`;
  }

  /**
   * ヘルパーメソッド
   */
  
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
      console.warn('記事ディレクトリの読み取りに失敗:', error.message);
      return [];
    }
  }
  
  extractFrontMatter(content) {
    const match = content.match(/^---\n([\s\S]*?)\n---/);
    if (!match) return {};
    
    try {
      const yaml = require('js-yaml');
      return yaml.load(match[1]);
    } catch (error) {
      return {};
    }
  }
}

module.exports = WeeklyBlogMaintenance;

// CLI実行
if (require.main === module) {
  const maintenance = new WeeklyBlogMaintenance();
  
  maintenance.runWeeklyMaintenance()
    .then(result => {
      if (result.success) {
        console.log('✅ 週次メンテナンス完了');
        process.exit(0);
      } else {
        console.error(`❌ メンテナンス失敗: ${result.error}`);
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('❌ 予期しないエラー:', error);
      process.exit(1);
    });
}