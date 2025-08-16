# 📝 Gemini API セットアップガイド

## 🚀 Gemini APIの特徴

- **無料枠あり**: 1分間60リクエストまで無料
- **高速生成**: Claudeより高速な応答
- **日本語対応**: 高品質な日本語生成
- **Google製**: 安定性とサポート

## 📋 セットアップ手順

### 1. Gemini API キーの取得

1. **Google AI Studio** にアクセス: https://makersuite.google.com/
2. Googleアカウントでログイン
3. **Get API key** をクリック
4. **Create API Key** → プロジェクトを選択または新規作成
5. APIキーをコピー（`AIza...` のような形式）

### 2. GitHub Secrets に設定

1. リポジトリページへ: https://github.com/Shiki0138/leadfive
2. **Settings** → **Secrets and variables** → **Actions**
3. **New repository secret** をクリック
4. 以下を入力:
   - **Name**: `GEMINI_API_KEY`
   - **Secret**: 取得したAPIキー
5. **Add secret** をクリック

### 3. 使用方法

GitHub Actions で実行すると、自動的に以下の優先順位で選択されます：

1. **Gemini API** (GEMINI_API_KEY が設定されている場合)
2. **Claude API** (ANTHROPIC_API_KEY が設定されている場合)
3. **モックジェネレーター** (APIキーがない場合)

## 💰 料金

### 無料枠
- **60 RPM** (Requests Per Minute)
- **1日あたり1,500リクエスト**
- ブログ記事生成には十分な容量

### 有料プラン
- 必要に応じてスケールアップ可能
- 詳細: https://ai.google.dev/pricing

## 🎯 Gemini vs Claude

| 項目 | Gemini | Claude |
|------|--------|---------|
| 料金 | 無料枠あり | 有料のみ |
| 速度 | 高速 | 中速 |
| 品質 | 高品質 | 最高品質 |
| 文字数制限 | 標準 | 大容量 |

## ⚡ テスト実行

ローカルでテスト:

```bash
cd scripts/blog-automation
export GEMINI_API_KEY="your-api-key"
node gemini-blog-generator.js "AIマーケティング 成功事例"
```

## 🔧 トラブルシューティング

### エラー: "API key not valid"
- APIキーが正しくコピーされているか確認
- Google Cloud Consoleでプロジェクトを確認

### エラー: "Quota exceeded"
- 無料枠の制限に達した可能性
- 1分待ってから再実行

## 📞 サポート

- Google AI Studio: https://makersuite.google.com/
- ドキュメント: https://ai.google.dev/docs