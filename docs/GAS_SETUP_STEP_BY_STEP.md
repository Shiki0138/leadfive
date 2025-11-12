# 🔧 Google Apps Script 完全セットアップガイド

## 🚨 「プロジェクトを保存できませんでした」エラーの解決

### 解決法1: 段階的セットアップ（推奨）

#### **ステップ1: 新しいプロジェクト作成**
1. **新しいタブで開く**: https://script.google.com
2. **「新しいプロジェクト」をクリック**
3. **プロジェクト名変更**: 左上「無題のプロジェクト」→「LeadFive AI Blog Assistant」

#### **ステップ2: 最小限のコードから開始**
既存の `myFunction()` を削除して、まず最小限のコードを貼り付け：

```javascript
// === 最初にこのコードだけ貼り付けて保存テスト ===
function testBasic() {
  console.log('Hello LeadFive!');
}

// 設定
const CONFIG = {
  recipientEmail: 'mail@lead-v.com',
  githubOwner: 'Shiki0138',
  githubRepo: 'leadfive',
  botName: 'LeadFive AI Blog Assistant'
};

// テストメール送信
function sendTestEmail() {
  MailApp.sendEmail({
    to: CONFIG.recipientEmail,
    subject: 'LeadFive Blog Bot テスト',
    body: 'システムが正常に動作しています！'
  });
  console.log('✅ テストメール送信完了');
}
```

**重要**: この段階で **Ctrl+S** で保存 → 成功を確認

#### **ステップ3: 保存成功後、機能を段階的に追加**

**A. まずトレンド分析機能を追加:**
```javascript
// 上記コードの下に追加

function getCurrentTrendingTopics() {
  return [
    {
      keyword: "ChatGPT-4 Turbo",
      searchVolume: 120000,
      category: "AI技術",
      buzzScore: 95,
      relevantTo: ["AIマーケティング", "業務効率化"]
    },
    {
      keyword: "AI画像生成 商用利用",
      searchVolume: 89000,
      category: "AI実用化",
      buzzScore: 88,
      relevantTo: ["コンテンツ制作", "美容業界"]
    }
  ];
}

function testTrendAnalysis() {
  const trends = getCurrentTrendingTopics();
  console.log('トレンド分析結果:', trends);
  return trends;
}
```

保存 → 成功確認 → 次へ

**B. ターゲット分析機能を追加:**
```javascript
// 上記コードの下に追加

function getTargetAudienceInsights() {
  return {
    "中小企業経営者": {
      currentConcerns: ["人手不足解決", "デジタル変革", "コスト削減"],
      engagementTriggers: ["具体的数値", "事例", "即効性"],
      buzzElements: ["○○で売上3倍", "たった○分で", "無料で始める"]
    },
    "マーケター": {
      currentConcerns: ["AI活用", "ROI改善", "新チャネル開拓"],
      engagementTriggers: ["最新手法", "データ根拠", "競合差別化"],
      buzzElements: ["業界初", "○○%改善", "秘密の手法"]
    }
  };
}
```

保存確認 → 次へ

**C. 最後にメール送信機能を追加:**
```javascript
// 簡易版AI提案メール
function sendSimpleAIProposal() {
  const trends = getCurrentTrendingTopics();
  const targets = getTargetAudienceInsights();
  const dateStr = Utilities.formatDate(new Date(), 'JST', 'MM月dd日');
  
  const htmlBody = `
    <h1>🚀 ${dateStr}のAI最適化提案</h1>
    <h2>今日のトレンド</h2>
    <ul>
      ${trends.map(trend => `<li><strong>${trend.keyword}</strong> (バズ度: ${trend.buzzScore})</li>`).join('')}
    </ul>
    <p><strong>返信方法:</strong> このメールに「1」「2」等で返信してください</p>
  `;
  
  MailApp.sendEmail({
    to: CONFIG.recipientEmail,
    subject: `🚀【LeadFive AI】${dateStr}の提案`,
    htmlBody: htmlBody,
    name: CONFIG.botName
  });
  
  console.log('✅ 簡易AI提案メール送信完了');
}
```

---

## 🔑 APIキー設定の正しい方法

### **方法1: Google Apps Scriptの画面から設定（簡単）**

1. **Google Apps Script画面で:**
   - 左メニューの **「プロジェクトの設定」**（歯車アイコン）をクリック
   - **「スクリプト プロパティ」**セクションまでスクロール
   - **「スクリプト プロパティを追加」**をクリック

2. **設定する内容:**
   ```
   プロパティ: ANTHROPIC_API_KEY
   値: sk-ant-api03-xxxxxxxxxx（あなたの実際のAPIキー）
   
   プロパティ: SERPAPI_KEY  
   値: xxxxxxxxxx（SerpAPIキー、オプション）
   
   プロパティ: GITHUB_TOKEN
   値: ghp_xxxxxxxxxx（GitHubトークン）
   ```

3. **保存**をクリック

### **方法2: コードで設定（1回だけ実行）**

**重要**: 設定後は必ずこの関数を削除してください（セキュリティ）

```javascript
// 🚨 1回実行後に削除！
function setAPIKeysOnce() {
  // Anthropic APIキー設定
  PropertiesService.getScriptProperties().setProperty(
    'ANTHROPIC_API_KEY', 
    'sk-ant-api03-あなたの実際のキー' // ← ここに貼り付け
  );
  
  // GitHub Token設定
  PropertiesService.getScriptProperties().setProperty(
    'GITHUB_TOKEN', 
    'ghp_あなたの実際のトークン' // ← ここに貼り付け
  );
  
  // SerpAPIキー（オプション）
  PropertiesService.getScriptProperties().setProperty(
    'SERPAPI_KEY',
    'あなたのSerpAPIキー' // ← 持っていれば設定、なければコメントアウト
  );
  
  console.log('✅ APIキー設定完了');
  console.log('🚨 セキュリティ上、この関数は削除してください');
}
```

**実行手順:**
1. 上記関数を追加して保存
2. 関数選択ドロップダウンで「setAPIKeysOnce」を選択
3. ▶実行ボタンをクリック
4. **実行後、この関数を削除** （重要！）

---

## 🧪 段階的テスト手順

### **テスト1: 基本機能**
```javascript
// 実行: testBasic
function testBasic() {
  console.log('Hello LeadFive!');
}
```

### **テスト2: メール送信**
```javascript
// 実行: sendTestEmail  
// → Gmailに「システムが正常に動作しています！」が届くか確認
```

### **テスト3: AI提案**
```javascript
// 実行: sendSimpleAIProposal
// → 美しいAI提案メールが届くか確認
```

### **テスト4: 設定確認**
```javascript
function checkMySettings() {
  const anthropicKey = PropertiesService.getScriptProperties().getProperty('ANTHROPIC_API_KEY');
  const githubToken = PropertiesService.getScriptProperties().getProperty('GITHUB_TOKEN');
  
  console.log('Anthropic API:', anthropicKey ? '✅設定済み' : '❌未設定');
  console.log('GitHub Token:', githubToken ? '✅設定済み' : '❌未設定');
}
```

---

## 🚨 よくあるエラーと解決法

### **エラー1: "プロジェクトを保存できませんでした"**
**解決法:**
- ブラウザを更新 (F5)
- シークレットモードで試す
- 段階的にコードを追加（一度に全部貼らない）

### **エラー2: "承認が必要です"**
**解決法:**
1. 「許可を確認」をクリック
2. Googleアカウントを選択
3. 「詳細」→「安全ではないページに移動」
4. 「許可」をクリック

### **エラー3: "MailApp.sendEmail is not defined"**
**解決法:**
- Gmail APIが有効になっていない
- Google Apps Scriptの権限が不足

---

## 📝 推奨セットアップフロー

```
1. 新しいプロジェクト作成
   ↓
2. 最小限コード貼り付け・保存
   ↓  
3. testBasic() 実行確認
   ↓
4. APIキー設定（画面から推奨）
   ↓
5. sendTestEmail() 実行確認
   ↓
6. 段階的に機能追加
   ↓
7. sendSimpleAIProposal() 実行確認
   ↓
8. フル機能版に置き換え
```

---

どのステップで問題が発生していますか？エラーメッセージがあれば教えてください！