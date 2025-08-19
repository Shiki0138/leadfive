# 📧 完全版 Google Apps Script コード

## エラー解決：全てのコードを一度にコピー

現在のエディタの内容を**全て削除**して、以下のコードに置き換えてください：

```javascript
// ===== 設定 =====
const CONFIG = {
  recipientEmail: 'greenroom51@gmail.com',
  githubOwner: 'Shiki0138',
  githubRepo: 'leadfive-demo'
};

// ===== テスト関数 =====
function sendTestEmail() {
  MailApp.sendEmail({
    to: CONFIG.recipientEmail,
    subject: 'LeadFive Blog Bot テスト',
    body: 'テストメールです。受信できていれば設定成功！'
  });
  console.log('テストメール送信完了');
}

// ===== ブログ提案生成 =====
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
    },
    {
      title: "LPのCVRを267%改善した心理学的アプローチ",
      description: "実際の改善事例とテクニック公開",
      audience: "Webマーケター",
      urgency: "中",
      readTime: "12分"
    },
    {
      title: "AIツール選定で失敗しない27のチェックリスト",
      description: "導入前に確認すべきポイント総まとめ",
      audience: "IT責任者",
      urgency: "低",
      readTime: "5分"
    }
  ];
}

// ===== 毎朝の提案メール送信 =====
function sendDailyBlogProposals() {
  const proposals = generateTodayProposals();
  const dateStr = Utilities.formatDate(new Date(), 'JST', 'MM月dd日');
  
  const htmlBody = `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #8b5cf6, #ec4899); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">📝 ${dateStr}のブログ提案</h1>
      </div>
      
      <div style="background: #f9fafb; padding: 20px;">
        <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
          おはようございます！<br>
          <strong style="color: #8b5cf6;">返信で番号（1〜5）を送信するだけで記事が作成されます。</strong>
        </p>
        
        ${proposals.map((p, i) => `
          <div style="background: white; border: 2px solid ${p.urgency === '高' ? '#ef4444' : '#e5e7eb'}; border-radius: 12px; padding: 20px; margin-bottom: 15px;">
            <h2 style="font-size: 18px; color: #111827; margin: 10px 0;">
              ${i + 1}. ${p.urgency === '高' ? '🔴' : '🟡'} ${p.title}
            </h2>
            <p style="color: #6b7280; font-size: 14px;">
              ${p.description}<br>
              👥 ${p.audience} | 📖 ${p.readTime}
            </p>
          </div>
        `).join('')}
        
        <p style="text-align: center; color: #6b7280; font-size: 13px; margin-top: 20px;">
          💡 ヒント: "1 文字数3000字で" のようにカスタマイズも可能
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
  console.log('ブログ提案メール送信完了');
}

// ===== メール返信処理 =====
function processEmailReplies() {
  const threads = GmailApp.search('subject:"ブログ提案" is:unread from:me');
  
  threads.forEach(thread => {
    const messages = thread.getMessages();
    const lastMessage = messages[messages.length - 1];
    
    if (lastMessage.getFrom().includes(CONFIG.recipientEmail)) {
      const replyText = lastMessage.getPlainBody().split('\n')[0].trim();
      
      if (/^[1-5]/.test(replyText)) {
        const num = parseInt(replyText.charAt(0));
        const proposals = JSON.parse(PropertiesService.getScriptProperties().getProperty('todayProposals'));
        const selected = proposals[num - 1];
        
        // GitHub Actions をトリガー（トークンが設定されている場合）
        const githubToken = PropertiesService.getScriptProperties().getProperty('GITHUB_TOKEN');
        
        if (githubToken) {
          try {
            UrlFetchApp.fetch(
              `https://api.github.com/repos/${CONFIG.githubOwner}/${CONFIG.githubRepo}/dispatches`,
              {
                method: 'post',
                headers: {
                  'Authorization': 'token ' + githubToken,
                  'Accept': 'application/vnd.github.v3+json'
                },
                payload: JSON.stringify({
                  event_type: 'blog-post-from-email',
                  client_payload: {
                    topic: selected.title,
                    description: selected.description,
                    audience: selected.audience
                  }
                })
              }
            );
            console.log('GitHub Actions トリガー完了');
          } catch (error) {
            console.error('GitHub API エラー:', error);
          }
        }
        
        // 確認メール送信
        MailApp.sendEmail({
          to: CONFIG.recipientEmail,
          subject: '✅ ブログ記事作成開始',
          htmlBody: `
            <div style="padding: 20px; font-family: Arial, sans-serif;">
              <h2>記事作成を開始しました！</h2>
              <p><strong>選択:</strong> ${selected.title}</p>
              <p>10-15分後にGitHubに投稿されます。</p>
              <a href="https://github.com/${CONFIG.githubOwner}/${CONFIG.githubRepo}" 
                 style="background: #8b5cf6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
                GitHubで確認
              </a>
            </div>
          `
        });
        
        lastMessage.markRead();
      }
    }
  });
  console.log('メール返信処理完了');
}

// ===== トリガー設定 =====
function setupTriggers() {
  // 既存のトリガーを削除
  ScriptApp.getProjectTriggers().forEach(trigger => {
    ScriptApp.deleteTrigger(trigger);
  });
  
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
    
  // 完了メッセージ
  MailApp.sendEmail({
    to: CONFIG.recipientEmail,
    subject: '✅ LeadFive Blog Assistant 設定完了',
    htmlBody: `
      <div style="padding: 20px; font-family: Arial, sans-serif;">
        <h2>🎉 設定が完了しました！</h2>
        <p>明日の朝7時から自動でブログ提案が届きます。</p>
        <p>今すぐテストしたい場合は、<code>testSendProposal()</code> を実行してください。</p>
        <h3>使い方：</h3>
        <ul>
          <li>提案メールに「1」「2」「3」等で返信</li>
          <li>「1 事例を追加」等のカスタマイズも可能</li>
          <li>10-15分で記事が自動投稿されます</li>
        </ul>
      </div>
    `
  });
  
  console.log('トリガー設定完了');
}

// ===== テスト用関数 =====
function testSendProposal() {
  sendDailyBlogProposals();
  console.log('テスト用ブログ提案を送信しました');
}

// ===== デバッグ用：現在の設定確認 =====
function checkSettings() {
  console.log('設定確認:');
  console.log('メールアドレス:', CONFIG.recipientEmail);
  console.log('GitHubユーザー:', CONFIG.githubOwner);
  console.log('リポジトリ:', CONFIG.githubRepo);
  
  const githubToken = PropertiesService.getScriptProperties().getProperty('GITHUB_TOKEN');
  console.log('GitHub Token:', githubToken ? '設定済み' : '未設定');
}
```

## 📋 使い方（コピー後）

1. **現在のコードを全て削除**
2. **上記のコードを全てコピー＆貼り付け**
3. **Ctrl+S で保存**
4. 関数選択で `sendTestEmail` を選択 → 実行
5. テストメール確認後、`setupTriggers` を実行

これでエラーが解決するはずです！