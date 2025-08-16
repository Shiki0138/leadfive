# 自動ブログ投稿メッセージングシステム

## 概要
毎朝7時に質問が届き、返信するだけでブログが自動投稿される仕組みの実装方法。

## 実装オプション

### オプション1: LINE Bot + GitHub Actions 連携

#### 必要なもの
- LINE Business ID
- LINE Messaging API
- Webhook URL（Vercel/Netlify Functions等）
- GitHub Personal Access Token

#### 仕組み
```
毎朝7時 → LINE Bot が質問送信 → ユーザーが返信 → Webhook → GitHub Actions 起動 → ブログ投稿
```

#### 実装手順

1. **LINE Bot 設定**
```javascript
// line-bot-webhook.js (Vercel Function)
const line = require('@line/bot-sdk');
const { Octokit } = require('@octokit/rest');

const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

const client = new line.Client(config);
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

// 毎朝7時の定期送信（別途Cron Job設定）
async function sendMorningQuestion() {
  const questions = [
    "今日はどんなマーケティングのトピックについて書きますか？",
    "最近のAI活用事例で興味深いものはありますか？",
    "顧客心理について新しい発見はありましたか？",
    "競合分析で気づいたことはありますか？",
    "今週のトレンドで注目すべきことは？"
  ];
  
  const todayQuestion = questions[new Date().getDay() % questions.length];
  
  await client.pushMessage(USER_ID, {
    type: 'text',
    text: `おはようございます！今日のブログテーマ：\n\n${todayQuestion}\n\n返信内容がそのままブログ記事になります。`
  });
}

// Webhook受信処理
exports.default = async (req, res) => {
  const events = req.body.events;
  
  for (const event of events) {
    if (event.type === 'message' && event.message.type === 'text') {
      const userMessage = event.message.text;
      
      // GitHub Actions をトリガー
      await octokit.repos.createDispatchEvent({
        owner: 'YOUR_GITHUB_USERNAME',
        repo: 'leadfive-demo',
        event_type: 'blog-post-from-line',
        client_payload: {
          topic: userMessage,
          timestamp: new Date().toISOString()
        }
      });
      
      // 確認メッセージを送信
      await client.replyMessage(event.replyToken, {
        type: 'text',
        text: 'ブログ記事を作成中です！30分以内に公開されます。'
      });
    }
  }
  
  res.status(200).json({ success: true });
};
```

2. **GitHub Actions ワークフロー更新**
```yaml
# .github/workflows/blog-post-from-message.yml
name: Blog Post from Messaging App

on:
  repository_dispatch:
    types: [blog-post-from-line, blog-post-from-slack]

jobs:
  create-blog-post:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
      
      - name: Create Blog Post
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
          TOPIC: ${{ github.event.client_payload.topic }}
        run: |
          # トピックからブログ記事を生成
          node scripts/generate-blog-from-topic.js "$TOPIC"
      
      - name: Commit and Push
        run: |
          git config --global user.name 'Blog Bot'
          git config --global user.email 'bot@leadfive.com'
          git add .
          git commit -m "New blog post: ${{ github.event.client_payload.topic }}"
          git push
```

### オプション2: Slack Bot 実装

```javascript
// slack-bot.js
const { App } = require('@slack/bolt');
const { Octokit } = require('@octokit/rest');
const cron = require('node-cron');

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

// 毎朝7時に質問を送信
cron.schedule('0 7 * * *', async () => {
  const questions = [
    "📝 今日のブログテーマは何にしますか？",
    "🤖 AI×マーケティングで書きたいトピックは？",
    "💡 最近の成功事例で共有したいものは？",
    "🎯 読者に伝えたいマーケティングのコツは？",
    "📊 データ分析で発見したインサイトは？"
  ];
  
  const todayQuestion = questions[new Date().getDay() % questions.length];
  
  await app.client.chat.postMessage({
    channel: '#blog-ideas',
    text: todayQuestion,
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*おはようございます！* :sunrise:\n\n${todayQuestion}`
        }
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: 'このメッセージに返信すると、自動的にブログ記事が作成されます。'
        }
      }
    ]
  });
});

// メッセージ受信時の処理
app.message(async ({ message, say }) => {
  if (message.thread_ts) { // スレッド内の返信の場合
    // GitHub Actions をトリガー
    await octokit.repos.createDispatchEvent({
      owner: 'YOUR_GITHUB_USERNAME',
      repo: 'leadfive-demo',
      event_type: 'blog-post-from-slack',
      client_payload: {
        topic: message.text,
        user: message.user,
        timestamp: new Date().toISOString()
      }
    });
    
    await say({
      text: '✅ ブログ記事を作成中です！30分以内に公開されます。',
      thread_ts: message.thread_ts
    });
  }
});
```

### オプション3: Telegram Bot（最もシンプル）

```javascript
// telegram-bot.js
const TelegramBot = require('node-telegram-bot-api');
const { Octokit } = require('@octokit/rest');
const cron = require('node-cron');

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

// 毎朝7時に質問送信
cron.schedule('0 7 * * *', () => {
  const chatId = process.env.TELEGRAM_CHAT_ID;
  const questions = [
    "🌅 おはようございます！今日のブログテーマを教えてください。",
    "📱 AI活用の新しいアイデアはありますか？",
    "🎨 マーケティングで試したい新しい手法は？",
    "📈 最近の成果で共有したいものは？",
    "🔍 競合分析で気づいたことは？"
  ];
  
  const todayQuestion = questions[new Date().getDay() % questions.length];
  bot.sendMessage(chatId, todayQuestion);
});

// メッセージ受信処理
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const messageText = msg.text;
  
  // GitHub Actions トリガー
  await octokit.repos.createDispatchEvent({
    owner: 'YOUR_GITHUB_USERNAME',
    repo: 'leadfive-demo',
    event_type: 'blog-post-from-telegram',
    client_payload: {
      topic: messageText,
      timestamp: new Date().toISOString()
    }
  });
  
  bot.sendMessage(chatId, '✅ ブログ記事を作成開始しました！');
});
```

## トピックからブログ生成スクリプト

```javascript
// scripts/generate-blog-from-topic.js
const fs = require('fs');
const path = require('path');
const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function generateBlogPost(topic) {
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0];
  
  const prompt = `
あなたはLeadFiveのAI×心理学マーケティングの専門家です。
以下のトピックについて、魅力的なブログ記事を作成してください。

トピック: ${topic}

要件:
1. タイトルは30文字以内でキャッチー
2. 8つの本能理論を適切に織り込む
3. 具体的な実践方法を含める
4. 読者の行動を促すCTAで締める
5. SEOを意識したキーワード配置

フォーマット:
---
layout: blog-post
title: [タイトル]
date: ${dateStr}
author: AI Marketing Team
categories: [適切なカテゴリ]
excerpt: [150文字の要約]
---

[本文]
`;

  const response = await anthropic.messages.create({
    model: 'claude-3-opus-20240229',
    max_tokens: 4000,
    messages: [{ role: 'user', content: prompt }]
  });
  
  const content = response.content[0].text;
  const filename = `${dateStr}-${topic.slice(0, 50).replace(/[^a-z0-9]/gi, '-').toLowerCase()}.md`;
  const filepath = path.join('_posts', filename);
  
  fs.writeFileSync(filepath, content);
  console.log(`Blog post created: ${filepath}`);
}

// コマンドライン引数からトピックを取得
const topic = process.argv[2];
if (topic) {
  generateBlogPost(topic);
} else {
  console.error('トピックが指定されていません');
  process.exit(1);
}
```

## セットアップ手順

### 1. LINE Bot を使う場合
1. LINE Developers でチャンネル作成
2. Webhook URL 設定（Vercel にデプロイ）
3. GitHub Secrets に認証情報追加
4. Cron Job サービスで毎朝7時実行設定

### 2. Slack Bot を使う場合
1. Slack App 作成
2. Bot Token Scopes 設定
3. Heroku/Railway でBot実行
4. GitHub Secrets 設定

### 3. Telegram Bot を使う場合（最も簡単）
1. @BotFather でBot作成
2. Token 取得
3. VPS/Heroku でBot実行
4. 完了！

## 環境変数設定

```bash
# GitHub Secrets に追加
ANTHROPIC_API_KEY=sk-xxx
GITHUB_TOKEN=ghp_xxx

# LINE Bot の場合
LINE_CHANNEL_ACCESS_TOKEN=xxx
LINE_CHANNEL_SECRET=xxx

# Slack Bot の場合
SLACK_BOT_TOKEN=xoxb-xxx
SLACK_SIGNING_SECRET=xxx

# Telegram Bot の場合
TELEGRAM_BOT_TOKEN=xxx:xxx
TELEGRAM_CHAT_ID=xxx
```

## 推奨構成

**最もシンプル**: Telegram Bot
- セットアップが簡単
- 個人利用に最適
- 通知が確実に届く

**チーム利用**: Slack Bot
- チームで共有可能
- スレッド機能で整理
- 他の業務と統合

**日本で人気**: LINE Bot
- 使い慣れたUI
- スマホ通知が便利
- 画像も送信可能

## 拡張アイデア

1. **AI による質問の自動生成**
   - トレンドを分析して質問を動的に変更
   - 過去の記事を参考に新しい切り口を提案

2. **マルチステップ対話**
   - 初回返信後、追加質問で詳細を掘り下げ
   - より質の高い記事を生成

3. **画像自動生成**
   - DALL-E API でアイキャッチ画像も自動作成
   - 記事内容に合わせた図表生成

4. **パフォーマンス分析**
   - 投稿後のアクセス数を自動レポート
   - 人気記事の傾向を学習

この仕組みにより、毎朝のルーティンとしてブログ投稿が習慣化され、
コンテンツの質を保ちながら効率的な運用が可能になります。