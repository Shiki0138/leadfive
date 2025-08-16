# 🔧 Google Apps Script 保存エラーの解決方法

## エラー: "プロジェクトを保存できませんでした"

### 解決法1: 手動保存（最も簡単）

1. **Ctrl+S**（Windows）または **Cmd+S**（Mac）を押す
2. または **ファイル** → **保存** をクリック
3. 保存が完了するまで少し待つ

---

### 解決法2: ブラウザをリフレッシュ

1. **F5** または **Ctrl+R** でページを更新
2. コードが残っているか確認
3. 再度保存を試す

---

### 解決法3: 新しいプロジェクトで再作成（確実）

#### A. 新規プロジェクト作成
1. **[新しいプロジェクトを作成](https://script.google.com/home/projects/create)**
2. プロジェクト名: `LeadFive Blog Assistant v2`

#### B. コードを段階的に追加
**まず基本設定だけ追加：**

```javascript
// 基本設定
const CONFIG = {
  recipientEmail: 'greenroom51@gmail.com',
  githubOwner: 'Shiki0138',
  githubRepo: 'leadfive-demo'
};

// テスト関数
function myFunction() {
  console.log('Hello World!');
}
```

1. このコードを貼り付け
2. **Ctrl+S** で保存
3. 保存成功を確認

#### C. メイン機能を追加
保存が成功したら、以下を追加：

```javascript
// 今日の提案を生成
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
    }
  ];
}
```

保存 → 成功を確認

#### D. メール送信機能を追加
```javascript
// 毎朝7時に実行される関数
function sendDailyBlogProposals() {
  const proposals = generateTodayProposals();
  const dateStr = Utilities.formatDate(new Date(), 'JST', 'MM月dd日');
  
  const htmlBody = `
    <h1>📝 ${dateStr}のブログ提案</h1>
    <p>返信で番号を送信してください：</p>
    ${proposals.map((p, i) => `
      <div>
        <h3>${i + 1}. ${p.title}</h3>
        <p>${p.description}</p>
      </div>
    `).join('')}
  `;
  
  MailApp.sendEmail({
    to: CONFIG.recipientEmail,
    subject: `【LeadFive】${dateStr}のブログ提案`,
    htmlBody: htmlBody
  });
}
```

保存 → 成功を確認

#### E. 残りの機能を追加
最後にその他の機能（processEmailReplies, setupTriggers等）を追加

---

### 解決法4: ブラウザ設定の確認

#### A. Cookieとキャッシュを削除
**Chrome の場合：**
1. **Ctrl+Shift+Delete**
2. **期間**: 過去1時間
3. **✅ Cookieとサイトデータ**
4. **✅ キャッシュされた画像とファイル**
5. **データを削除**

#### B. 拡張機能を無効化
1. Chrome → その他のツール → 拡張機能
2. 広告ブロッカーなどを一時的に無効化

#### C. シークレットモードで試す
1. **Ctrl+Shift+N**（シークレット）
2. [script.google.com](https://script.google.com) にアクセス
3. 再度試す

---

### 解決法5: 別のブラウザを使用

#### おすすめブラウザ順：
1. **Chrome**（最も安定）
2. **Edge** 
3. **Firefox**

---

## 🚨 緊急回避策：シンプル版

とりあえず動かしたい場合は、この最小版から始める：

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
    subject: '設定完了',
    body: '明日から7時にブログ提案が届きます！'
  });
}
```

この最小版で保存 → 実行 → 成功したら機能を追加

---

## ✅ 推奨アプローチ

**最も確実な方法：**
1. 新しいプロジェクト作成
2. 最小版のコードから開始
3. 段階的に機能追加
4. 各段階で保存確認

どの方法を試しますか？