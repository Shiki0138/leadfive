#!/usr/bin/env node

/**
 * AI自動ブログ投稿スケジューラー
 * 毎日指定時間にブログ記事を自動生成・投稿するシステム
 */

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');
require('dotenv').config();

// 設定
const CONFIG = {
  // 投稿スケジュール設定
  DAILY_POST_TIME: '09:00', // 毎日9時に投稿
  KEYWORDS_FILE: path.join(__dirname, '../_data/auto-keywords.yml'),
  POSTS_DIR: path.join(__dirname, '../_posts'),
  
  // キーワード戦略
  TARGET_KEYWORDS: [
    'AI マーケティング',
    '心理学 マーケティング',
    'CVR 改善',
    '顧客分析 AI',
    '売上 向上',
    'LP 最適化',
    'チャットボット 導入',
    '顧客心理 分析',
    'デジタルマーケティング AI',
    '行動経済学 マーケティング'
  ],
  
  // 業界別キーワード
  INDUSTRY_KEYWORDS: {
    '美容': ['美容室', 'サロン', 'エステ', 'ヘアサロン', '美容師'],
    'EC': ['オンラインショップ', 'EC', '通販', 'ネットショップ'],
    '不動産': ['不動産', '賃貸', '売買', '仲介', '物件'],
    '教育': ['スクール', '塾', '教育', 'オンライン学習'],
    'IT': ['SaaS', 'ソフトウェア', 'アプリ', 'システム']
  },
  
  // 記事タイプ
  ARTICLE_TYPES: [
    'case_study', // 成功事例
    'how_to', // ハウツー
    'trend', // トレンド分析
    'comparison', // 比較記事
    'guide' // ガイド記事
  ]
};

// カラー出力
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

const log = (message, color = 'reset') => {
  console.log(`${colors[color]}[${new Date().toISOString()}] ${message}${colors.reset}`);
};

/**
 * 今日のキーワードを選択
 */
async function selectTodaysKeyword() {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0=日曜, 1=月曜, ...
  
  // 曜日別キーワード戦略
  const weeklyStrategy = {
    0: 'trend', // 日曜: トレンド記事
    1: 'case_study', // 月曜: 成功事例
    2: 'how_to', // 火曜: ハウツー
    3: 'comparison', // 水曜: 比較記事
    4: 'guide', // 木曜: ガイド記事
    5: 'case_study', // 金曜: 成功事例
    6: 'trend' // 土曜: トレンド記事
  };
  
  const articleType = weeklyStrategy[dayOfWeek];
  const baseKeyword = CONFIG.TARGET_KEYWORDS[dayOfWeek % CONFIG.TARGET_KEYWORDS.length];
  
  // 業界をランダム選択
  const industries = Object.keys(CONFIG.INDUSTRY_KEYWORDS);
  const selectedIndustry = industries[Math.floor(Math.random() * industries.length)];
  const industryKeyword = CONFIG.INDUSTRY_KEYWORDS[selectedIndustry][
    Math.floor(Math.random() * CONFIG.INDUSTRY_KEYWORDS[selectedIndustry].length)
  ];
  
  return {
    type: articleType,
    baseKeyword,
    industry: selectedIndustry,
    industryKeyword,
    combinedKeyword: `${baseKeyword} ${industryKeyword}`
  };
}

/**
 * 記事タイトル生成
 */
function generateTitle(keywordData) {
  const { type, baseKeyword, industryKeyword, industry } = keywordData;
  
  const titleTemplates = {
    case_study: [
      `【成功事例】${industryKeyword}で売上が3倍に！${baseKeyword}の効果的な活用法`,
      `【実例公開】${industry}業界で${baseKeyword}導入により売上267%向上を達成`,
      `${industryKeyword}経営者必見！${baseKeyword}で実現した劇的な売上改善事例`
    ],
    how_to: [
      `【完全ガイド】${industryKeyword}のための${baseKeyword}導入ステップ`,
      `${industry}業界向け：${baseKeyword}で売上を伸ばす5つの方法`,
      `初心者でもわかる！${industryKeyword}での${baseKeyword}活用術`
    ],
    trend: [
      `2025年注目！${industry}業界の${baseKeyword}最新トレンド`,
      `${industryKeyword}業界に革命！${baseKeyword}の最新動向と未来予測`,
      `今話題の${baseKeyword}、${industry}業界への影響と活用ポイント`
    ],
    comparison: [
      `${industry}向け${baseKeyword}ツール比較！最適な選択肢は？`,
      `従来手法vs${baseKeyword}：${industryKeyword}にとって本当に効果的なのは？`,
      `${baseKeyword}導入前後で何が変わる？${industry}業界の比較分析`
    ],
    guide: [
      `${industryKeyword}経営者のための${baseKeyword}完全マニュアル`,
      `ゼロから始める${baseKeyword}：${industry}業界特化版`,
      `${industryKeyword}で成果を出すための${baseKeyword}実践ガイド`
    ]
  };
  
  const templates = titleTemplates[type];
  return templates[Math.floor(Math.random() * templates.length)];
}

/**
 * ブログ記事自動生成
 */
async function generateBlogPost(keywordData) {
  const title = generateTitle(keywordData);
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0];
  const filename = `${dateStr}-${title.replace(/[【】！？：・\s]/g, '-').toLowerCase().substring(0, 50)}.md`;
  
  // SERP分析ツールを使用して記事生成
  try {
    log(`記事生成開始: ${title}`, 'blue');
    
    const blogCreatorPath = path.join(__dirname, '../serp-blog-creator.js');
    const generateCommand = `node "${blogCreatorPath}" --auto --keyword="${keywordData.combinedKeyword}" --title="${title}"`;
    
    execSync(generateCommand, { 
      stdio: 'inherit',
      cwd: path.dirname(blogCreatorPath)
    });
    
    log(`記事生成完了: ${filename}`, 'green');
    return { success: true, filename, title };
    
  } catch (error) {
    log(`記事生成エラー: ${error.message}`, 'red');
    return { success: false, error: error.message };
  }
}

/**
 * Jekyll再ビルド
 */
async function rebuildSite() {
  try {
    log('サイト再ビルド開始', 'yellow');
    
    const buildCommand = 'bundle exec jekyll build';
    execSync(buildCommand, { 
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    });
    
    log('サイト再ビルド完了', 'green');
    return true;
    
  } catch (error) {
    log(`サイトビルドエラー: ${error.message}`, 'red');
    return false;
  }
}

/**
 * 投稿実績をログに記録
 */
async function logPostingActivity(keywordData, result) {
  const logData = {
    date: new Date().toISOString(),
    keyword: keywordData.combinedKeyword,
    industry: keywordData.industry,
    articleType: keywordData.type,
    success: result.success,
    filename: result.filename || null,
    title: result.title || null,
    error: result.error || null
  };
  
  const logFile = path.join(__dirname, '../logs/auto-posting.json');
  
  try {
    // ログディレクトリ作成
    await fs.mkdir(path.dirname(logFile), { recursive: true });
    
    // 既存ログ読み込み
    let logs = [];
    try {
      const existingLogs = await fs.readFile(logFile, 'utf8');
      logs = JSON.parse(existingLogs);
    } catch (e) {
      // ファイルが存在しない場合は新規作成
    }
    
    logs.push(logData);
    
    // 最新100件のみ保持
    if (logs.length > 100) {
      logs = logs.slice(-100);
    }
    
    await fs.writeFile(logFile, JSON.stringify(logs, null, 2));
    
  } catch (error) {
    log(`ログ記録エラー: ${error.message}`, 'red');
  }
}

/**
 * メイン実行関数
 */
async function main() {
  log('AI自動ブログ投稿システム開始', 'cyan');
  
  try {
    // 1. 今日のキーワード選択
    const keywordData = await selectTodaysKeyword();
    log(`選択キーワード: ${keywordData.combinedKeyword} (${keywordData.type})`, 'blue');
    
    // 2. ブログ記事生成
    const generateResult = await generateBlogPost(keywordData);
    
    // 3. 成功時はサイト再ビルド
    if (generateResult.success) {
      await rebuildSite();
    }
    
    // 4. 実績ログ記録
    await logPostingActivity(keywordData, generateResult);
    
    // 5. 結果表示
    if (generateResult.success) {
      log(`✅ 自動投稿完了: ${generateResult.title}`, 'green');
    } else {
      log(`❌ 自動投稿失敗: ${generateResult.error}`, 'red');
    }
    
  } catch (error) {
    log(`システムエラー: ${error.message}`, 'red');
    process.exit(1);
  }
}

// スケジュール実行またはコマンドライン実行
if (require.main === module) {
  // コマンドライン引数チェック
  const args = process.argv.slice(2);
  
  if (args.includes('--schedule')) {
    // cron等での定期実行用
    main();
  } else if (args.includes('--test')) {
    // テスト実行
    log('テストモードで実行中...', 'yellow');
    main();
  } else {
    // 対話モード
    console.log(`
AI自動ブログ投稿スケジューラー

使用方法:
  node auto-blog-scheduler.js --schedule  # 本番投稿実行
  node auto-blog-scheduler.js --test     # テスト実行
  
設定されているキーワード戦略:
  - 基本キーワード: ${CONFIG.TARGET_KEYWORDS.length}個
  - 業界別キーワード: ${Object.keys(CONFIG.INDUSTRY_KEYWORDS).length}業界
  - 記事タイプ: ${CONFIG.ARTICLE_TYPES.length}タイプ
    `);
  }
}

module.exports = { main, CONFIG };