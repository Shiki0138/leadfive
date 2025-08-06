# Claude AI ブログ自動生成システム

## 概要

このシステムは、Claude AI (Anthropic) を活用して、毎日自動的に高品質な日本語ブログ記事を生成し、Jekyll サイトに投稿するシステムです。

### 主な機能

- 🤖 Claude AI による高品質な日本語コンテンツ生成（2500-3000文字）
- 📅 GitHub Actions による毎日自動投稿
- 🎯 8つの本能に基づく心理学的アプローチ
- 🔗 自動内部リンク生成
- 🖼️ Unsplash API による画像自動挿入
- 📊 トピック管理とパフォーマンス分析
- 💬 Slack/LINE 通知対応

## セットアップ

### 1. 必要な環境変数

GitHub リポジトリの Settings > Secrets and variables > Actions で以下を設定：

```
ANTHROPIC_API_KEY    # Claude API キー（必須）
UNSPLASH_API_KEY     # Unsplash API キー（画像用）
SLACK_WEBHOOK_URL    # Slack 通知用（オプション）
LINE_NOTIFY_TOKEN    # LINE 通知用（オプション）
```

### 2. 初期設定

```bash
# トピックデータベースの初期化
cd scripts/blog-automation
npm install
node topic-manager.js init
```

### 3. GitHub Actions の有効化

`.github/workflows/claude-auto-blog-daily.yml` が自動的に毎日午前9時（JST）に実行されます。

## 使用方法

### 手動実行

```bash
# キーワードを指定して実行
ANTHROPIC_API_KEY=your_key node claude-blog-generator.js "AIマーケティング 最新トレンド"
```

### GitHub Actions での手動実行

1. GitHub リポジトリの Actions タブを開く
2. "Claude AI 日次ブログ自動生成" を選択
3. "Run workflow" をクリック
4. オプションでキーワードを入力して実行

## システム構成

### ファイル構造

```
scripts/blog-automation/
├── claude-blog-generator.js    # メインの生成エンジン
├── writing-prompts.js          # プロンプトテンプレート
├── topic-manager.js            # トピック管理
└── package.json               # 依存関係

_data/blog/
├── content-calendar.yml        # コンテンツカレンダー
├── topics-database.yml         # トピックデータベース
└── blog-stats.json            # 統計情報

.github/workflows/
└── claude-auto-blog-daily.yml  # GitHub Actions ワークフロー
```

### コンテンツ生成プロセス

1. **キーワード選択**
   - 曜日別テーマから自動選択
   - 月別特集キーワードを考慮
   - 30日以内の重複を回避

2. **コンテンツ生成**
   - Claude API でプロ品質の記事を生成
   - 8つの本能に基づく心理的アプローチ
   - SEO 最適化されたタイトルと構成

3. **内部リンク挿入**
   - 過去記事を分析して関連リンクを自動挿入
   - 読者の回遊性を向上

4. **画像配置**
   - Unsplash API から関連画像を自動取得
   - 適切な位置に配置して視覚的魅力を向上

5. **投稿と通知**
   - Jekyll 形式で保存
   - GitHub Pages に自動デプロイ
   - Slack/LINE で完了通知

## カスタマイズ

### コンテンツカレンダーの編集

`_data/blog/content-calendar.yml` を編集して、曜日別テーマやキーワードをカスタマイズできます。

```yaml
weekly_themes:
  monday:
    theme: "AIマーケティング"
    instinct: "learning"
    structure: "howTo"
    keywords:
      - "AI マーケティング 最新トレンド"
      - "生成AI 活用法 マーケティング"
```

### プロンプトのカスタマイズ

`writing-prompts.js` でライティングスタイルや構成をカスタマイズできます。

## トラブルシューティング

### よくある問題

1. **API キーエラー**
   - 環境変数が正しく設定されているか確認
   - API キーの有効性を確認

2. **画像が表示されない**
   - Unsplash API キーを設定
   - または画像生成をスキップ

3. **文字数が不足**
   - プロンプトの調整
   - targetLength パラメータの変更

### ログの確認

```bash
# 生成履歴の確認
cat logs/keyword-history.json

# 統計情報の確認
cat _data/blog/blog-stats.json

# トピック分析レポート
node topic-manager.js report
```

## パフォーマンス最適化

- 生成された記事は自動的に統計を収集
- 人気トピックの分析機能
- A/B テストのための複数バリエーション生成

## セキュリティ

- API キーは GitHub Secrets で安全に管理
- 生成コンテンツの自動レビュー機能
- 不適切なコンテンツのフィルタリング

## ライセンス

MIT License

## サポート

問題や質問がある場合は、GitHub Issues でお問い合わせください。