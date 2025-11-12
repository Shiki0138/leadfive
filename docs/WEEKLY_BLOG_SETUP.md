# 週間ブログ自動投稿システム セットアップガイド

## システム概要

週1回の確認メールで7日間連続自動投稿を実現するシステムです。

### 🔄 動作フロー
1. **毎週月曜日7時** - Google Apps Scriptから週間計画メール送信
2. **メール返信** - 「承認」で7日間の投稿スケジュール開始  
3. **翌日朝9時から** - 毎日1記事ずつ自動生成・投稿（7日間）
4. **完了** - 次の月曜日に新しい週間計画メール

## 🛠 セットアップ手順

### 1. Google Apps Script設定

#### ファイルのアップロード
```bash
# 新しい週間システムファイルをGoogle Apps Scriptにアップロード
cp scripts/email-blog-automation-weekly.gs [Google Apps Script プロジェクト]
```

#### 必要な設定変更
```javascript
const CONFIG = {
  recipientEmail: 'mail@lead-v.com',    // ← あなたのメールアドレス
  githubToken: 'YOUR_GITHUB_TOKEN',                 // ← GitHub Personal Access Token  
  githubOwner: 'YOUR_GITHUB_USERNAME',              // ← あなたのGitHubユーザー名
  githubRepo: 'leadfive-demo',                      // ← リポジトリ名
  anthropicApiKey: 'YOUR_ANTHROPIC_API_KEY'        // ← Claude APIキー
};
```

#### トリガー設定
```javascript
// Google Apps Script で実行
function setupWeeklyTriggers() {
  // 毎週月曜日7時に提案送信
  ScriptApp.newTrigger('sendWeeklyBlogProposal')
    .timeBased()
    .onWeekDay(ScriptApp.WeekDay.MONDAY)
    .atHour(7)
    .create();
  
  // 10分ごとに返信チェック
  ScriptApp.newTrigger('processWeeklyEmailReplies')
    .timeBased()
    .everyMinutes(10)
    .create();
}

// 実行してトリガーを設定
setupWeeklyTriggers();
```

### 2. GitHub Actions設定

#### 必要なシークレット設定
GitHub Settings → Secrets and variables → Actions で以下を設定:

```bash
ANTHROPIC_API_KEY=sk-ant-...        # Claude API キー
UNSPLASH_API_KEY=...                # 画像生成用（オプション）
EMAIL_USERNAME=mail@lead-v.com       # 通知メール送信用
EMAIL_PASSWORD=your-app-password    # Gmailアプリパスワード
RECIPIENT_EMAIL=mail@lead-v.com      # 通知受信用メールアドレス
```

#### ワークフローファイルの配置
```bash
# 既に作成済み
.github/workflows/weekly-blog-system.yml
```

### 3. Node.js スケジューラー設定

#### 環境変数の設定
```bash
# .env ファイルに追加
ANTHROPIC_API_KEY=sk-ant-...
UNSPLASH_API_KEY=...
```

#### 週間スケジューラーのテスト
```bash
cd leadfive-demo

# スケジュール初期化テスト
node scripts/weekly-blog-scheduler.js init

# 日次投稿テスト
node scripts/weekly-blog-scheduler.js daily

# 状況確認
node scripts/weekly-blog-scheduler.js status

# 緊急停止テスト
node scripts/weekly-blog-scheduler.js stop
```

## 📧 メールテンプレート例

### 週間計画メール（月曜日7時送信）
```
件名: 【LeadFive】08月12日からの週間ブログ計画 - 返信で承認

内容:
📅 08月12日からの週間ブログ計画
翌日から7日間連続投稿

お疲れさまでした！
来週のブログ記事計画（7記事）をご提案します。
「承認」と返信すると、翌日から7日間連続で投稿開始！

📅 週間スケジュール
1. 08/13(火) - AI戦略編
   提案タイトル: AI戦略で売上3倍を実現する5つの方法
   
2. 08/14(水) - 実践テクニック編  
   提案タイトル: 2025年最新版：実装方法完全ガイド
   
... (7日分)

返信オプション:
✅ 「承認」 → 7日間の自動投稿開始
✏️ 「修正 [日数] [指示]」 → 部分修正
❌ 「スキップ」 → 今週は投稿しない
🔄 「再生成」 → 新しい7日間プランを作成
```

### 承認確認メール
```
件名: ✅ 週間ブログスケジュール設定完了

7日間の自動投稿スケジュールを設定しました。

📅 投稿開始: 明日朝9時から
📝 投稿数: 7記事（連続投稿）
🔗 進捗確認: [GitHub Actions URL]

緊急停止が必要な場合は、「緊急停止」というタイトルでIssueを作成してください。
```

## 🔧 運用方法

### 通常の週次運用
1. **月曜日朝7時** - 自動的に週間計画メールが届く
2. **メール確認** - 7日間の記事計画を確認
3. **返信** - 「承認」または修正指示を返信
4. **自動実行** - 翌日朝9時から7日間連続投稿
5. **進捗確認** - GitHub ActionsやWebサイトで投稿状況を確認

### 修正・カスタマイズ
```bash
# 返信例
承認                                    # → そのまま7日間投稿開始
修正 3日目 事例をEC業界にして              # → 3日目の内容を修正
修正 全体 美容業界に特化して              # → 全体のテーマを修正  
スキップ                                # → 今週は投稿しない
再生成                                  # → 完全に新しいプランを作成
```

### 緊急停止方法
1. **GitHub Issue作成** - タイトルに「緊急停止」を含める
2. **自動実行** - GitHub Actionsが緊急停止処理を実行
3. **確認メール** - 停止完了通知が届く

## 📊 監視・レポート機能

### 自動生成されるレポート
- **日次投稿ログ** - 毎日の投稿結果
- **週次サマリー** - 週間投稿統計
- **エラーレポート** - 投稿失敗時の詳細

### 手動確認コマンド
```bash
# 現在の状況確認
node scripts/weekly-blog-scheduler.js status

# GitHub Actionsでステータスレポート実行
# Repository → Actions → Weekly Blog System → Run workflow → status-check
```

## 🚨 トラブルシューティング

### よくある問題

#### 1. メールが送信されない
```bash
# Google Apps Script のログを確認
console.log() の出力をチェック

# トリガーが正しく設定されているか確認
ScriptApp.getProjectTriggers() で確認
```

#### 2. GitHub Actions が実行されない
```bash
# シークレットが正しく設定されているか確認
# Repository → Settings → Secrets and variables → Actions

# ワークフローファイルの構文エラーをチェック
# Actions タブでエラーログを確認
```

#### 3. 記事生成エラー
```bash
# API キーの有効性を確認
curl -H "x-api-key: YOUR_ANTHROPIC_API_KEY" https://api.anthropic.com/v1/messages

# ログファイルを確認
tail -f leadfive-demo/_data/weekly-schedule.json
```

#### 4. 投稿が重複する
```bash
# スケジュールファイルをリセット
rm leadfive-demo/_data/weekly-schedule.json

# スケジューラーを再初期化
node scripts/weekly-blog-scheduler.js init
```

### エラー時の対処法
1. **ログ確認** - GitHub Actions の詳細ログをチェック
2. **手動実行** - 各コンポーネントを個別にテスト
3. **設定見直し** - API キーとシークレットの確認
4. **緊急停止** - 問題が解決するまで投稿を停止

## 📝 カスタマイズ方法

### 記事テーマの変更
```javascript
// scripts/weekly-blog-scheduler.js
const CONFIG = {
  WEEKLY_THEMES: {
    1: { theme: 'カスタムテーマ1', focus: '独自の内容', keywords: [...] },
    // ... 7日分をカスタマイズ
  }
};
```

### 投稿時間の変更
```javascript
// Google Apps Script
ScriptApp.newTrigger('sendWeeklyBlogProposal')
  .timeBased()
  .onWeekDay(ScriptApp.WeekDay.TUESDAY)  // 火曜日に変更
  .atHour(8)                             // 8時に変更
  .create();
```

### 記事数の変更
```javascript
// scripts/weekly-blog-scheduler.js
for (let day = 1; day <= 5; day++) {  // 7日 → 5日に変更
  // ...
}
```

## 📋 チェックリスト

### 初期セットアップ完了確認
- [ ] Google Apps Script の設定完了
- [ ] GitHub Secrets の設定完了  
- [ ] 週間スケジューラーの動作確認
- [ ] メール送信テスト実行
- [ ] GitHub Actions の動作確認

### 運用開始前確認
- [ ] トリガーの正常動作確認
- [ ] メール受信テスト
- [ ] 返信処理テスト
- [ ] 記事生成テスト
- [ ] 緊急停止テスト

### 週次確認項目
- [ ] 月曜日のメール受信
- [ ] 週間計画の内容確認
- [ ] 投稿状況の確認
- [ ] エラーログのチェック

このシステムで、週1回の確認だけで高品質なブログ記事を7日間連続で自動投稿できます！