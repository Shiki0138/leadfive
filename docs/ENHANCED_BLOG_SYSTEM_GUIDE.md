# 高品質ブログ生成システム 使用ガイド

## 概要

このシステムは、あなたの要望に基づいて以下の機能を実装しています：

### ✅ 実装済み機能

1. **文章品質向上**
   - 箇条書きを全体の20%以下に制限
   - 流れる文章を重視した構成
   - 読者属性（経営者・マーケティング責任者）を意識した内容

2. **画像管理システム**
   - 各h2見出しの下に適切な画像を自動配置
   - 同一記事内での画像重複防止
   - 1週間単位での画像重複防止
   - コンテンツに沿った画像の自動選択

3. **AI活用のバランス**
   - 生成AIを前面に出さないアプローチ
   - ビジネス課題から自然にAI活用の必要性に導く構成
   - 読者の関心に合わせたストーリーテリング

4. **内部リンク管理**
   - 週1回の過去記事確認システム
   - 関連記事への内部リンク自動追加
   - リンク機会の自動特定

## システム構成

```
scripts/
├── blog-automation/
│   ├── enhanced-blog-system.js     # メインの記事生成システム
│   └── seo-writing-prompts.js      # 更新済みプロンプト
├── weekly-blog-maintenance.js      # 週次メンテナンス
logs/
├── weekly-image-history.json       # 画像使用履歴
├── internal-links-queue.json       # 内部リンク待機列
└── weekly-report-YYYY-MM-DD.json   # 週次品質レポート
```

## 使用方法

### 1. 高品質記事の生成

```bash
# 基本的な記事生成
node scripts/blog-automation/enhanced-blog-system.js "AIマーケティング"

# 環境変数での実行
BLOG_KEYWORD="データ分析" node scripts/blog-automation/enhanced-blog-system.js
```

### 2. 週次メンテナンス

```bash
# 週次メンテナンス実行（毎週1回）
node scripts/weekly-blog-maintenance.js

# 内部リンクのみ更新
node scripts/blog-automation/enhanced-blog-system.js "dummy" --internal-links
```

### 3. 環境変数設定

`.env`ファイルを作成して以下を設定：

```env
ANTHROPIC_API_KEY=your_anthropic_api_key
UNSPLASH_API_KEY=your_unsplash_access_key
```

## 記事生成の特徴

### 文章構成

- **流れる文章重視**: 箇条書きは20%以下に制限
- **ストーリーテリング**: 課題 → 共感 → 解決策 → AI活用 → アクション
- **読者目線**: 経営者・マーケティング責任者の課題に寄り添う

### 画像配置

```markdown
## セクション見出し
![適切な説明](自動選択された画像パス)

流れる文章での説明が続く...
```

### AI活用の訴求方法

❌ **避ける**: 「生成AIで売上3倍！」のような直接的な訴求
✅ **推奨**: 「業務効率化の課題を解決するためには、最新のテクノロジー活用が不可欠になってきました」

## 画像管理システム

### 自動画像選択ルール

1. **セクション別マッピング**:
   - 「成功事例」→ "business success team celebration"
   - 「データ分析」→ "data analytics dashboard"
   - 「戦略」→ "business strategy planning meeting"

2. **重複防止**:
   - 同一記事内での重複チェック
   - 過去7日間の使用履歴チェック
   - 適切な代替画像の自動選択

3. **画像履歴管理**:
```json
{
  "photo_id": "unique-id-123",
  "used_at": "2024-01-01T12:00:00Z",
  "description": "データ分析",
  "url": "https://images.unsplash.com/..."
}
```

## 内部リンク システム

### 自動リンク追加プロセス

1. **記事生成時**: 関連記事候補を特定
2. **キューイング**: リンク機会を待機列に追加
3. **週次実行**: 最も関連度の高い記事にリンク追加

### リンク候補の判定基準

- **共通キーワード数**: 2個以上
- **関連度スコア**: キーワード重複度で算出
- **時期考慮**: 新しい記事を優先

## 品質管理システム

### 週次レポート内容

```json
{
  "summary": {
    "totalPosts": 25,
    "averageQualityScore": 85,
    "averageSEOScore": 78,
    "averageLength": 2750,
    "bulletPointRatio": 15
  },
  "recommendations": [
    {
      "type": "quality",
      "priority": "medium",
      "message": "文字数をもう少し増やすことをお勧めします"
    }
  ]
}
```

### 品質スコア算出

- **文字数**: 2500-3000文字で最高点
- **箇条書き比率**: 20%以下で高評価
- **画像数**: 2-4枚で適切
- **内部リンク**: 1-3個で最適

## 運用スケジュール

### 推奨運用パターン

```bash
# 平日: 新記事生成
Monday-Friday: node scripts/blog-automation/enhanced-blog-system.js "キーワード"

# 週末: メンテナンス実行
Saturday: node scripts/weekly-blog-maintenance.js
```

### 自動化設定 (cron)

```bash
# 毎週土曜日 午前2時に週次メンテナンス
0 2 * * 6 cd /path/to/project && node scripts/weekly-blog-maintenance.js
```

## トラブルシューティング

### よくある問題

1. **画像が取得できない**
   ```bash
   # Unsplash API キーを確認
   echo $UNSPLASH_API_KEY
   ```

2. **記事生成が失敗する**
   ```bash
   # Anthropic API キーを確認
   echo $ANTHROPIC_API_KEY
   ```

3. **履歴ファイルエラー**
   ```bash
   # ログディレクトリを手動作成
   mkdir -p logs
   ```

### ログファイルの確認

```bash
# 週次レポートの確認
ls logs/weekly-report-*.json

# 画像履歴の確認
cat logs/weekly-image-history.json
```

## カスタマイズ

### 画像マッピングの追加

`enhanced-blog-system.js`の`generateImageSearchQuery`メソッドでマッピングを追加：

```javascript
const sectionMapping = {
  '新しいセクション': 'appropriate search query',
  // ...既存のマッピング
};
```

### 品質基準の調整

`weekly-blog-maintenance.js`の`calculateQualityScore`メソッドで基準を調整：

```javascript
// 箇条書き比率の基準を変更
if (bulletPointRatio <= 15) { // 20% → 15%に変更
  score += 15;
}
```

## 期待される効果

### 記事品質

- **読みやすさ向上**: 箇条書き削減により自然な文章
- **エンゲージメント向上**: 読者の課題に寄り添う内容
- **専門性向上**: 具体例と根拠に基づく説得力

### SEO効果

- **内部リンク強化**: 関連記事への自動リンク
- **画像最適化**: 適切な画像による視覚的魅力
- **コンテンツ品質**: 継続的な品質向上

### 運用効率

- **自動化**: 画像選択と内部リンクの自動化
- **品質管理**: 週次レポートによる継続改善
- **重複防止**: 画像・コンテンツの重複回避

## サポート

問題が発生した場合は、以下を確認してください：

1. 環境変数の設定
2. APIキーの有効性
3. ログファイルの内容
4. ディレクトリの権限

このシステムにより、高品質で読者に価値を提供するブログ記事を効率的に生成・管理できます。