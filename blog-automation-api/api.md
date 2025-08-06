# ブログ自動化 API エンドポイント

将来的に実装予定のWebベースのブログ投稿インターフェース用API仕様。

## エンドポイント

### POST /api/blog/generate
ブログ記事を生成

```json
{
  "keyword": "AIマーケティング 最新トレンド",
  "title": "オプション - タイトル",
  "category": "AIマーケティング",
  "instinct": "learning",
  "publish": true
}
```

### GET /api/blog/status/:id
生成状況を確認

### GET /api/blog/keywords/suggest
キーワード候補を提案

### POST /api/blog/schedule
投稿をスケジュール

## Webhook 統合

### Slack コマンド
```
/blog AIマーケティング 最新トレンド
```

### LINE Bot
「ブログ投稿 AIマーケティング」とメッセージ送信

### メール投稿
blog@your-domain.com にキーワードを送信

## 実装予定

- Vercel Functions での API 実装
- Slack App 統合
- LINE Bot 統合
- Web UI ダッシュボード
- モバイルアプリ