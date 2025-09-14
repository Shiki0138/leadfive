# ブログ自動投稿システム ガイド

## 概要
このシステムは、Claude AI APIを使用してSEO最適化されたブログ記事を自動生成し、Jekyllサイトに投稿します。

## 修正済みの問題
1. ✅ **年度の問題**: ブログタイトルの年が2025年に正しく設定されるようになりました
2. ✅ **画像の重複問題**: Unsplash APIのキーワード選択ロジックを改善し、記事内容に適した画像が選択されるようになりました
3. ✅ **依存関係**: 必要なパッケージ（axios, dotenv, sharp等）がインストールされました
4. ✅ **構文エラー**: SEOプロンプトファイルのテンプレートリテラル内のバックティック問題を修正

## セットアップ手順

### 1. 環境変数の設定
`.env`ファイルを作成し、以下の内容を設定してください：

```bash
# Claude AI API Key (必須)
ANTHROPIC_API_KEY=your_actual_api_key_here

# Unsplash API Key (推奨)
UNSPLASH_API_KEY=your_actual_unsplash_key_here
```

### 2. Cronジョブの設定
自動投稿を有効にするには、以下のコマンドを実行：

```bash
./scripts/blog-automation/setup-cron.sh
```

これにより、毎日午前9時に自動的にブログが投稿されます。

### 3. 手動実行
手動でブログを生成する場合：

```bash
node scripts/blog-automation/run-daily-blog.js
```

## 画像選択の改善
以下のキーワードマッピングにより、適切な画像が選択されます：
- AI → artificial intelligence technology digital
- データ分析 → data analytics dashboard charts
- マーケティング → digital marketing strategy business
- 戦略 → business strategy planning meeting
- デジタル → digital transformation technology
- 自動化 → automation workflow process
- DX → digital transformation office
- 成功事例 → business success growth chart
- ツール → software tools dashboard
- ノウハウ → knowledge sharing team collaboration
- トレンド → trending technology innovation
- 基礎 → education learning concept
- 統合 → integration connection network

## トラブルシューティング

### API認証エラー
```
❌ ブログ生成エラー: Request failed with status code 401
```
→ `.env`ファイルに正しいANTHROPIC_API_KEYを設定してください

### 未投稿の記事がある場合
システムは自動的に最も古い未投稿記事から処理します。

### ログの確認
- 成功ログ: `logs/blog-success.log`
- エラーログ: `logs/blog-error.log`
- Cronログ: `logs/cron.log`

## 週間スケジュール
`_data/weekly-schedule.json`で投稿スケジュールを管理しています。
現在、8月18日以降の6件の記事が未投稿となっています。

## 注意事項
- 画像は1週間以内に同じものを再利用しません
- SEO最適化のため、2500-3000文字の記事が生成されます
- タイトルには自動的に現在の年（2025年）が含まれます