# AI ブログアシスタント セットアップガイド

## 🤖 AIが毎朝5つの記事案を提案！選ぶだけで投稿

### 概要

毎朝7時にAIが以下を分析して最適な記事案を提案：
- 現在のトレンド
- 曜日別の読者心理
- 過去の人気記事
- 競合の動向

あなたは提案から選ぶだけ。10-15分で高品質な記事が自動投稿されます。

## 動作イメージ

```
朝7時の通知:
🌅 おはようございます！今日のブログ記事の提案です：

1. 🔴 ChatGPTで売上を3倍にした3つの施策
   実際の成功事例から学ぶAI活用の極意
   👥 中小企業の経営者 | 📈 具体的な実装方法がわかる

2. 🟡 8つの本能で解き明かす購買心理
   なぜ人は衝動買いをしてしまうのか？
   👥 ECサイト運営者 | 📈 CVR向上の具体策を習得

3. 🔴 競合に差をつけるAI×心理学戦略
   LeadFive独自のフレームワーク公開
   👥 マーケティング責任者 | 📈 差別化戦略の立案

[1. ChatGPTで売上を3倍にした...]
[2. 8つの本能で解き明かす...]
[3. 競合に差をつける...]
[🔄 他の提案を見る]
[⏭️ 今日はスキップ]
```

## セットアップ手順（10分で完了）

### 1. Telegram Bot を作成（3分）

1. Telegram で [@BotFather](https://t.me/botfather) を開く
2. `/newbot` と送信
3. Bot名を入力: `LeadFive AI Assistant`
4. Username を入力: `leadfive_ai_bot`
5. **Token を保存**: `1234567890:ABCdefGHI...`

### 2. Chat ID を取得（1分）

1. 作成したBotにメッセージを送信
2. ブラウザでアクセス:
   ```
   https://api.telegram.org/bot[YOUR_TOKEN]/getUpdates
   ```
3. `"chat":{"id":123456789}` の数字をメモ

### 3. GitHub 設定（3分）

#### Personal Access Token:
1. GitHub → Settings → Developer settings
2. Personal access tokens → Generate new token
3. 権限: `repo`, `workflow`
4. Token を保存

#### Repository Secrets:
Settings → Secrets → Actions で追加:
- `ANTHROPIC_API_KEY`: Claude API キー
- Bot用のトークンは後述のRailwayで設定

### 4. Railway でデプロイ（3分）

1. [Railway.app](https://railway.app) にログイン
2. New Project → Deploy from GitHub repo
3. このリポジトリを選択
4. 環境変数を設定:

```env
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id
GITHUB_TOKEN=your_github_token
GITHUB_OWNER=YOUR_GITHUB_USERNAME
GITHUB_REPO=leadfive-demo
ANTHROPIC_API_KEY=your_claude_api_key
```

5. Deploy!

### 5. package.json を追加

プロジェクトルートに作成:

```json
{
  "name": "leadfive-ai-blog-assistant",
  "version": "2.0.0",
  "main": "scripts/telegram-blog-bot-v2.js",
  "scripts": {
    "start": "node scripts/telegram-blog-bot-v2.js"
  },
  "dependencies": {
    "node-telegram-bot-api": "^0.64.0",
    "axios": "^1.6.0",
    "node-cron": "^3.0.3",
    "@anthropic-ai/sdk": "^0.20.0"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

## 使い方

### 基本操作

1. **毎朝7時**: 5つの提案が届く
2. **タップして選択**: 気に入った記事案を選ぶ
3. **カスタマイズ可能**: 必要に応じて調整
4. **自動投稿**: 10-15分で公開

### コマンド

- `/start` - 初期設定と説明
- `/propose` - 今すぐ提案を受け取る
- `/trends` - トレンド分析を表示
- `/performance` - 記事のパフォーマンス

### カスタマイズオプション

選択後に表示される画面で：
- **✅ このまま作成**: そのまま記事を生成
- **✏️ カスタマイズ**: 以下を指定可能
  - タイトル変更
  - 文字数指定
  - 追加要素（図表、事例など）
  - トーンの調整

## AIの提案ロジック

### 曜日別の最適化

- **月曜**: モチベーション系、週始めの施策
- **火曜**: 実践的How-to、具体的手法
- **水曜**: データ分析、数値レポート
- **木曜**: トレンド分析、競合研究
- **金曜**: 週末学習向けコンテンツ
- **土日**: 戦略的思考、深い洞察

### 緊急度の判定

- 🔴 **高**: トレンド性が高い、すぐ書くべき
- 🟡 **中**: 定番トピック、安定した需要
- 🟢 **低**: 深掘り系、じっくり読まれる

## トラブルシューティング

### Bot が応答しない
```bash
# Railway のログを確認
railway logs
```

### 提案の質を上げたい
環境変数に追加:
```env
COMPANY_FOCUS=B2B,SaaS,EC  # 重点業界
CONTENT_STYLE=practical     # 実践重視
```

### 投稿時間を変更
`telegram-blog-bot-v2.js` の cron を編集:
```javascript
// 朝6時に変更
cron.schedule('0 6 * * *', async () => {
```

## 高度な使い方

### 1. チーム利用
- グループチャットにBot追加
- 複数人で提案を議論
- 最終決定者が選択

### 2. A/Bテスト
- 同じトピックで2パターン作成
- パフォーマンスを比較
- 勝ちパターンを学習

### 3. シリーズ記事
- カスタマイズで「全5回シリーズの第1回」と指定
- 自動的に続編も提案

## 効果測定

Railway のダッシュボードで確認：
- 日別の投稿数
- 選択された提案の傾向
- カスタマイズ率
- スキップ率

これらのデータから、AIが学習して提案の質が向上します。

---

🎉 これで毎朝の記事作成が楽しみになります！