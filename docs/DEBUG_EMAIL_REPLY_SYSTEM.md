# 🔍 メール返信システム診断ガイド

## 🚨 現状確認：メール返信後にブログ投稿されない

### 考えられる原因と解決法

## 1. **Google Apps Script側の問題**

### **原因1: メール返信処理が動作していない**

**確認方法:**
Google Apps Scriptで以下を実行：

```javascript
// メール返信処理の手動テスト
function testEmailProcessing() {
  console.log('🧪 メール処理テスト開始...');
  processEmailReplies(); // または processDailyConfirmationReplies()
  console.log('✅ メール処理テスト完了');
}
```

**ログで確認すべき内容:**
- `📬 検索結果: X件のスレッド` → 0件の場合は検索条件に問題
- `🔍 返信内容: "OK"` → 返信が検出されているか
- `✅ 記事作成開始` → GitHub Actionsトリガー実行されているか

### **原因2: 検索条件が厳しすぎる**

現在の検索条件を緩和：

```javascript
// 検索条件を緩和したバージョン
function processEmailRepliesLoose() {
  try {
    // より広い検索条件
    const threads = GmailApp.search(
      `from:mail@lead-v.com is:unread newer_than:2d`,
      0, 20
    );
    
    console.log(`📬 緩和検索結果: ${threads.length}件のスレッド`);
    
    threads.forEach((thread, threadIndex) => {
      const messages = thread.getMessages();
      console.log(`📧 スレッド${threadIndex + 1}: ${messages.length}件のメッセージ`);
      
      // 最新のメッセージを確認
      const latestMessage = messages[messages.length - 1];
      const bodyText = latestMessage.getPlainBody();
      const replyContent = bodyText.split('\\n')[0].trim().toUpperCase();
      
      console.log(`🔍 最新メッセージ内容: "${replyContent}"`);
      
      // 返信パターン検出
      if (replyContent.includes('OK') || replyContent === '1') {
        console.log('✅ OK返信を検出');
        const customInstruction = replyContent.replace(/^OK\s*/i, '').trim();
        
        // 手動でブログ作成をトリガー
        const success = createPremiumBlogPost(customInstruction);
        if (success) {
          latestMessage.markRead();
          console.log('✅ ブログ作成処理完了');
        }
        return;
      }
    });
  } catch (error) {
    console.error('❌ 緩和検索エラー:', error);
  }
}
```

### **原因3: GitHub Token の権限不足**

**確認方法:**
```javascript
function testGitHubConnection() {
  const githubToken = PropertiesService.getScriptProperties().getProperty('GITHUB_TOKEN');
  
  if (!githubToken) {
    console.log('❌ GitHub Token未設定');
    return;
  }
  
  try {
    const response = UrlFetchApp.fetch(
      'https://api.github.com/repos/Shiki0138/leadfive/dispatches',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        payload: JSON.stringify({
          event_type: 'test-connection',
          client_payload: {
            test: true,
            timestamp: new Date().toISOString()
          }
        })
      }
    );
    
    console.log('GitHub API Response Code:', response.getResponseCode());
    console.log('GitHub API Response:', response.getContentText());
    
    if (response.getResponseCode() === 204) {
      console.log('✅ GitHub接続成功');
    } else {
      console.log('❌ GitHub接続失敗');
    }
  } catch (error) {
    console.error('❌ GitHub接続エラー:', error);
  }
}
```

## 2. **GitHub Actions側の問題**

### **原因1: repository_dispatch が届いていない**

**確認方法:**
GitHub リポジトリ → Settings → Webhooks で Delivery を確認

### **原因2: Secrets設定が不完全**

**必要なSecrets:**
```
ANTHROPIC_API_KEY: sk-ant-api03-xxx
UNSPLASH_ACCESS_KEY: xxx (新規追加が必要)
GITHUB_TOKEN: 自動設定済み
```

**確認方法:**
リポジトリ → Settings → Secrets and variables → Actions

## 3. **完全診断スクリプト**

Google Apps Scriptに以下を追加して実行：

```javascript
// ===== 🩺 完全診断システム =====
function fullSystemDiagnosis() {
  console.log('🩺 システム完全診断開始...');
  
  // 1. API キー確認
  console.log('\\n1. API キー確認:');
  const anthropicKey = PropertiesService.getScriptProperties().getProperty('ANTHROPIC_API_KEY');
  const githubToken = PropertiesService.getScriptProperties().getProperty('GITHUB_TOKEN');
  const unsplashKey = PropertiesService.getScriptProperties().getProperty('UNSPLASH_ACCESS_KEY');
  
  console.log('Anthropic API:', anthropicKey ? '✅設定済み' : '❌未設定');
  console.log('GitHub Token:', githubToken ? '✅設定済み' : '❌未設定');
  console.log('Unsplash Key:', unsplashKey ? '✅設定済み' : '❌未設定');
  
  // 2. メール検索テスト
  console.log('\\n2. メール検索テスト:');
  try {
    const threads = GmailApp.search('from:mail@lead-v.com newer_than:1d', 0, 5);
    console.log(`📧 過去24時間のメール: ${threads.length}件`);
    
    if (threads.length > 0) {
      const latestThread = threads[0];
      const messages = latestThread.getMessages();
      const latestMessage = messages[messages.length - 1];
      const bodyText = latestMessage.getPlainBody();
      
      console.log('最新メッセージの最初の行:', bodyText.split('\\n')[0]);
      console.log('未読かどうか:', latestMessage.isUnread() ? '✅未読' : '❌既読');
    }
  } catch (error) {
    console.error('メール検索エラー:', error);
  }
  
  // 3. GitHub接続テスト
  console.log('\\n3. GitHub接続テスト:');
  testGitHubConnection();
  
  // 4. トリガー確認
  console.log('\\n4. アクティブトリガー確認:');
  const triggers = ScriptApp.getProjectTriggers();
  console.log(`アクティブトリガー数: ${triggers.length}件`);
  triggers.forEach(trigger => {
    console.log(`- ${trigger.getHandlerFunction()}: ${trigger.getEventType()}`);
  });
  
  console.log('\\n🩺 診断完了');
}

// 緊急時手動実行
function emergencyManualBlogCreation() {
  console.log('🚨 緊急手動ブログ作成...');
  
  const testProposal = {
    topic: "ChatGPT-4でマーケティング戦略を革新する5つの方法",
    weeklyTheme: "ChatGPT活用週間",
    focus: "AIマーケティング"
  };
  
  const success = createPremiumBlogPost("テスト投稿");
  console.log('手動作成結果:', success ? '✅成功' : '❌失敗');
}
```

## 📋 **即座に実行すべき診断手順**

1. **Google Apps Scriptで `fullSystemDiagnosis()` を実行**
2. **ログを確認してどこで止まっているか特定**
3. **問題箇所に応じた対策を実施**
4. **`emergencyManualBlogCreation()` でテスト投稿**

## 🎯 **よくある解決パターン**

### **パターン1: メール検索条件が厳しい**
→ `processEmailRepliesLoose()` を使用

### **パターン2: GitHub Token権限不足**
→ リポジトリの Settings → Actions → General → Workflow permissions を "Read and write permissions" に変更

### **パターン3: Unsplash APIキー未設定**
→ GitHub Secrets に `UNSPLASH_ACCESS_KEY` を追加

診断結果を教えてください！