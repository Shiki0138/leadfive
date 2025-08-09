# 🤖 AI API設定ガイド（Claude & Gemini）

## 📋 必要なAPIキー

### 1. Claude API（Anthropic）
- 高品質な日本語コンテンツ生成
- 論理的で構造化された文章
- 月間リクエスト制限あり

### 2. Gemini API（Google）
- 高速レスポンス
- 無料枠が大きい
- リアルタイム情報対応

### 3. Unsplash API（画像）
- 高品質なフリー画像
- 自動画像選択
- 月5000リクエスト無料

## 🔧 Claude API設定手順

### ステップ1: アカウント作成
1. [Anthropic Console](https://console.anthropic.com/)にアクセス
2. 「Sign up」からアカウント作成
3. メール認証を完了

### ステップ2: APIキー取得
1. ダッシュボードにログイン
2. 「API Keys」セクションへ
3. 「Create Key」をクリック
4. キー名を入力（例：`leadfive-blog`）
5. 生成されたキーをコピー
   ```
   sk-ant-api03-xxxxxxxxxxxxx
   ```

### ステップ3: 利用制限確認
- **Free Tier**: $5相当/月
- **記事生成の目安**: 約50記事/月
- **レート制限**: 5リクエスト/分

## 🔧 Gemini API設定手順

### ステップ1: Google AI Studioアクセス
1. [Google AI Studio](https://aistudio.google.com/)を開く
2. Googleアカウントでログイン

### ステップ2: APIキー生成
1. 左メニュー「Get API key」
2. 「Create API key」をクリック
3. プロジェクトを選択または新規作成
4. キーをコピー
   ```
   AIzaSyxxxxxxxxxxxxxxxxxx
   ```

### ステップ3: 無料枠の確認
- **無料枠**: 60リクエスト/分
- **文字数制限**: 32,000文字/リクエスト
- **月間制限**: なし（レート制限のみ）

## 🔧 環境変数の設定

### ローカル環境（Mac/Linux）
```bash
# ~/.bashrc または ~/.zshrc に追加
export CLAUDE_API_KEY="sk-ant-api03-xxxxx"
export GEMINI_API_KEY="AIzaSyxxxxx"
export UNSPLASH_API_KEY="your-unsplash-key"

# 設定を反映
source ~/.bashrc
```

### Windows環境
```powershell
# システム環境変数に追加
[Environment]::SetEnvironmentVariable("CLAUDE_API_KEY", "sk-ant-xxxxx", "User")
[Environment]::SetEnvironmentVariable("GEMINI_API_KEY", "AIzaxxxxx", "User")
```

### GitHub Secrets設定
1. リポジトリ → Settings → Secrets and variables → Actions
2. 「New repository secret」をクリック
3. 以下を追加：
   - Name: `CLAUDE_API_KEY`
   - Value: `sk-ant-xxxxx`
4. 同様に他のキーも追加

## 📊 API使用量の管理

### Claude使用量確認
```javascript
// スクリプト内で使用量を記録
const usage = {
  date: new Date().toISOString(),
  tokens: response.usage.total_tokens,
  cost: response.usage.total_tokens * 0.00002 // 概算
};
```

### Gemini使用量確認
Google Cloud Console → APIs & Services → Gemini API → Metrics

## 🔐 セキュリティベストプラクティス

### 1. APIキーの保護
```javascript
// ❌ 悪い例：コードに直接記載
const apiKey = "sk-ant-xxxxx";

// ✅ 良い例：環境変数から取得
const apiKey = process.env.CLAUDE_API_KEY;
```

### 2. .gitignoreの設定
```gitignore
# API Keys
.env
.env.local
config/secrets.json
```

### 3. ローテーション
- 3ヶ月ごとにAPIキーを更新
- 不審なアクセスがあれば即座に無効化

## 🧪 API動作テスト

### Claude APIテスト
```bash
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $CLAUDE_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-3-opus-20240229",
    "messages": [{"role": "user", "content": "Hello"}],
    "max_tokens": 10
  }'
```

### Gemini APIテスト
```bash
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=$GEMINI_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{
    "contents": [{
      "parts": [{"text": "Hello"}]
    }]
  }'
```

## 💰 コスト最適化

### API選択の指針
| 用途 | 推奨API | 理由 |
|------|---------|------|
| 高品質記事 | Claude | 文章品質が高い |
| 大量生成 | Gemini | 無料枠が大きい |
| リアルタイム | Gemini | レスポンスが速い |
| 複雑な分析 | Claude | 論理的思考に優れる |

### コスト削減Tips
1. **キャッシュ活用**: 類似リクエストは結果を再利用
2. **プロンプト最適化**: 短く効果的なプロンプト
3. **バッチ処理**: 複数記事をまとめて生成

## 🚨 エラー対処法

### Rate Limit Error
```javascript
// リトライロジック実装
async function callWithRetry(apiCall, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await apiCall();
    } catch (error) {
      if (error.status === 429) {
        await sleep(30000 * (i + 1)); // 30秒、60秒、90秒
        continue;
      }
      throw error;
    }
  }
}
```

### API Key Invalid
1. キーが正しくコピーされているか確認
2. 環境変数が正しく設定されているか確認
3. APIキーの有効期限を確認

## 📞 サポート情報

### 公式ドキュメント
- [Claude API Docs](https://docs.anthropic.com/claude/reference/getting-started-with-the-api)
- [Gemini API Docs](https://ai.google.dev/tutorials/rest_quickstart)
- [Unsplash API Docs](https://unsplash.com/developers)

### コミュニティ
- Claude: [Anthropic Discord](https://discord.gg/anthropic)
- Gemini: [Google AI Forum](https://groups.google.com/g/google-ai-developer-community)