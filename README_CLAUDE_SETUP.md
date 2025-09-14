# Claude AI ブログ自動生成システム - シンプルセットアップガイド

## 🚀 クイックスタート（3ステップ）

### ステップ1: セットアップ
```bash
cd /Users/leadfive/Desktop/system/022_HP/leadfive-demo/scripts/blog-automation
npm install
```

### ステップ2: テスト実行（APIキー不要）
```bash
./local-test.sh
```

### ステップ3: 本番実行（APIキー必要）
```bash
export ANTHROPIC_API_KEY="your-api-key"
node claude-blog-generator.js "AIマーケティング"
```

## 📁 ファイル構成

```
scripts/blog-automation/
├── claude-blog-generator.js    # Claude API使用
├── mock-blog-generator.js      # APIキー不要のテスト用
├── local-test.sh              # 対話型テストツール
└── その他のサポートファイル
```

## 💰 料金

- **テスト（モック）**: 無料
- **Claude API**: 約$0.06/記事（Sonnet使用）

## 🔧 トラブルシューティング

エラーが出た場合：
```bash
pwd  # 現在地を確認
cd /Users/leadfive/Desktop/system/022_HP/leadfive-demo/scripts/blog-automation
```

## 📞 使い方

1. **無料でテスト**: `./local-test.sh`
2. **本番で使用**: Claude APIキーを取得して環境変数に設定

以上です！