# プロジェクトディレクトリ構造

## 📁 整理後の構造

```
leadfive-demo/
├── _data/               # Jekyll データファイル
│   └── blog/           # ブログ設定
├── _includes/          # Jekyll インクルードファイル
├── _layouts/           # Jekyll レイアウト
├── _pages/             # 静的ページ
├── _posts/             # ブログ記事
├── _sass/              # Sassスタイルシート
├── _services/          # サービスページ
├── _site/              # Jekyll ビルド出力
├── assets/             # 静的アセット
│   ├── css/
│   ├── images/
│   └── js/
├── backup/             # バックアップファイル
├── blog/               # ブログ関連ページ
├── docs/               # ドキュメント
│   └── guides/         # 各種ガイド
├── scripts/            # スクリプト
│   ├── blog-automation/    # Claude AI ブログ自動化
│   ├── blog-creators/      # 各種ブログ作成ツール
│   └── demos/              # デモスクリプト
└── tests/              # テストファイル
```

## 🚀 主要なファイル

### ブログ自動化（Claude AI）
```
scripts/blog-automation/
├── claude-blog-generator.js    # メインジェネレーター
├── mock-blog-generator.js      # テスト用モック
├── multi-ai-generator.js       # マルチAI対応
├── writing-prompts.js          # プロンプトテンプレート
├── topic-manager.js            # トピック管理
├── local-test.sh              # ローカルテスト
└── package.json               # 依存関係
```

### メインブログ作成ツール
```
# ルートディレクトリ
claude-code-realtime-blog-creator.js  # メイン実行ファイル
main-blog-creator.js                  # シンボリックリンク
```

### GitHub Actions
```
.github/workflows/
├── claude-auto-blog-daily.yml  # Claude AI 日次実行
└── auto-blog-daily.yml         # 既存の自動実行
```

## 🧹 整理内容

1. **ブログ作成スクリプト**: 9個のファイルを `/scripts/blog-creators/` に移動
2. **デモスクリプト**: 5個のファイルを `/scripts/demos/` に移動
3. **ドキュメント**: 6個のガイドを `/docs/guides/` に移動
4. **バックアップ**: 重複ファイルを `/backup/` に移動
5. **テスト**: テストファイルを `/tests/` に移動

## 📊 結果

- ルートディレクトリのアイテム数: 81 → 59（27%削減）
- すべての機能を維持
- より論理的な構造
- アクセスしやすい配置