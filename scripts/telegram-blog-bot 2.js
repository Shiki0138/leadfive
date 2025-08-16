const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const cron = require('node-cron');

// 環境変数から設定を読み込み
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER || 'YOUR_USERNAME';
const GITHUB_REPO = process.env.GITHUB_REPO || 'leadfive-demo';

// Telegram Bot を初期化
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

// 質問リスト
const morningQuestions = [
  {
    day: 'monday',
    question: '🚀 月曜日の朝です！今週注目のAIマーケティングトレンドは何ですか？',
    followUp: '具体的な活用方法も教えてください。'
  },
  {
    day: 'tuesday',
    question: '🧠 火曜日です！人間の購買心理について新しい発見はありましたか？',
    followUp: '8つの本能のどれに関連していますか？'
  },
  {
    day: 'wednesday',
    question: '📊 水曜日です！最近のデータ分析で面白い傾向は見つかりましたか？',
    followUp: '数値やグラフがあれば共有してください。'
  },
  {
    day: 'thursday',
    question: '💡 木曜日です！競合他社の施策で参考になるものはありましたか？',
    followUp: 'どう改善すればもっと良くなると思いますか？'
  },
  {
    day: 'friday',
    question: '🎯 金曜日です！今週の成果や学びをまとめて共有してください！',
    followUp: '来週に活かせるポイントは何ですか？'
  },
  {
    day: 'saturday',
    question: '📚 土曜日です！最近読んだマーケティング関連の本や記事でおすすめは？',
    followUp: 'LeadFiveの顧客にどう活用できそうですか？'
  },
  {
    day: 'sunday',
    question: '🌟 日曜日です！来週試してみたい新しいマーケティング手法はありますか？',
    followUp: '期待される効果も教えてください。'
  }
];

// 会話の状態を管理
const conversationState = new Map();

// 毎朝7時に質問を送信（日本時間）
cron.schedule('0 7 * * *', () => {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const today = days[new Date().getDay()];
  const todayQuestion = morningQuestions.find(q => q.day === today);
  
  bot.sendMessage(TELEGRAM_CHAT_ID, todayQuestion.question, {
    reply_markup: {
      inline_keyboard: [[
        { text: '⏭️ 今日はスキップ', callback_data: 'skip_today' }
      ]]
    }
  });
  
  // 会話状態を初期化
  conversationState.set(TELEGRAM_CHAT_ID, {
    stage: 'waiting_for_topic',
    question: todayQuestion
  });
});

// メッセージ受信処理
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const messageText = msg.text;
  
  // 管理者のみ応答
  if (chatId.toString() !== TELEGRAM_CHAT_ID) {
    return;
  }
  
  const state = conversationState.get(chatId);
  
  if (!state) {
    // 通常のコマンド処理
    if (messageText === '/start') {
      bot.sendMessage(chatId, 
        '👋 LeadFive ブログボットへようこそ！\n\n' +
        '毎朝7時に質問をお送りします。\n' +
        '返信いただくと自動的にブログ記事が作成されます。\n\n' +
        'コマンド:\n' +
        '/post - 今すぐブログを投稿\n' +
        '/ideas - ブログアイデアを見る\n' +
        '/stats - 投稿統計を確認'
      );
    } else if (messageText === '/post') {
      bot.sendMessage(chatId, '📝 ブログトピックを教えてください：');
      conversationState.set(chatId, {
        stage: 'waiting_for_topic',
        question: { question: 'カスタム投稿', followUp: '詳細を教えてください。' }
      });
    }
    return;
  }
  
  // 会話フローの処理
  if (state.stage === 'waiting_for_topic') {
    // フォローアップ質問を送信
    bot.sendMessage(chatId, `いいトピックですね！\n\n${state.question.followUp}`);
    
    conversationState.set(chatId, {
      ...state,
      stage: 'waiting_for_details',
      topic: messageText
    });
    
  } else if (state.stage === 'waiting_for_details') {
    const fullTopic = `${state.topic}\n\n詳細：${messageText}`;
    
    // GitHub Actions をトリガー
    try {
      await triggerGitHubAction(fullTopic);
      
      bot.sendMessage(chatId, 
        '✅ ブログ記事の作成を開始しました！\n\n' +
        '📄 トピック: ' + state.topic + '\n' +
        '⏱️ 予想時間: 約10-15分\n\n' +
        '完成したらお知らせします。',
        {
          reply_markup: {
            inline_keyboard: [[
              { text: '📊 進捗を確認', callback_data: 'check_progress' }
            ]]
          }
        }
      );
      
      // 会話状態をクリア
      conversationState.delete(chatId);
      
    } catch (error) {
      console.error('Error triggering GitHub Action:', error);
      bot.sendMessage(chatId, '❌ エラーが発生しました。もう一度お試しください。');
    }
  }
});

// コールバッククエリの処理
bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;
  
  if (query.data === 'skip_today') {
    bot.answerCallbackQuery(query.id, { text: '今日はスキップしました' });
    bot.sendMessage(chatId, 'わかりました。また明日お聞きしますね！ 😊');
    conversationState.delete(chatId);
  } else if (query.data === 'check_progress') {
    bot.answerCallbackQuery(query.id, { text: '確認中...' });
    // 実際のGitHub Actions の状態を確認する処理を追加可能
    bot.sendMessage(chatId, '🔄 記事作成中... もう少しお待ちください。');
  }
});

// GitHub Actions をトリガーする関数
async function triggerGitHubAction(topic) {
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/dispatches`;
  
  const data = {
    event_type: 'blog-post-from-telegram',
    client_payload: {
      topic: topic,
      timestamp: new Date().toISOString()
    }
  };
  
  const response = await axios.post(url, data, {
    headers: {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    }
  });
  
  return response.data;
}

// その他の便利なコマンド
bot.onText(/\/ideas/, (msg) => {
  const chatId = msg.chat.id;
  
  const ideas = [
    '🎯 LP最適化の心理学的アプローチ：色彩が購買行動に与える影響',
    '🤖 ChatGPT vs Claude：マーケティング活用での使い分け方',
    '📊 8つの本能を活用したA/Bテスト設計法',
    '💡 競合分析をAIで自動化する5つのステップ',
    '🚀 スタートアップのための低予算AIマーケティング戦略',
    '🧠 認知バイアスを味方につけるコンテンツマーケティング',
    '📈 データドリブンな意思決定：KPI設定の落とし穴',
    '🎨 ビジュアルマーケティング：本能に訴える画像選択術'
  ];
  
  const randomIdeas = ideas.sort(() => 0.5 - Math.random()).slice(0, 3);
  
  bot.sendMessage(chatId, 
    '💡 ブログアイデア:\n\n' +
    randomIdeas.map((idea, i) => `${i + 1}. ${idea}`).join('\n\n')
  );
});

// エラーハンドリング
bot.on('polling_error', (error) => {
  console.error('Polling error:', error);
});

console.log('🤖 LeadFive Blog Bot is running...');