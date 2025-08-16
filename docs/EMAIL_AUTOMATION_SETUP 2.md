# 📧 メールで完結！ブログ自動投稿セットアップ

## 🎯 最も簡単な方法：Gmail + Google Apps Script

毎朝メールで提案が届き、番号を返信するだけでブログが投稿されます。

### 動作イメージ

**朝7時に届くメール：**

![メールイメージ](https://via.placeholder.com/600x800/8b5cf6/ffffff?text=Blog+Proposals)

```
件名: 【LeadFive】12月15日のブログ提案 - 返信で選択

1. 🔴 急ぎ | ChatGPT活用で売上3倍を実現する5つのステップ
   中小企業が実践できる具体的なAI活用法
   👥 中小企業の経営者 | 🎯 AIツールの導入計画が立てられる

2. 🟡 通常 | 8つの本能を刺激するランディングページ設計術
   心理学的アプローチでCVR267%改善の実例
   👥 Webマーケター | 🎯 LP改善の具体的な方法がわかる

返信で番号（1〜5）を送信するだけで記事が作成されます。
```

**あなたの返信：**
```
1
```

**15分後：**
```
✅ ブログ記事が投稿されました！
https://leadfive138.com/blog/2024-12-15-chatgpt-sales-3x
```

## 📋 セットアップ手順（15分）

### 1. Google Apps Script を開く

1. [script.google.com](https://script.google.com) にアクセス
2. 「新しいプロジェクト」をクリック
3. プロジェクト名を「LeadFive Blog Assistant」に変更

### 2. スクリプトをコピー

1. `email-blog-automation.gs` の内容をコピー
2. エディタに貼り付け
3. 設定を変更：

```javascript
const CONFIG = {
  recipientEmail: 'あなたのGmailアドレス',
  githubToken: 'ghp_xxxxx', // 後で設定
  githubOwner: 'あなたのGitHubユーザー名',
  githubRepo: 'leadfive-demo'
};
```

### 3. GitHub Token を作成

1. GitHub → Settings → Developer settings
2. Personal access tokens → Tokens (classic)
3. Generate new token
4. 権限を選択：
   - ✅ repo（全て）
   - ✅ workflow

### 4. スクリプトプロパティに保存（セキュア）

Google Apps Script エディタで：
1. プロジェクトの設定（歯車アイコン）
2. スクリプト プロパティ
3. プロパティを追加：
   - `GITHUB_TOKEN`: 作成したトークン
   - `ANTHROPIC_API_KEY`: Claude APIキー

### 5. トリガーを設定

```javascript
// setupTriggers() 関数を一度実行
```

または手動で：
1. トリガー（時計アイコン）
2. トリガーを追加
3. 設定：
   - 関数: `sendDailyBlogProposals`
   - 時間ベース → 日付ベースのタイマー → 午前7時〜8時

4. もう1つ追加：
   - 関数: `processEmailReplies`
   - 時間ベース → 分ベースのタイマー → 10分ごと

### 6. 権限を承認

初回実行時に権限の承認が必要：
1. 「権限を確認」をクリック
2. Googleアカウントを選択
3. 「詳細」→「安全ではないページに移動」
4. 「許可」

## 🎨 カスタマイズ

### 提案内容を変更

```javascript
// generateProposals() 関数を編集
return [
  {
    title: "あなたの希望するタイトル",
    description: "説明文",
    audience: "ターゲット",
    urgency: "高", // 高/中/低
    readTime: "5分",
    expectedResult: "期待される成果"
  },
  // ... 5つまで
];
```

### カスタマイズ返信

```
1 カスタム: 事例を3つ追加、文字数3000字で
```

### その他のコマンド

- `新しい提案` → 別の5案を再生成
- `スキップ` → 今日は投稿しない
- `ChatGPTの最新機能について` → 自由なトピックで作成

## 🚀 高度な機能

### 1. スプレッドシートで履歴管理

自動的に以下が記録されます：
- 提案履歴
- 選択された記事
- カスタマイズ内容
- 投稿日時

### 2. 分析機能

```javascript
// 人気の提案パターンを分析
function analyzePopularTopics() {
  const sheet = SpreadsheetApp.openById('SHEET_ID');
  // 選択率の高いトピックを分析
}
```

### 3. 複数人での利用

```javascript
const CONFIG = {
  recipientEmails: [
    'member1@gmail.com',
    'member2@gmail.com'
  ],
  // 最初に返信した人の選択を採用
};
```

## ❓ トラブルシューティング

### メールが届かない

1. 迷惑メールフォルダを確認
2. トリガーが正しく設定されているか確認
3. 実行数の上限（1日20通）を確認

### 返信が処理されない

1. 返信は本文の最初に番号を記載
2. HTMLメールではなくテキストで返信
3. トリガーの実行履歴を確認

### GitHub Actions が動かない

1. GitHub Token の権限を確認
2. リポジトリの Settings → Actions が有効か確認
3. workflow ファイルが存在するか確認

## 💡 Tips

### 1. フィルタで自動整理

Gmailでフィルタを作成：
- 件名に「ブログ提案」を含む → ラベル「Blog」を付ける

### 2. スマホで快適に

- Gmail アプリの通知をON
- クイック返信で番号だけ送信

### 3. 休暇中の一時停止

```javascript
// トリガーを無効化
function pauseBlogAssistant() {
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    ScriptApp.deleteTrigger(trigger);
  });
}
```

これで毎朝のブログ投稿が楽しみになりますね！ 📧✨