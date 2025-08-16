const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const cron = require('node-cron');
const Anthropic = require('@anthropic-ai/sdk');

// 環境変数から設定を読み込み
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER || 'YOUR_USERNAME';
const GITHUB_REPO = process.env.GITHUB_REPO || 'leadfive-demo';
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

// Telegram Bot と Anthropic を初期化
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });
const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

// 提案の状態を管理
const proposalState = new Map();

// 毎朝7時に提案を生成して送信
cron.schedule('0 7 * * *', async () => {
  console.log('Generating morning proposals...');
  await generateAndSendProposals();
});

// トレンドとコンテキストを分析して提案を生成
async function generateProposals() {
  const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'][new Date().getDay()];
  const month = new Date().getMonth() + 1;
  const date = new Date().getDate();
  
  const prompt = `
あなたはLeadFiveのコンテンツストラテジストです。
今日は${month}月${date}日（${dayOfWeek}曜日）です。

以下の条件でブログ記事の提案を5つ作成してください：

1. 現在のトレンド：
   - 生成AI（ChatGPT, Claude, Gemini）の最新動向
   - マーケティング業界の課題と解決策
   - 日本市場特有のニーズ

2. LeadFiveの強み：
   - AI×心理学のユニークなアプローチ
   - 8つの本能理論
   - 実践的な成果

3. 曜日別のテーマ：
   - 月曜：週始めのモチベーション・新しい挑戦
   - 火曜：実践的なテクニック・How to
   - 水曜：データ分析・事例研究
   - 木曜：トレンド分析・競合研究
   - 金曜：週末に向けた学習コンテンツ
   - 土日：深い洞察・戦略的思考

各提案には以下を含めてください：
- タイトル（25-35文字）
- 一言説明（50文字程度）
- 想定読者
- 期待効果
- 緊急度（高/中/低）

JSON形式で出力してください。
`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }]
    });
    
    const content = response.content[0].text;
    const proposals = JSON.parse(content.match(/\[[\s\S]*\]/)[0]);
    return proposals;
  } catch (error) {
    console.error('Error generating proposals:', error);
    return getDefaultProposals();
  }
}

// デフォルトの提案（APIエラー時のフォールバック）
function getDefaultProposals() {
  return [
    {
      title: "ChatGPTで売上を3倍にした3つの施策",
      description: "実際の成功事例から学ぶAI活用の極意",
      audience: "中小企業の経営者・マーケター",
      effect: "具体的な実装方法がわかる",
      urgency: "高"
    },
    {
      title: "8つの本能で解き明かす購買心理",
      description: "なぜ人は衝動買いをしてしまうのか？",
      audience: "ECサイト運営者",
      effect: "CVR向上の具体策を習得",
      urgency: "中"
    },
    {
      title: "競合に差をつけるAI×心理学戦略",
      description: "LeadFive独自のフレームワーク公開",
      audience: "マーケティング責任者",
      effect: "差別化戦略の立案",
      urgency: "高"
    },
    {
      title: "失敗しないAIツール選び5つのポイント",
      description: "現場で使える実践的な選定基準",
      audience: "AI導入検討中の企業",
      effect: "適切なツール選定",
      urgency: "中"
    },
    {
      title: "顧客の本音を引き出すAI活用術",
      description: "アンケートでは見えない深層心理分析",
      audience: "カスタマーサクセス担当",
      effect: "顧客満足度向上",
      urgency: "低"
    }
  ];
}

// 提案を送信
async function generateAndSendProposals() {
  const proposals = await generateProposals();
  
  // 提案を保存
  proposalState.set(TELEGRAM_CHAT_ID, proposals);
  
  // インラインキーボードを作成
  const keyboard = proposals.map((proposal, index) => [{
    text: `${index + 1}. ${proposal.title}`,
    callback_data: `select_${index}`
  }]);
  
  keyboard.push([
    { text: '🔄 他の提案を見る', callback_data: 'regenerate' },
    { text: '✍️ 自分で書く', callback_data: 'custom' }
  ]);
  
  keyboard.push([
    { text: '⏭️ 今日はスキップ', callback_data: 'skip' }
  ]);
  
  // 提案メッセージを作成
  let message = '🌅 おはようございます！今日のブログ記事の提案です：\n\n';
  
  proposals.forEach((proposal, index) => {
    const urgencyEmoji = {
      '高': '🔴',
      '中': '🟡', 
      '低': '🟢'
    }[proposal.urgency] || '⚪';
    
    message += `${index + 1}. ${urgencyEmoji} **${proposal.title}**\n`;
    message += `   ${proposal.description}\n`;
    message += `   👥 ${proposal.audience} | 📈 ${proposal.effect}\n\n`;
  });
  
  message += '番号をタップして選択してください 👆';
  
  bot.sendMessage(TELEGRAM_CHAT_ID, message, {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: keyboard
    }
  });
}

// コールバッククエリの処理
bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;
  
  if (data.startsWith('select_')) {
    const index = parseInt(data.split('_')[1]);
    const proposals = proposalState.get(chatId.toString());
    
    if (proposals && proposals[index]) {
      const selected = proposals[index];
      
      bot.answerCallbackQuery(query.id, { text: '記事を作成中...' });
      
      // 選択された提案の詳細を表示
      bot.sendMessage(chatId, 
        `✅ 選択されました！\n\n` +
        `📝 **${selected.title}**\n` +
        `${selected.description}\n\n` +
        `カスタマイズしますか？`,
        {
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [
                { text: '✅ このまま作成', callback_data: `create_${index}` },
                { text: '✏️ カスタマイズ', callback_data: `customize_${index}` }
              ]
            ]
          }
        }
      );
    }
    
  } else if (data.startsWith('create_')) {
    const index = parseInt(data.split('_')[1]);
    const proposals = proposalState.get(chatId.toString());
    
    if (proposals && proposals[index]) {
      const selected = proposals[index];
      
      bot.answerCallbackQuery(query.id, { text: '作成開始！' });
      
      // GitHub Actions をトリガー
      await triggerGitHubAction(selected);
      
      bot.sendMessage(chatId,
        '🚀 ブログ記事の作成を開始しました！\n\n' +
        `📄 タイトル: ${selected.title}\n` +
        `⏱️ 予想時間: 10-15分\n\n` +
        '完成したらGitHubにプッシュされます。',
        {
          reply_markup: {
            inline_keyboard: [[
              { text: '📊 GitHub を確認', url: `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}` }
            ]]
          }
        }
      );
      
      // 状態をクリア
      proposalState.delete(chatId.toString());
    }
    
  } else if (data.startsWith('customize_')) {
    const index = parseInt(data.split('_')[1]);
    const proposals = proposalState.get(chatId.toString());
    
    if (proposals && proposals[index]) {
      bot.answerCallbackQuery(query.id);
      bot.sendMessage(chatId, 
        '✏️ カスタマイズしたい内容を入力してください：\n\n' +
        '例）\n' +
        '- タイトルを「〜」に変更\n' +
        '- 事例を3つ追加\n' +
        '- 図表を含める\n' +
        '- 文字数を3000字に'
      );
      
      // カスタマイズ待ち状態を設定
      proposalState.set(chatId.toString() + '_custom', {
        proposal: proposals[index],
        waiting: true
      });
    }
    
  } else if (data === 'regenerate') {
    bot.answerCallbackQuery(query.id, { text: '新しい提案を生成中...' });
    await generateAndSendProposals();
    
  } else if (data === 'custom') {
    bot.answerCallbackQuery(query.id);
    bot.sendMessage(chatId, '✍️ ブログのトピックを入力してください：');
    proposalState.set(chatId.toString() + '_custom_topic', true);
    
  } else if (data === 'skip') {
    bot.answerCallbackQuery(query.id, { text: 'スキップしました' });
    bot.sendMessage(chatId, 'わかりました。また明日お聞きしますね！ 😊');
    proposalState.delete(chatId.toString());
  }
});

// テキストメッセージの処理
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  
  if (chatId.toString() !== TELEGRAM_CHAT_ID) return;
  
  // カスタマイズ待ちの場合
  const customState = proposalState.get(chatId.toString() + '_custom');
  if (customState && customState.waiting) {
    const customizedProposal = {
      ...customState.proposal,
      customization: text
    };
    
    await triggerGitHubAction(customizedProposal);
    
    bot.sendMessage(chatId, '✅ カスタマイズを反映して記事を作成します！');
    proposalState.delete(chatId.toString() + '_custom');
    return;
  }
  
  // カスタムトピック待ちの場合
  if (proposalState.get(chatId.toString() + '_custom_topic')) {
    await triggerGitHubAction({ 
      title: text,
      description: 'カスタムトピック',
      custom: true 
    });
    
    bot.sendMessage(chatId, '✅ カスタムトピックで記事を作成します！');
    proposalState.delete(chatId.toString() + '_custom_topic');
    return;
  }
  
  // コマンド処理
  if (text === '/start') {
    bot.sendMessage(chatId,
      '🤖 LeadFive AI ブログアシスタント\n\n' +
      '毎朝7時に5つのブログ記事案をご提案します。\n' +
      '選ぶだけで高品質な記事が自動作成されます！\n\n' +
      'コマンド:\n' +
      '/propose - 今すぐ提案を見る\n' +
      '/trends - 今週のトレンド分析\n' +
      '/performance - 記事パフォーマンス'
    );
  } else if (text === '/propose') {
    await generateAndSendProposals();
  } else if (text === '/trends') {
    await sendTrendAnalysis();
  }
});

// GitHub Actions をトリガー
async function triggerGitHubAction(proposal) {
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/dispatches`;
  
  const data = {
    event_type: 'blog-post-from-telegram',
    client_payload: {
      topic: proposal.title,
      description: proposal.description || '',
      audience: proposal.audience || '',
      customization: proposal.customization || '',
      timestamp: new Date().toISOString()
    }
  };
  
  try {
    await axios.post(url, data, {
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
  } catch (error) {
    console.error('Error triggering GitHub Action:', error);
    throw error;
  }
}

// トレンド分析を送信
async function sendTrendAnalysis() {
  const analysis = `📊 今週のトレンド分析\n\n` +
    `🔥 注目キーワード:\n` +
    `1. Claude 3.5 Sonnet の活用法\n` +
    `2. AIエージェント自動化\n` +
    `3. プロンプトエンジニアリング\n\n` +
    `📈 人気記事の傾向:\n` +
    `- 実践的なHow-to記事\n` +
    `- 具体的な数値を含む事例\n` +
    `- 心理学的アプローチ\n\n` +
    `💡 おすすめトピック:\n` +
    `- AIツールの費用対効果分析\n` +
    `- 8つの本能×最新AI活用`;
    
  bot.sendMessage(TELEGRAM_CHAT_ID, analysis);
}

console.log('🤖 LeadFive AI Blog Assistant v2 is running...');