# Claude API キー取得・設定ガイド

## 📌 重要な注意事項

Claude Code（デスクトップアプリ）と Claude API は別のサービスです：
- **Claude Code**: サブスクリプション型のデスクトップアプリケーション
- **Claude API**: APIキーベースのプログラマティックアクセス

ブログ自動生成システムには **Claude API** のキーが必要です。

## 🔑 Claude API キーの取得方法

### 1. Anthropic Console にアクセス

1. [https://console.anthropic.com](https://console.anthropic.com) にアクセス
2. アカウントを作成またはログイン

### 2. API キーの作成

1. ダッシュボードの「API Keys」セクションに移動
2. 「Create Key」をクリック
3. キーの名前を入力（例：「Blog Generator」）
4. 生成されたAPIキーをコピー（一度しか表示されません！）

### 3. 料金プラン

Claude API は従量課金制です：
- **Claude 3 Opus**: $15 / 1M入力トークン、$75 / 1M出力トークン
- **Claude 3 Sonnet**: $3 / 1M入力トークン、$15 / 1M出力トークン
- **Claude 3 Haiku**: $0.25 / 1M入力トークン、$1.25 / 1M出力トークン

ブログ生成（3000文字）の目安：
- 1記事あたり約4000トークン使用
- Opus使用時：約$0.30/記事
- Sonnet使用時：約$0.06/記事

## 💰 コスト最適化の方法

### 1. モデルの選択

```javascript
// claude-blog-generator.js を編集
const response = await axios.post(
  'https://api.anthropic.com/v1/messages',
  {
    // model: 'claude-3-opus-20240229',  // 高品質だが高価
    model: 'claude-3-sonnet-20240229',   // バランス型（推奨）
    // model: 'claude-3-haiku-20240229', // 安価だが品質低下
    max_tokens: 4000,
    // ...
  }
);
```

### 2. 生成頻度の調整

```yaml
# .github/workflows/claude-auto-blog-daily.yml を編集

on:
  schedule:
    # 毎日実行
    # - cron: '0 0 * * *'
    
    # 週3回実行（月・水・金）
    - cron: '0 0 * * 1,3,5'
    
    # 週1回実行（月曜日）
    # - cron: '0 0 * * 1'
```

## 🛠️ API キーの設定方法

### 方法1: GitHub Secrets（推奨）

1. GitHubリポジトリの Settings → Secrets and variables → Actions
2. 「New repository secret」をクリック
3. Name: `ANTHROPIC_API_KEY`
4. Value: 取得したAPIキー
5. 「Add secret」をクリック

### 方法2: ローカル環境変数

```bash
# .env ファイルを作成
echo "ANTHROPIC_API_KEY=sk-ant-api03-xxxxx" > scripts/blog-automation/.env

# または環境変数として設定
export ANTHROPIC_API_KEY="sk-ant-api03-xxxxx"
```

### 方法3: .bashrc / .zshrc に追加

```bash
# ~/.bashrc または ~/.zshrc に追加
export ANTHROPIC_API_KEY="sk-ant-api03-xxxxx"

# 設定を反映
source ~/.bashrc  # または source ~/.zshrc
```

## 🆓 無料の代替案

### 1. OpenAI API を使用

```javascript
// scripts/blog-automation/openai-blog-generator.js として新規作成
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateWithOpenAI(prompt) {
  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview", // または gpt-3.5-turbo
    messages: [{ role: "user", content: prompt }],
    max_tokens: 4000,
  });
  
  return response.choices[0].message.content;
}
```

### 2. ローカルLLMを使用（Ollama）

```bash
# Ollama のインストール
curl -fsSL https://ollama.com/install.sh | sh

# 日本語対応モデルをダウンロード
ollama pull llama2-japanese

# API サーバーを起動
ollama serve
```

```javascript
// scripts/blog-automation/ollama-blog-generator.js
const axios = require('axios');

async function generateWithOllama(prompt) {
  const response = await axios.post('http://localhost:11434/api/generate', {
    model: 'llama2-japanese',
    prompt: prompt,
    stream: false
  });
  
  return response.data.response;
}
```

## 📊 コスト管理のベストプラクティス

### 1. 使用量モニタリング

```javascript
// scripts/blog-automation/usage-tracker.js
const fs = require('fs').promises;
const path = require('path');

class UsageTracker {
  async logUsage(tokens, cost) {
    const logFile = path.join(__dirname, '../../logs/api-usage.json');
    let usage = { total_tokens: 0, total_cost: 0, entries: [] };
    
    try {
      const existing = await fs.readFile(logFile, 'utf-8');
      usage = JSON.parse(existing);
    } catch (e) {}
    
    usage.total_tokens += tokens;
    usage.total_cost += cost;
    usage.entries.push({
      date: new Date().toISOString(),
      tokens,
      cost
    });
    
    await fs.writeFile(logFile, JSON.stringify(usage, null, 2));
  }
}
```

### 2. 月次予算アラート

```yaml
# .github/workflows/usage-alert.yml
name: API使用量アラート

on:
  schedule:
    - cron: '0 0 * * MON'  # 毎週月曜日

jobs:
  check-usage:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: 使用量チェック
        run: |
          USAGE=$(cat logs/api-usage.json | jq .total_cost)
          if (( $(echo "$USAGE > 50" | bc -l) )); then
            echo "⚠️ 月次API使用料が$50を超えました: $${USAGE}"
            # Slack/メール通知を送信
          fi
```

## 🔧 トラブルシューティング

### よくあるエラー

1. **認証エラー**
   ```
   Error: 401 Unauthorized
   ```
   → APIキーが正しく設定されているか確認

2. **レート制限**
   ```
   Error: 429 Too Many Requests
   ```
   → リクエスト間隔を調整（5秒以上推奨）

3. **残高不足**
   ```
   Error: insufficient_balance
   ```
   → Anthropic Console で残高を確認・チャージ

## 📞 サポート

- **Anthropic公式ドキュメント**: https://docs.anthropic.com
- **料金計算機**: https://anthropic.com/pricing
- **サポート**: support@anthropic.com

---

最終更新: 2025年1月