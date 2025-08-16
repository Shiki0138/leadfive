# 📧 Gmail ブログ自動投稿 - クイックセットアップガイド

## 🚀 15分で完了！3つのステップ

### ステップ1：Google Apps Script プロジェクト作成（3分）

1. **[ここをクリック](https://script.google.com/home/projects/create)** して新規プロジェクト作成
   
2. プロジェクト名を変更：
   - 左上の「無題のプロジェクト」をクリック
   - 「LeadFive Blog Assistant」に変更

3. デフォルトのコードを全て削除

---

### ステップ2：コードをコピー＆設定（5分）

1. 以下のコードを **全てコピー** してエディタに貼り付け：

```javascript
// ===== 設定（ここだけ変更） =====
const CONFIG = {
  recipientEmail: 'あなたのGmail@gmail.com', // ← あなたのGmailアドレスに変更
  githubOwner: 'あなたのGitHubユーザー名',    // ← GitHubユーザー名に変更
  githubRepo: 'leadfive-demo'
};

// ===== メイン機能 =====

// 毎朝7時に実行される関数
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
}

// 今日の提案を生成
function generateTodayProposals() {
  const day = new Date().getDay();
  const themes = [
    '戦略的思考', '週始めの計画', '実践テクニック', 
    'データ分析', 'トレンド', '成果共有', '学習コンテンツ'
  ];
  
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

// メール返信を処理（10分ごとに実行）
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
        
        // GitHub Actions をトリガー
        const githubToken = PropertiesService.getScriptProperties().getProperty('GITHUB_TOKEN');
        
        if (githubToken) {
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
        }
        
        // 確認メール送信
        MailApp.sendEmail({
          to: CONFIG.recipientEmail,
          subject: '✅ ブログ記事作成開始',
          htmlBody: `
            <div style="padding: 20px; font-family: Arial, sans-serif;">
              <h2>記事作成を開始しました！</h2>
              <p>選択: ${selected.title}</p>
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
}

// 初期設定（最初に1回だけ実行）
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
      <div style="padding: 20px;">
        <h2>設定が完了しました！</h2>
        <p>明日の朝7時から自動でブログ提案が届きます。</p>
        <p>今すぐテストしたい場合は、Google Apps Script で<br>
        <code>testSendProposal()</code> を実行してください。</p>
      </div>
    `
  });
}

// テスト送信
function testSendProposal() {
  sendDailyBlogProposals();
  SpreadsheetApp.getUi().alert('テストメールを送信しました！受信トレイを確認してください。');
}
```

2. **CONFIG部分を編集**：
   ```javascript
   recipientEmail: 'あなたのメール@gmail.com',  // ← 変更
   githubOwner: 'あなたのユーザー名',           // ← 変更
   ```

3. **保存**（Ctrl+S または Cmd+S）

---

### ステップ3：GitHub Token 設定と実行（7分）

#### A. GitHub Token を作成

1. [GitHub Settings](https://github.com/settings/tokens/new) を開く
2. 以下を設定：
   - **Note**: LeadFive Blog Bot
   - **Expiration**: 90 days
   - **権限**: 
     - ✅ repo（全て）
     - ✅ workflow
3. 「Generate token」→ トークンをコピー

#### B. Google Apps Script に戻って設定

1. **プロジェクトの設定**（歯車アイコン⚙️）をクリック
2. **スクリプト プロパティ** までスクロール
3. **プロパティを追加**：
   - プロパティ: `GITHUB_TOKEN`
   - 値: `コピーしたトークン`
4. 保存

#### C. 初期設定を実行

1. 関数選択で `setupTriggers` を選択
2. ▶️ 実行ボタンをクリック
3. 権限の承認：
   - 「権限を確認」
   - アカウント選択
   - 「詳細」→「安全ではないページに移動」
   - 「許可」

---

## ✅ 完了！

設定完了メールが届いたら成功です！

### 今すぐテストする場合

1. 関数選択で `testSendProposal` を選択
2. ▶️ 実行
3. Gmailを確認

### 使い方

**受信したメールに返信**：
- `1` → 1番の記事を作成
- `2` → 2番の記事を作成
- `1 事例を3つ追加` → カスタマイズ付き

---

## ❓ うまくいかない時は

### メールが届かない
- 迷惑メールフォルダを確認
- CONFIG のメールアドレスを確認

### エラーが出る
- GitHub Token が正しくコピーされているか確認
- GitHubユーザー名が正しいか確認

### 返信が処理されない  
- 返信は本文の最初に番号を記載
- HTMLではなくテキスト形式で返信

---

## 🎉 これで毎朝7時が楽しみに！

明日から自動でブログ提案が届きます。返信するだけで高品質な記事が投稿されます！