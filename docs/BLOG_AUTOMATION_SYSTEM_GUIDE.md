# 📚 LeadFive ブログ自動投稿システム 完全ガイド

## 🌟 システム概要

LeadFiveのブログ自動投稿システムは、AI（Claude/Gemini）を活用して高品質なSEO最適化ブログ記事を自動生成・投稿するシステムです。

### 主な特徴
- 🤖 **AI連携**: Claude 3とGemini Pro対応
- 📝 **SEO最適化**: キーワード密度、内部リンク、メタデータ自動生成
- 🎯 **心理学的アプローチ**: 8つの本能を活用したコンテンツ設計
- 📊 **データ分析**: 検索意図分析、競合分析対応
- 🚀 **自動化**: GitHub Actions、Google Apps Script連携

## 📋 システム構成

### 1. コアコンポーネント

```
leadfive-demo/
├── scripts/
│   ├── blog-automation/         # ブログ生成エンジン
│   │   ├── claude-blog-generator.js
│   │   ├── gemini-blog-generator.js
│   │   └── multi-ai-generator.js
│   ├── blog-creators/           # 特化型ブログ作成ツール
│   │   ├── advanced-blog-creator.js
│   │   ├── serp-blog-creator.js
│   │   └── keyword-based-blog-creator.js
│   └── email-blog-automation.gs # メール投稿システム
├── _posts/                      # 生成された記事
├── assets/js/                   # フロントエンドツール
│   ├── blog-automation.js
│   └── ai-blog-generator.js
└── docs/                        # ドキュメント
```

### 2. 投稿方法（3種類）

#### 🌐 GitHub Actions経由
- ブラウザから直接投稿
- モバイル対応
- チーム共有可能

#### 📧 メール投稿
- Google Apps Script使用
- 指定アドレスにメール送信
- 自動的にブログ生成・投稿

#### 💻 ローカル実行
- Node.js環境で直接実行
- 開発・テスト用途
- カスタマイズ可能

## 🚀 セットアップ手順

### 1. AI APIキーの設定

#### Claude API
1. [Anthropic Console](https://console.anthropic.com/)でAPIキーを取得
2. 環境変数に設定:
   ```bash
   export CLAUDE_API_KEY="sk-ant-xxxxx"
   ```

#### Gemini API
1. [Google AI Studio](https://aistudio.google.com/apikey)でAPIキーを取得
2. 環境変数に設定:
   ```bash
   export GEMINI_API_KEY="AIzaxxxxx"
   ```

### 2. GitHub Actions設定

`.github/workflows/blog-generator.yml`:
```yaml
name: 📝 オンデマンドブログ投稿

on:
  workflow_dispatch:
    inputs:
      keyword:
        description: 'キーワード（必須）'
        required: true
      title:
        description: 'タイトル（空欄で自動生成）'
        required: false
      category:
        description: 'カテゴリー'
        type: choice
        options:
          - AIマーケティング
          - 消費者心理
          - 成功事例
          - 実践テクニック
```

### 3. メール投稿システム設定

#### Google Apps Script設定
1. [Google Apps Script](https://script.google.com)で新規プロジェクト作成
2. `email-blog-automation.gs`の内容をコピー
3. トリガー設定（1分ごと実行）

#### 設定項目
```javascript
const CONFIG = {
  GITHUB_TOKEN: 'ghp_xxxxx',
  GITHUB_OWNER: 'your-username',
  GITHUB_REPO: 'leadfive-demo',
  CLAUDE_API_KEY: 'sk-ant-xxxxx',
  ADMIN_EMAIL: 'leadfive.138@gmail.com'
};
```

## 📝 使用方法

### 方法1: GitHub Actions（推奨）

1. GitHubリポジトリの「Actions」タブを開く
2. 「📝 オンデマンドブログ投稿」を選択
3. 「Run workflow」をクリック
4. 必要情報を入力:
   - **キーワード**: `AIマーケティング 中小企業 2025`
   - **カテゴリー**: AIマーケティング
   - **本能**: learning（学習欲）

### 方法2: メール投稿

送信先: `blog@your-domain.com`

メール例:
```
件名: ブログ投稿リクエスト

キーワード: ChatGPT 業務効率化 具体例
カテゴリー: 実践テクニック
投稿日: immediate
```

### 方法3: ローカル実行

```bash
cd scripts/blog-automation
npm install
node claude-blog-generator.js \
  --keyword "AI活用 売上向上" \
  --category "成功事例" \
  --instinct "hierarchy"
```

## 🎯 コンテンツ戦略

### キーワード選定のポイント

#### 良いキーワード例
- ✅ `AIマーケティング 中小企業 導入事例 2025`
- ✅ `ChatGPT 美容サロン 集客 成功例`
- ✅ `顧客心理分析 8つの本能 実践方法`

#### 避けるべきキーワード
- ❌ `AI`（短すぎる）
- ❌ `マーケティング手法`（一般的すぎる）
- ❌ `最新情報`（具体性なし）

### 8つの本能の活用

| 本能 | キー | 効果的な場面 | コンテンツ例 |
|------|------|-------------|-----------|
| 生存欲 | survival | リスク回避訴求 | セキュリティ対策、失敗回避法 |
| 食欲 | food | 即効性の訴求 | すぐ使えるテクニック |
| 性欲 | sex | 魅力・美の訴求 | ブランディング、デザイン |
| 危機回避 | danger | 問題解決 | トラブルシューティング |
| 地位向上 | hierarchy | 成功・優位性 | 業界リーダー事例 |
| 共感欲 | empathy | 信頼構築 | お客様の声、体験談 |
| 学習欲 | learning | 新知識提供 | 最新トレンド、How-to |
| 競争優位 | territorial | 差別化戦略 | 独自手法、競合分析 |

## 📊 生成される記事の構成

### 標準構成（2500-3000文字）

```markdown
# SEO最適化されたタイトル（60文字以内）

## はじめに（問題提起）
- 読者の共感を得る導入
- 記事の価値を明確化

## メインコンテンツ（3-4セクション）
### 1. 現状分析
### 2. 解決策の提示  
### 3. 具体的な実践方法
### 4. 成功事例

## まとめ（行動促進）
- 要点の整理
- 次のアクションへの誘導

## CTA（お問い合わせ誘導）
```

### SEO要素

- **タイトルタグ**: キーワード含有、60文字以内
- **メタディスクリプション**: 120-160文字
- **見出し構造**: h2-h4の階層構造
- **キーワード密度**: 2-3%
- **内部リンク**: 関連記事3-5本
- **画像alt属性**: 自動設定

## 🔧 カスタマイズ

### プロンプトのカスタマイズ

`writing-prompts.js`でプロンプトを編集:
```javascript
const PROMPTS = {
  blogPost: {
    system: "あなたはSEOとコンテンツマーケティングの専門家です。",
    instruction: "以下の要件で記事を作成してください..."
  }
};
```

### カテゴリーの追加

1. `_data/blog_config.yml`に追加:
```yaml
categories:
  - name: "新カテゴリー"
    slug: "new-category"
    description: "カテゴリーの説明"
```

2. スクリプトで対応:
```javascript
const CATEGORIES = {
  'new-category': {
    name: '新カテゴリー',
    focus: 'カテゴリーの焦点'
  }
};
```

## 📈 パフォーマンス最適化

### 生成速度の向上

1. **AI選択の最適化**
   - 簡単な記事: Gemini Pro（高速）
   - 複雑な記事: Claude 3（高品質）

2. **キャッシュ活用**
   - 類似キーワードの再利用
   - テンプレート部分の事前生成

3. **並列処理**
   - 複数記事の同時生成
   - 画像とテキストの並行処理

## 🐛 トラブルシューティング

### よくある問題と解決策

#### APIエラー
```
Error: 429 Rate Limit Exceeded
```
**解決策**: 
- APIキーの利用制限を確認
- リトライ間隔を調整（30秒→60秒）

#### 文字数不足
```
Generated content is too short (1500 characters)
```
**解決策**:
- プロンプトに最小文字数を明記
- コンテンツ構成を詳細化

#### SEOスコア低下
**解決策**:
- キーワード密度の調整（2-3%）
- 見出し構造の最適化
- 内部リンクの追加

### デバッグモード

```bash
# 詳細ログ出力
DEBUG=true node claude-blog-generator.js --keyword "test"

# ドライラン（投稿せずに生成のみ）
node claude-blog-generator.js --keyword "test" --dry-run
```

## 🚀 応用編

### 1. 予約投稿システム

Google Sheetsでスケジュール管理:
```
| 投稿日 | キーワード | カテゴリー | ステータス |
|--------|-----------|------------|-----------|
| 月曜日 | AI活用事例 | 成功事例 | 待機中 |
| 水曜日 | 心理学基礎 | 消費者心理 | 待機中 |
```

### 2. A/Bテスト自動化

同じキーワードで異なるアプローチ:
- バージョンA: 事例中心
- バージョンB: 理論中心

### 3. 多言語対応

```javascript
// 言語別生成
const languages = ['ja', 'en', 'zh'];
for (const lang of languages) {
  await generateBlog({ keyword, language: lang });
}
```

## 📞 サポート

### リソース
- **ドキュメント**: `/docs/`ディレクトリ
- **サンプルコード**: `/scripts/demos/`
- **テストツール**: `/scripts/blog-automation/test-*.js`

### お問い合わせ
- **技術的な質問**: GitHubのIssueで
- **APIキー関連**: 各プロバイダーのサポート
- **カスタマイズ依頼**: leadfive.138@gmail.com

## 🎉 まとめ

このシステムにより：
- ✅ 月間50-100記事の自動生成が可能
- ✅ SEOスコア80点以上を維持
- ✅ 執筆時間を90%削減
- ✅ 一貫した品質を保証

継続的な改善により、さらなる効率化と品質向上を目指します。