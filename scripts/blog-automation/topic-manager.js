#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const yaml = require('js-yaml');

class TopicManager {
  constructor() {
    this.dataDir = path.join(__dirname, '../../_data/blog');
    this.logsDir = path.join(__dirname, '../../logs');
    this.topicsFile = path.join(this.dataDir, 'topics-database.yml');
    this.analyticsFile = path.join(this.logsDir, 'topic-analytics.json');
  }

  async initializeTopicsDatabase() {
    const topicsDatabase = {
      categories: {
        'ai-marketing': {
          name: 'AIマーケティング',
          description: 'AI技術を活用したマーケティング戦略と実践',
          topics: [
            {
              id: 'ai-personalization',
              name: 'AIパーソナライゼーション',
              keywords: ['AI', 'パーソナライゼーション', '顧客体験', 'CX'],
              subtopics: [
                'レコメンデーションエンジン',
                'ダイナミックコンテンツ',
                'プレディクティブアナリティクス'
              ],
              related_topics: ['customer-journey', 'data-analytics']
            },
            {
              id: 'conversational-ai',
              name: '対話型AI',
              keywords: ['チャットボット', '音声アシスタント', 'NLP'],
              subtopics: [
                'カスタマーサポート自動化',
                'リードクオリフィケーション',
                'FAQボット構築'
              ],
              related_topics: ['customer-service', 'automation']
            }
          ]
        },
        'consumer-psychology': {
          name: '消費者心理',
          description: '8つの本能を活用した消費者行動の理解と活用',
          topics: [
            {
              id: 'eight-instincts',
              name: '8つの本能活用法',
              keywords: ['8つの本能', '消費者心理', '行動心理学'],
              subtopics: [
                '生存本能とリスク回避',
                '階層本能とステータス',
                '学習本能と情報収集'
              ],
              related_topics: ['behavioral-economics', 'neuromarketing']
            }
          ]
        },
        'industry-specific': {
          name: '業界別ソリューション',
          description: '各業界に特化したAI活用事例と戦略',
          topics: [
            {
              id: 'beauty-industry',
              name: '美容業界',
              keywords: ['美容室', 'サロン', 'エステ', '美容師'],
              subtopics: [
                '予約管理の自動化',
                'カウンセリングAI',
                'SNSマーケティング'
              ],
              related_topics: ['customer-retention', 'local-seo']
            },
            {
              id: 'real-estate',
              name: '不動産業界',
              keywords: ['不動産', '物件', '賃貸', '売買'],
              subtopics: [
                'AI物件マッチング',
                'バーチャル内覧',
                '価格査定AI'
              ],
              related_topics: ['proptech', 'customer-experience']
            }
          ]
        }
      },
      
      trending_topics: {
        hot: [
          { name: '生成AI活用', score: 95, trend: 'rising' },
          { name: 'プロンプトエンジニアリング', score: 88, trend: 'rising' },
          { name: 'AIエージェント', score: 82, trend: 'stable' }
        ],
        emerging: [
          { name: 'マルチモーダルAI', score: 75, trend: 'rising' },
          { name: 'AIガバナンス', score: 70, trend: 'rising' },
          { name: 'エッジAI', score: 65, trend: 'stable' }
        ]
      },
      
      seasonal_topics: {
        q1: ['年間計画', '新規事業', 'DX推進'],
        q2: ['効率化', '生産性向上', 'チーム強化'],
        q3: ['データ分析', '戦略見直し', 'スケール'],
        q4: ['年末商戦', '予算計画', '来年展望']
      }
    };
    
    await fs.mkdir(this.dataDir, { recursive: true });
    await fs.writeFile(
      this.topicsFile,
      yaml.dump(topicsDatabase, { flowLevel: 3 }),
      'utf-8'
    );
    
    console.log('✅ トピックデータベースを初期化しました');
  }

  async getRecommendedTopic(context = {}) {
    const { 
      recentTopics = [],
      targetAudience = 'general',
      preferredCategory = null,
      date = new Date()
    } = context;
    
    // トピックデータベースを読み込み
    const topicsData = yaml.load(await fs.readFile(this.topicsFile, 'utf-8'));
    
    // 季節性を考慮
    const quarter = Math.floor(date.getMonth() / 3) + 1;
    const seasonalTopics = topicsData.seasonal_topics[`q${quarter}`];
    
    // トレンドトピックを取得
    const trendingTopics = [
      ...topicsData.trending_topics.hot,
      ...topicsData.trending_topics.emerging
    ].filter(t => t.trend === 'rising');
    
    // カテゴリ別トピックを収集
    let candidateTopics = [];
    
    for (const [categoryId, category] of Object.entries(topicsData.categories)) {
      if (preferredCategory && categoryId !== preferredCategory) continue;
      
      for (const topic of category.topics) {
        candidateTopics.push({
          ...topic,
          category: categoryId,
          categoryName: category.name,
          score: this.calculateTopicScore(topic, recentTopics, trendingTopics)
        });
      }
    }
    
    // スコアでソート
    candidateTopics.sort((a, b) => b.score - a.score);
    
    // 最近使用したトピックを除外
    const filteredTopics = candidateTopics.filter(
      topic => !recentTopics.some(recent => recent.id === topic.id)
    );
    
    return filteredTopics[0] || candidateTopics[0];
  }

  calculateTopicScore(topic, recentTopics, trendingTopics) {
    let score = 50; // ベーススコア
    
    // トレンドボーナス
    const trendMatch = trendingTopics.find(t => 
      topic.keywords.some(k => t.name.includes(k))
    );
    if (trendMatch) {
      score += trendMatch.score * 0.3;
    }
    
    // 多様性ボーナス
    const recentCategories = recentTopics.map(t => t.category);
    if (!recentCategories.includes(topic.category)) {
      score += 20;
    }
    
    // サブトピックの豊富さ
    score += topic.subtopics.length * 5;
    
    // 関連トピックの多さ
    score += topic.related_topics.length * 3;
    
    return score;
  }

  async recordTopicUsage(topicId, performance = {}) {
    await fs.mkdir(this.logsDir, { recursive: true });
    
    let analytics = { topics: {} };
    try {
      const existing = await fs.readFile(this.analyticsFile, 'utf-8');
      analytics = JSON.parse(existing);
    } catch (error) {
      // ファイルが存在しない場合は初期値を使用
    }
    
    if (!analytics.topics[topicId]) {
      analytics.topics[topicId] = {
        usageCount: 0,
        lastUsed: null,
        performance: {
          totalViews: 0,
          totalEngagement: 0,
          averageReadTime: 0
        }
      };
    }
    
    const topicAnalytics = analytics.topics[topicId];
    topicAnalytics.usageCount++;
    topicAnalytics.lastUsed = new Date().toISOString();
    
    if (performance.views) {
      topicAnalytics.performance.totalViews += performance.views;
    }
    if (performance.engagement) {
      topicAnalytics.performance.totalEngagement += performance.engagement;
    }
    if (performance.readTime) {
      const prevAvg = topicAnalytics.performance.averageReadTime;
      const count = topicAnalytics.usageCount;
      topicAnalytics.performance.averageReadTime = 
        (prevAvg * (count - 1) + performance.readTime) / count;
    }
    
    await fs.writeFile(
      this.analyticsFile,
      JSON.stringify(analytics, null, 2),
      'utf-8'
    );
  }

  async generateTopicVariations(baseKeyword) {
    const variations = [];
    
    // 基本的なバリエーションパターン
    const patterns = [
      `${baseKeyword} 完全ガイド`,
      `${baseKeyword} 実践方法`,
      `${baseKeyword} 成功事例`,
      `${baseKeyword} よくある失敗`,
      `${baseKeyword} 最新トレンド`,
      `${baseKeyword} vs 従来手法`,
      `なぜ${baseKeyword}が重要なのか`,
      `${baseKeyword}で成果を出す方法`,
      `${baseKeyword} 導入ステップ`,
      `${baseKeyword} ROI計算方法`
    ];
    
    // 業界別バリエーション
    const industries = ['中小企業', 'スタートアップ', 'EC', 'BtoB', 'サービス業'];
    industries.forEach(industry => {
      variations.push(`${industry}向け ${baseKeyword}`);
    });
    
    // 時期的バリエーション
    variations.push(
      `2025年版 ${baseKeyword}`,
      `${baseKeyword} 最新動向`,
      `${baseKeyword} 未来予測`
    );
    
    return [...patterns, ...variations];
  }

  async exportTopicReport() {
    const analytics = JSON.parse(
      await fs.readFile(this.analyticsFile, 'utf-8')
    );
    
    const report = {
      generatedAt: new Date().toISOString(),
      summary: {
        totalTopicsUsed: Object.keys(analytics.topics).length,
        totalArticlesGenerated: Object.values(analytics.topics)
          .reduce((sum, t) => sum + t.usageCount, 0)
      },
      topPerformers: [],
      recommendations: []
    };
    
    // パフォーマンス順にソート
    const sortedTopics = Object.entries(analytics.topics)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => 
        b.performance.totalEngagement - a.performance.totalEngagement
      );
    
    report.topPerformers = sortedTopics.slice(0, 10);
    
    // 推奨事項を生成
    if (sortedTopics.length > 0) {
      const avgEngagement = sortedTopics.reduce(
        (sum, t) => sum + t.performance.totalEngagement, 0
      ) / sortedTopics.length;
      
      report.recommendations.push({
        type: 'focus',
        message: `エンゲージメント平均${avgEngagement.toFixed(0)}以上のトピックに注力`
      });
    }
    
    return report;
  }
}

// CLI実行
if (require.main === module) {
  const manager = new TopicManager();
  const command = process.argv[2];
  
  switch (command) {
    case 'init':
      manager.initializeTopicsDatabase();
      break;
      
    case 'recommend':
      manager.getRecommendedTopic().then(topic => {
        console.log('推奨トピック:', topic);
      });
      break;
      
    case 'report':
      manager.exportTopicReport().then(report => {
        console.log(JSON.stringify(report, null, 2));
      });
      break;
      
    default:
      console.log('使用方法:');
      console.log('  node topic-manager.js init      - データベース初期化');
      console.log('  node topic-manager.js recommend - トピック推奨');
      console.log('  node topic-manager.js report    - レポート出力');
  }
}

module.exports = TopicManager;