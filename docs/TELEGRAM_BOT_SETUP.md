# Telegram Blog Bot セットアップガイド

## 🚀 5分でセットアップ完了！

### 1. Telegram Bot を作成

1. Telegram で [@BotFather](https://t.me/botfather) を検索
2. `/newbot` コマンドを送信
3. Bot の名前を入力（例：LeadFive Blog Bot）
4. Bot のユーザー名を入力（例：leadfive_blog_bot）
5. **Bot Token** を保存（例：`1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`）

### 2. Chat ID を取得

1. 作成したBotにメッセージを送信
2. ブラウザで以下のURLにアクセス：
   ```
   https://api.telegram.org/bot[YOUR_BOT_TOKEN]/getUpdates
   ```
3. `"chat":{"id":123456789}` の数字が **Chat ID**

### 3. GitHub Token を作成

1. GitHub → Settings → Developer settings → Personal access tokens
2. "Generate new token" → Classic
3. 権限を選択：
   - `repo` (Full control)
   - `workflow` (Update GitHub Action workflows)
4. Token を保存

### 4. Railway でデプロイ（最も簡単）

1. [Railway](https://railway.app/) にサインアップ
2. "New Project" → "Deploy from GitHub repo"
3. 環境変数を設定：

```env
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here
GITHUB_TOKEN=your_github_token_here
GITHUB_OWNER=your_github_username
GITHUB_REPO=leadfive-demo
```

4. `package.json` を作成：

```json
{
  "name": "leadfive-blog-bot",
  "version": "1.0.0",
  "main": "scripts/telegram-blog-bot.js",
  "scripts": {
    "start": "node scripts/telegram-blog-bot.js"
  },
  "dependencies": {
    "node-telegram-bot-api": "^0.64.0",
    "axios": "^1.6.0",
    "node-cron": "^3.0.3"
  }
}
```

5. Deploy!

### 5. GitHub Secrets を設定

リポジトリの Settings → Secrets and variables → Actions：

- `ANTHROPIC_API_KEY`: Claude API キー
- `GITHUB_TOKEN`: 上で作成したトークン

## 🎉 完了！

これで毎朝7時に質問が届きます：

```
🚀 月曜日の朝です！今週注目のAIマーケティングトレンドは何ですか？
```

返信すると自動的にブログが作成されます！

## 📱 使い方

### 基本コマンド
- `/start` - ボットの説明を表示
- `/post` - 今すぐブログを投稿
- `/ideas` - ブログアイデアを表示
- `/stats` - 投稿統計を確認

### 投稿フロー
1. 朝7時に質問が届く
2. トピックを返信
3. フォローアップ質問に答える
4. 10-15分でブログが自動投稿！

## 🔧 カスタマイズ

### 質問を変更したい場合

`telegram-blog-bot.js` の `morningQuestions` を編集：

```javascript
const morningQuestions = [
  {
    day: 'monday',
    question: 'あなたの質問をここに',
    followUp: 'フォローアップ質問'
  },
  // ...
];
```

### 投稿時間を変更したい場合

Cron 式を変更（[Cron式ジェネレーター](https://crontab.guru/)）：

```javascript
// 毎朝6時の場合
cron.schedule('0 6 * * *', () => {
  // ...
});
```

## 🚨 トラブルシューティング

### Bot が応答しない
- Token が正しいか確認
- Chat ID が正しいか確認
- Railway のログを確認

### GitHub Actions が動かない
- GitHub Token の権限を確認
- Repository dispatch が有効か確認

### ブログが投稿されない
- `ANTHROPIC_API_KEY` が設定されているか確認
- GitHub Actions のログを確認

## 💡 Pro Tips

1. **グループチャットで使う**
   - Bot をグループに追加
   - チームでブログアイデアを共有

2. **リマインダー設定**
   - 返信忘れ防止の再通知
   - 締切前のアラート

3. **分析機能**
   - 人気記事の傾向分析
   - 最適な投稿時間の提案

これで効率的なブログ運用が可能になります！ 🎯