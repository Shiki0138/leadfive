#!/usr/bin/env node

/**
 * 週間自動ブログ投稿スケジューラー v3.0
 * 7日間連続投稿システム（メール承認後）
 */

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');
require('dotenv').config();

// 設定
const CONFIG = {
  // 投稿スケジュール設定
  DAILY_POST_TIME: '09:00', // 毎日9時に投稿
  POSTS_DIR: path.join(__dirname, '../_posts'),
  SCHEDULE_FILE: path.join(__dirname, '../_data/weekly-schedule.json'),
  
  // 7日間の戦略的テーマ
  WEEKLY_THEMES: {
    1: {
      theme: 'AI戦略編',
      focus: 'デジタル変革と競合優位',
      keywords: ['AI戦略', 'デジタル変革', '競合優位', 'DX推進', 'AI導入']
    },
    2: {
      theme: '実践テクニック編',
      focus: 'すぐに使えるノウハウ',
      keywords: ['実装方法', 'ツール活用', 'ノウハウ', '実践ガイド', '設定方法']
    },
    3: {
      theme: 'データ分析編',
      focus: '数値で見る効果測定',
      keywords: ['データ分析', 'KPI設定', '成果測定', 'ROI', 'コンバージョン']
    },
    4: {
      theme: 'トレンド編',
      focus: '最新動向と未来予測',
      keywords: ['最新トレンド', '業界動向', '未来予測', '市場分析', '技術動向']
    },
    5: {
      theme: '事例研究編',
      focus: '実績データと成功パターン',
      keywords: ['成功事例', '実績分析', 'ケーススタディ', '導入事例', '効果検証']
    },
    6: {
      theme: '学習コンテンツ編',
      focus: '基礎から応用まで体系的学習',
      keywords: ['基礎理論', '入門ガイド', '初心者向け', '学習ロードマップ', '基本概念']
    },
    7: {
      theme: '総合戦略編',
      focus: '統合的アプローチと長期計画',
      keywords: ['統合戦略', '経営判断', '長期計画', '全体最適', '戦略立案']
    }
  },

  // 業界別キーワード強化版
  INDUSTRY_FOCUS: {
    '美容・ヘルスケア': ['美容室', 'エステサロン', 'ヘアサロン', '美容師', 'セラピスト', 'スパ'],
    'EC・小売': ['オンラインショップ', 'EC運営', '通販', 'ネットショップ', 'D2C', '小売業'],
    '不動産・建設': ['不動産仲介', '賃貸管理', '売買仲介', '建設業', '工務店', 'リフォーム'],
    '教育・研修': ['オンライン教育', '企業研修', '学習塾', 'eラーニング', 'スキルアップ'],
    'IT・テクノロジー': ['SaaS企業', 'ソフトウェア開発', 'アプリ開発', 'システム導入', 'IT支援'],
    'BtoB・製造業': ['製造業', 'BtoB企業', '法人営業', '産業機械', 'B2Bマーケティング']
  },

  // 8つの本能との連携
  PSYCHOLOGICAL_INSTINCTS: {
    1: 'survival', // 生存本能 - 危機感、安全性
    2: 'learning', // 学習本能 - 成長、スキルアップ  
    3: 'territorial', // 縄張り本能 - 競合優位、差別化
    4: 'reproduction', // 生殖本能 - 成功、成果
    5: 'hierarchy', // 階層本能 - ステータス、権威
    6: 'nurturing', // 養育本能 - サポート、育成
    7: 'communication', // 伝達本能 - 情報共有、ネットワーク
  }
};

class WeeklyBlogScheduler {
  constructor() {
    this.scheduleData = null;
    this.currentWeek = this.getCurrentWeekInfo();
  }

  // 現在の週情報を取得
  getCurrentWeekInfo() {
    const now = new Date();
    const year = now.getFullYear();
    const weekNumber = this.getWeekNumber(now);
    
    return {
      year,
      week: weekNumber,
      startDate: this.getWeekStartDate(now),
      endDate: this.getWeekEndDate(now)
    };
  }

  // 週番号を計算
  getWeekNumber(date) {
    const firstDay = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date - firstDay) / (24 * 60 * 60 * 1000));
    return Math.ceil((days + firstDay.getDay() + 1) / 7);
  }

  // 週の開始日（月曜日）
  getWeekStartDate(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }

  // 週の終了日（日曜日）
  getWeekEndDate(date) {
    const start = this.getWeekStartDate(date);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return end;
  }

  // 週間スケジュールを初期化（メール承認時）
  async initializeWeeklySchedule(approvalData) {
    console.log('🚀 週間ブログスケジュール初期化中...');
    
    const schedule = {
      weekInfo: this.currentWeek,
      approved: true,
      approvedAt: new Date().toISOString(),
      posts: []
    };

    // 7日分の記事を計画
    for (let day = 1; day <= 7; day++) {
      const postDate = new Date();
      postDate.setDate(postDate.getDate() + day); // 翌日から開始
      postDate.setHours(9, 0, 0, 0); // 9時投稿

      const dayTheme = CONFIG.WEEKLY_THEMES[day];
      const instinct = CONFIG.PSYCHOLOGICAL_INSTINCTS[day];

      const postPlan = {
        day: day,
        date: postDate.toISOString(),
        dateStr: this.formatDate(postDate),
        theme: dayTheme.theme,
        focus: dayTheme.focus,
        keywords: dayTheme.keywords,
        instinct: instinct,
        status: 'scheduled',
        generatedTitle: await this.generateDailyTitle(dayTheme, day),
        industry: this.selectRandomIndustry(),
        estimatedLength: '2500-4000文字',
        targetAudience: '企業の意思決定者・マーケティング責任者'
      };

      schedule.posts.push(postPlan);
    }

    // スケジュールを保存
    await this.saveSchedule(schedule);
    console.log('✅ 7日間のスケジュールを設定しました');
    
    return schedule;
  }

  // 日次記事タイトル生成
  async generateDailyTitle(dayTheme, dayNumber) {
    const titlePatterns = [
      `【${dayTheme.theme}】${dayTheme.keywords[0]}で売上3倍を実現する${Math.floor(Math.random() * 3) + 3}つの方法`,
      `${new Date().getFullYear()}年最新版：${dayTheme.keywords[1]}完全攻略ガイド`,
      `なぜ${dayTheme.keywords[0]}が注目されるのか？従来手法との決定的違い`,
      `${dayTheme.keywords[2]}導入でROI300%達成した企業の成功パターン`,
      `【実践編】${dayTheme.focus}を活用した${dayNumber}つのステップ`
    ];

    return titlePatterns[Math.floor(Math.random() * titlePatterns.length)];
  }

  // ランダム業界選択
  selectRandomIndustry() {
    const industries = Object.keys(CONFIG.INDUSTRY_FOCUS);
    return industries[Math.floor(Math.random() * industries.length)];
  }

  // 日付フォーマット
  formatDate(date) {
    const options = { 
      month: 'numeric', 
      day: 'numeric', 
      weekday: 'short' 
    };
    return date.toLocaleDateString('ja-JP', options);
  }

  // 毎日の自動実行（9時）
  async executeDailyPost() {
    console.log('📅 日次投稿チェック開始...');
    
    const schedule = await this.loadSchedule();
    if (!schedule || !schedule.approved) {
      console.log('📭 承認されたスケジュールがありません');
      return;
    }

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    // 今日投稿すべき記事を検索
    const todaysPost = schedule.posts.find(post => {
      const postDate = new Date(post.date);
      return postDate.toISOString().split('T')[0] === todayStr && 
             post.status === 'scheduled';
    });

    if (todaysPost) {
      console.log(`🎯 本日の記事を投稿: ${todaysPost.theme}`);
      
      try {
        // 記事生成実行
        await this.generateAndPublishPost(todaysPost);
        
        // ステータス更新
        todaysPost.status = 'published';
        todaysPost.publishedAt = new Date().toISOString();
        
        await this.saveSchedule(schedule);
        console.log(`✅ 投稿完了: ${todaysPost.generatedTitle}`);
        
      } catch (error) {
        console.error('❌ 投稿エラー:', error);
        todaysPost.status = 'error';
        todaysPost.error = error.message;
        await this.saveSchedule(schedule);
      }
    } else {
      console.log('📝 本日投稿予定の記事はありません');
    }
  }

  // 記事生成と投稿
  async generateAndPublishPost(postPlan) {
    const primaryKeyword = postPlan.keywords[0];
    const industryKeywords = CONFIG.INDUSTRY_FOCUS[postPlan.industry] || [];
    const combinedKeyword = `${primaryKeyword} ${industryKeywords[0] || ''}`.trim();

    console.log(`📝 記事生成中: ${combinedKeyword}`);

    // プレミアムブログエンジンを使用
    const command = `cd "${path.dirname(__dirname)}" && node scripts/blog-automation/claude-blog-generator.js "${combinedKeyword}"`;
    
    try {
      const output = execSync(command, { 
        encoding: 'utf8',
        env: {
          ...process.env,
          BLOG_THEME: postPlan.theme,
          BLOG_FOCUS: postPlan.focus,
          BLOG_INSTINCT: postPlan.instinct,
          CUSTOM_TITLE: postPlan.generatedTitle
        }
      });
      
      console.log('✅ ブログ生成完了:', output);
      return output;
      
    } catch (error) {
      console.error('❌ ブログ生成失敗:', error.message);
      throw error;
    }
  }

  // スケジュール保存
  async saveSchedule(schedule) {
    try {
      await fs.mkdir(path.dirname(CONFIG.SCHEDULE_FILE), { recursive: true });
      await fs.writeFile(CONFIG.SCHEDULE_FILE, JSON.stringify(schedule, null, 2));
    } catch (error) {
      console.error('スケジュール保存エラー:', error);
    }
  }

  // スケジュール読み込み
  async loadSchedule() {
    try {
      const data = await fs.readFile(CONFIG.SCHEDULE_FILE, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return null;
    }
  }

  // 週間スケジュール状況確認
  async getWeeklyStatus() {
    const schedule = await this.loadSchedule();
    if (!schedule) return { status: 'no_schedule' };

    const summary = {
      weekInfo: schedule.weekInfo,
      approved: schedule.approved,
      totalPosts: schedule.posts.length,
      published: schedule.posts.filter(p => p.status === 'published').length,
      scheduled: schedule.posts.filter(p => p.status === 'scheduled').length,
      errors: schedule.posts.filter(p => p.status === 'error').length,
      posts: schedule.posts
    };

    return summary;
  }

  // 緊急停止
  async emergencyStop() {
    console.log('🚨 緊急停止実行中...');
    
    const schedule = await this.loadSchedule();
    if (schedule) {
      schedule.approved = false;
      schedule.stoppedAt = new Date().toISOString();
      
      // 未投稿の記事をキャンセル
      schedule.posts.forEach(post => {
        if (post.status === 'scheduled') {
          post.status = 'cancelled';
        }
      });
      
      await this.saveSchedule(schedule);
      console.log('⏹️ スケジュールを停止しました');
    }
  }
}

// CLI実行
if (require.main === module) {
  const scheduler = new WeeklyBlogScheduler();
  const command = process.argv[2];

  switch (command) {
    case 'init':
      // メール承認後の初期化
      scheduler.initializeWeeklySchedule({}).then(() => {
        console.log('✅ 週間スケジュール初期化完了');
      });
      break;
      
    case 'daily':
      // 毎日の投稿実行
      scheduler.executeDailyPost().then(() => {
        console.log('✅ 日次処理完了');
      });
      break;
      
    case 'status':
      // 現在の状況確認
      scheduler.getWeeklyStatus().then(status => {
        console.log('📊 週間スケジュール状況:');
        console.log(JSON.stringify(status, null, 2));
      });
      break;
      
    case 'stop':
      // 緊急停止
      scheduler.emergencyStop().then(() => {
        console.log('⏹️ スケジュール停止完了');
      });
      break;
      
    default:
      console.log(`
使用方法:
  node weekly-blog-scheduler.js init     # スケジュール初期化
  node weekly-blog-scheduler.js daily    # 日次投稿実行
  node weekly-blog-scheduler.js status   # 状況確認  
  node weekly-blog-scheduler.js stop     # 緊急停止
      `);
  }
}

module.exports = WeeklyBlogScheduler;