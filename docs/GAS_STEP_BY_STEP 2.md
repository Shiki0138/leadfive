# 📧 段階的セットアップ - 次のステップ

## ✅ 現在の状況
- 基本設定 → 保存成功！
- テスト用メール関数 → 作成済み

---

## ステップ1: テストメール送信（1分）

### A. 実行してみる
1. 関数選択で **`sendTestEmail`** を選択
2. **▶️ 実行** ボタンをクリック
3. 権限承認画面が出たら承認
4. **Gmail を確認** → テストメールが届いているはず！

### B. メール確認
受信トレイに以下のメールが届けばOK：
```
件名: LeadFive Blog Bot テスト
本文: テストメールです。受信できていれば設定成功！
```

---

## ステップ2: ブログ提案機能を追加（3分）

テストメールが届いたら、以下のコードを **追加**：

```javascript
// ブログ提案を生成
function generateTodayProposals() {
  return [
    {
      title: "ChatGPT活用で売上を3倍にする5つのステップ",
      description: "中小企業が今すぐ実践できるAI活用法",
      audience: "中小企業経営者",
      urgency: "高",
      readTime: "7分"
    },
    {
      title: "8つの本能マーケティング：購買心理の科学", 
      description: "LeadFive独自の心理学フレームワーク解説",
      audience: "マーケター",
      urgency: "中",
      readTime: "10分"
    },
    {
      title: "Claude vs ChatGPT：用途別使い分けガイド",
      description: "最新AI比較と実践的な活用シーン",
      audience: "AI導入検討者", 
      urgency: "高",
      readTime: "8分"
    }
  ];
}

// 提案メール送信
function sendDailyBlogProposals() {
  const proposals = generateTodayProposals();
  const dateStr = Utilities.formatDate(new Date(), 'JST', 'MM月dd日');
  
  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px;">
      <div style="background: linear-gradient(135deg, #8b5cf6, #ec4899); padding: 20px; color: white; text-align: center;">
        <h1>📝 ${dateStr}のブログ提案</h1>
      </div>
      
      <div style="padding: 20px; background: #f9fafb;">
        <p><strong style="color: #8b5cf6;">返信で番号（1〜3）を送信するだけで記事が作成されます。</strong></p>
        
        ${proposals.map((p, i) => `
          <div style="background: white; border: 2px solid ${p.urgency === '高' ? '#ef4444' : '#e5e7eb'}; margin: 10px 0; padding: 15px; border-radius: 10px;">
            <h3>${i + 1}. ${p.urgency === '高' ? '🔴' : '🟡'} ${p.title}</h3>
            <p style="color: #666;">${p.description}<br>
            👥 ${p.audience} | 📖 ${p.readTime}</p>
          </div>
        `).join('')}
        
        <p style="text-align: center; color: #666; margin-top: 20px;">
          💡 ヒント: "1 事例を3つ追加" のようにカスタマイズも可能
        </p>
      </div>
    </div>
  `;
  
  MailApp.sendEmail({
    to: CONFIG.recipientEmail,
    subject: `【LeadFive】${dateStr}のブログ提案 - 返信で選択`,
    htmlBody: htmlBody
  });
  
  // 提案を保存
  PropertiesService.getScriptProperties().setProperty('todayProposals', JSON.stringify(proposals));
}
```

1. このコードを **既存のコードの下に追加**
2. **Ctrl+S** で保存
3. 保存成功を確認

---

## ステップ3: 提案メールをテスト送信（1分）

1. 関数選択で **`sendDailyBlogProposals`** を選択
2. **▶️ 実行**
3. **Gmail を確認** → きれいな提案メールが届いているはず！

---

## ステップ4: 返信処理機能を追加（2分）

提案メールが届いたら、最後の機能を追加：

```javascript
// メール返信を処理
function processEmailReplies() {
  const threads = GmailApp.search('subject:"ブログ提案" is:unread from:me');
  
  threads.forEach(thread => {
    const messages = thread.getMessages();
    const lastMessage = messages[messages.length - 1];
    
    if (lastMessage.getFrom().includes(CONFIG.recipientEmail)) {
      const replyText = lastMessage.getPlainBody().split('\n')[0].trim();
      
      if (/^[1-3]/.test(replyText)) {
        const num = parseInt(replyText.charAt(0));
        const proposals = JSON.parse(PropertiesService.getScriptProperties().getProperty('todayProposals'));
        const selected = proposals[num - 1];
        
        // 確認メール送信
        MailApp.sendEmail({
          to: CONFIG.recipientEmail,
          subject: '✅ ブログ記事作成開始',
          htmlBody: `
            <div style="padding: 20px; font-family: Arial, sans-serif;">
              <h2>記事作成を開始しました！</h2>
              <p><strong>選択:</strong> ${selected.title}</p>
              <p>GitHub連携を設定すると自動投稿されます。</p>
            </div>
          `
        });
        
        lastMessage.markRead();
      }
    }
  });
}

// 自動実行の設定
function setupTriggers() {
  // 毎朝7時に提案送信
  ScriptApp.newTrigger('sendDailyBlogProposals')
    .timeBased()
    .atHour(7)
    .everyDays(1)
    .create();
    
  // 10分ごとに返信チェック
  ScriptApp.newTrigger('processEmailReplies')
    .timeBased()
    .everyMinutes(10)
    .create();
    
  // 完了通知
  MailApp.sendEmail({
    to: CONFIG.recipientEmail,
    subject: '✅ LeadFive Blog Assistant 設定完了',
    body: '毎朝7時にブログ提案が届きます！'
  });
}
```

---

## ステップ5: 自動実行を設定（1分）

1. 関数選択で **`setupTriggers`** を選択
2. **▶️ 実行**
3. 設定完了メールが届けばOK！

---

## 🎉 完了！

これで：
- ✅ 毎朝7時に提案メールが自動送信
- ✅ 返信で番号を送ると記事作成開始  
- ✅ 10分ごとに返信をチェック

## 💡 使い方テスト

1. 受信した提案メールに **「1」** と返信
2. 確認メールが届けばシステム正常動作中！

準備はできましたか？まずは `sendTestEmail` を実行してみましょう！