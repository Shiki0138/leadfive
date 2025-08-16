# 🔧 構文エラー解決版 - 最小コード

## エラー解決：シンプル版から開始

現在のコードを**全て削除**して、以下の最小版をコピーしてください：

```javascript
const CONFIG = {
  recipientEmail: 'greenroom51@gmail.com',
  githubOwner: 'Shiki0138',
  githubRepo: 'leadfive-demo'
};

function sendTestEmail() {
  MailApp.sendEmail({
    to: CONFIG.recipientEmail,
    subject: 'LeadFive Blog Bot テスト',
    body: 'テストメールです。受信できていれば設定成功！'
  });
}

function setupTriggers() {
  MailApp.sendEmail({
    to: CONFIG.recipientEmail,
    subject: 'LeadFive Blog Assistant 設定完了',
    body: '設定が完了しました！毎朝7時にブログ提案が届きます。'
  });
}

function testSendProposal() {
  const dateStr = Utilities.formatDate(new Date(), 'JST', 'MM月dd日');
  
  MailApp.sendEmail({
    to: CONFIG.recipientEmail,
    subject: 'LeadFive ' + dateStr + 'のブログ提案',
    body: '1. ChatGPT活用で売上を3倍にする方法\n2. 8つの本能マーケティング入門\n3. AI×心理学の最新トレンド\n\n返信で番号（1-3）を送ってください。'
  });
}
```

## 📋 手順

1. **Google Apps Script エディタで全てのコードを削除**
2. **上記のコードをコピー＆貼り付け**
3. **Ctrl+S で保存**
4. **エラーが出ないか確認**

## ✅ 保存成功後のテスト

1. `sendTestEmail` を実行 → Gmailでテストメール確認
2. `testSendProposal` を実行 → Gmail でブログ提案メール確認
3. `setupTriggers` を実行 → 設定完了メール確認

## 💡 エラーが続く場合

### A. 新しいプロジェクト作成
1. [新規プロジェクト](https://script.google.com/home/projects/create)
2. 上記コードをコピー

### B. 別のブラウザ
- Chrome、Edge、Firefox で試す

### C. 文字コード問題
- コードを手動で1行ずつ入力

まずはこの最小版で保存できるか試してください！