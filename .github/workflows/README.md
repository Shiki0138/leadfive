# GitHub Actions ワークフロー一覧

## 🤖 ブログ自動化

### 1. **daily-blog-post.yml** - メインの自動ブログ投稿
- **実行タイミング**: 毎日午前9時（JST）
- **手動実行**: 可能（APIプロバイダー選択可）
- **機能**:
  - Gemini/Claude/OpenAI APIを選択可能
  - 曜日別テーマに基づいた記事生成
  - Unsplash APIで画像自動選択
  - 2500-3000文字の記事を自動生成

### 2. **blog-on-demand.yml** - オンデマンドブログ投稿
- **実行タイミング**: 手動のみ
- **機能**:
  - カスタムパラメータで記事生成
  - 複数APIプロバイダー対応
  - 即座に記事を生成・投稿

### 3. **blog-schedule-manager.yml** - ブログスケジュール管理
- **実行タイミング**: Issue作成時
- **機能**:
  - GitHub Issueからブログリクエストを管理
  - スケジュール化された投稿の管理

### 4. **keyword-response-handler.yml** - キーワード処理
- **実行タイミング**: Issue/PRコメント時
- **機能**:
  - キーワードリクエストの処理
  - 自動ブログ生成のトリガー

### 5. **blog-post-from-message.yml** - 外部連携
- **実行タイミング**: repository_dispatch
- **機能**:
  - 外部アプリからのブログ投稿
  - Webhook経由での記事作成

## 🚀 CI/CD & デプロイ

### 6. **ci-cd.yml** - CI/CDパイプライン
- **実行タイミング**: 
  - mainブランチへのpush
  - Pull Request作成時
- **機能**:
  - コード品質チェック（ESLint）
  - テスト実行
  - セキュリティスキャン
  - パフォーマンステスト（Lighthouse）
  - ステージング/本番デプロイ

### 7. **deploy.yml** - GitHub Pagesデプロイ
- **実行タイミング**: mainブランチへのpush
- **機能**:
  - Jekyllサイトのビルド
  - GitHub Pagesへのデプロイ
  - 本番環境の更新

## 📝 使い方

### 日次自動投稿を停止する場合
```yaml
# daily-blog-post.yml の schedule セクションをコメントアウト
# schedule:
#   - cron: '0 0 * * *'
```

### 手動でブログを投稿する場合
1. Actions タブへ移動
2. 「🤖 自動ブログ投稿（メイン）」または「📝 オンデマンドブログ投稿」を選択
3. "Run workflow" をクリック
4. パラメータを設定して実行

### 必要なシークレット
```
GEMINI_API_KEY      # Gemini API（推奨）
CLAUDE_API_KEY      # Claude API（オプション）
OPENAI_API_KEY      # OpenAI API（オプション）
UNSPLASH_API_KEY    # 画像取得用（推奨）
```

## 🔧 メンテナンス

- 重複したワークフローは削除済み
- 各ワークフローは単一の責任を持つ
- APIキーは環境変数で管理
- エラーハンドリング実装済み