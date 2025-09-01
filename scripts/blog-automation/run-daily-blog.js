#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const ClaudeBlogGenerator = require('./claude-blog-generator');

async function runDailyBlog() {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`ブログ自動投稿開始: ${new Date().toISOString()}`);
  console.log('='.repeat(60));

  try {
    // 週間スケジュールを読み込み
    const scheduleFile = path.join(__dirname, '../../_data/weekly-schedule.json');
    const scheduleData = await fs.readFile(scheduleFile, 'utf-8');
    const schedule = JSON.parse(scheduleData);

    // 自動投稿が有効かチェック
    if (!schedule.settings.auto_post_enabled) {
      console.log('⚠️ 自動投稿が無効になっています');
      return;
    }

    // 緊急停止フラグをチェック
    if (schedule.settings.emergency_stop) {
      console.log('🛑 緊急停止フラグが設定されています');
      return;
    }

    // 今日の日付を取得（JST）
    const now = new Date();
    const jstOffset = 9 * 60; // JST is UTC+9
    const jstDate = new Date(now.getTime() + (jstOffset - now.getTimezoneOffset()) * 60000);
    const today = jstDate.toISOString().split('T')[0];

    console.log(`今日の日付: ${today}`);

    // 今日の投稿を探す
    const todayPost = schedule.schedule.find(post => {
      const postDate = post.date;
      return postDate === today && post.status === 'pending';
    });

    if (!todayPost) {
      console.log('📅 今日の投稿予定はありません');
      
      // 過去の未投稿を探す
      const pendingPosts = schedule.schedule.filter(post => 
        post.status === 'pending' && post.date < today
      );
      
      if (pendingPosts.length > 0) {
        console.log(`⚠️ 未投稿の記事が${pendingPosts.length}件あります`);
        const oldestPending = pendingPosts[0];
        console.log(`最も古い未投稿: ${oldestPending.date} - ${oldestPending.title}`);
        
        // 最も古い未投稿を処理
        await processPost(oldestPending, schedule, scheduleFile);
      }
      
      return;
    }

    // 投稿を処理
    await processPost(todayPost, schedule, scheduleFile);

  } catch (error) {
    console.error('❌ エラー発生:', error.message);
    console.error(error.stack);
    
    // エラーログを記録
    await logError(error);
  }
}

async function processPost(post, schedule, scheduleFile) {
  console.log(`\n📝 投稿処理開始: ${post.title}`);
  console.log(`テーマ: ${post.theme}`);
  console.log(`キーワード: ${post.keywords.join(', ')}`);

  // 環境変数チェック
  if (!process.env.ANTHROPIC_API_KEY) {
    // .envファイルから読み込みを試みる
    try {
      const dotenv = require('dotenv');
      dotenv.config({ path: path.join(__dirname, '../../.env') });
    } catch (e) {
      console.error('❌ ANTHROPIC_API_KEY環境変数が設定されていません');
      console.error('dotenvの読み込みエラー:', e.message);
      return;
    }
    
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('❌ ANTHROPIC_API_KEY環境変数が設定されていません');
      console.error('.envファイルを作成し、APIキーを設定してください');
      return;
    }
  }

  // ブログ生成器を初期化
  const generator = new ClaudeBlogGenerator({
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    keyword: post.keywords[0], // メインキーワードを使用
    targetLength: 3000,
    category: post.theme,
    customTitle: post.title,
    unsplashApiKey: process.env.UNSPLASH_API_KEY
  });

  // ブログ記事を生成
  const result = await generator.generateBlogPost();

  if (result.success) {
    console.log(`✅ 投稿成功: ${result.title}`);
    console.log(`ファイル: ${result.filename}`);
    
    // スケジュールを更新
    const postIndex = schedule.schedule.findIndex(p => p.day === post.day);
    if (postIndex !== -1) {
      schedule.schedule[postIndex].status = 'completed';
      schedule.schedule[postIndex].generated_at = new Date().toISOString();
      schedule.schedule[postIndex].filename = result.filename;
      
      // 残り投稿数を更新
      const remaining = schedule.schedule.filter(p => p.status === 'pending').length;
      schedule.posts_remaining = remaining;
      
      // スケジュールファイルを更新
      await fs.writeFile(scheduleFile, JSON.stringify(schedule, null, 2));
      console.log(`📊 残り投稿数: ${remaining}`);
    }
    
    // 成功ログを記録
    await logSuccess(result);
    
    // GitHubへの自動コミット（環境変数で制御）
    if (process.env.AUTO_GIT_COMMIT === 'true') {
      console.log('\n🔄 GitHubへの自動コミットを実行...');
      const { exec } = require('child_process');
      const scriptPath = path.join(__dirname, 'auto-commit-push.sh');
      
      exec(`${scriptPath} ${process.env.AUTO_GIT_PUSH === 'true' ? '--push' : ''}`, (error, stdout, stderr) => {
        if (error) {
          console.error('Git操作エラー:', error);
        } else {
          console.log(stdout);
        }
      });
    }
    
  } else {
    console.error(`❌ 投稿失敗: ${result.error}`);
    
    // エラーログを記録
    await logError(new Error(result.error), post);
  }
}

async function logSuccess(result) {
  const logDir = path.join(__dirname, '../../logs');
  await fs.mkdir(logDir, { recursive: true });
  
  const logFile = path.join(logDir, 'blog-success.log');
  const logEntry = `${new Date().toISOString()} - SUCCESS - ${result.title} - ${result.filename}\n`;
  
  await fs.appendFile(logFile, logEntry);
}

async function logError(error, post = null) {
  const logDir = path.join(__dirname, '../../logs');
  await fs.mkdir(logDir, { recursive: true });
  
  const logFile = path.join(logDir, 'blog-error.log');
  const logEntry = `${new Date().toISOString()} - ERROR - ${post ? post.title : 'Unknown'} - ${error.message}\n${error.stack}\n---\n`;
  
  await fs.appendFile(logFile, logEntry);
}

// メイン実行
if (require.main === module) {
  runDailyBlog()
    .then(() => {
      console.log('\n✅ 処理完了');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n❌ 予期しないエラー:', error);
      process.exit(1);
    });
}

module.exports = runDailyBlog;