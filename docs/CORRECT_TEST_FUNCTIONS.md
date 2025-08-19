# ✅ 正しいテスト関数

## 🔍 プレミアムシステムの正しい関数名

### **メール処理テスト**

```javascript
// 正しいテスト関数
function testEmailProcessing() {
  console.log('🧪 メール処理テスト開始...');
  processDailyConfirmationReplies();  // ← これが正しい関数名
  console.log('✅ メール処理テスト完了');
}
```

### **緩和検索バージョン**

```javascript
// メール検索を緩和したテスト
function testEmailSearchLoose() {
  try {
    // より広い検索条件で確認
    const threads = GmailApp.search(
      `from:greenroom51@gmail.com newer_than:2d`,
      0, 10
    );
    
    console.log(`📬 メール検索結果: ${threads.length}件のスレッド`);
    
    threads.forEach((thread, index) => {
      const messages = thread.getMessages();
      const subject = thread.getFirstMessageSubject();
      
      console.log(`\nスレッド${index + 1}: ${subject}`);
      console.log(`メッセージ数: ${messages.length}`);
      
      // 最新メッセージの内容を確認
      const latestMessage = messages[messages.length - 1];
      const from = latestMessage.getFrom();
      const bodyText = latestMessage.getPlainBody();
      const firstLine = bodyText.split('\n')[0].trim();
      
      console.log(`送信者: ${from}`);
      console.log(`未読: ${latestMessage.isUnread() ? '✅' : '❌'}`);
      console.log(`最初の行: "${firstLine}"`);
    });
    
  } catch (error) {
    console.error('❌ メール検索エラー:', error);
  }
}
```

### **手動でブログ作成トリガー**

```javascript
// 手動でプレミアムブログ作成をテスト
function testManualBlogCreation() {
  console.log('🚨 手動ブログ作成テスト開始...');
  
  // 今日の提案データを手動で作成
  const testProposal = {
    topic: "ChatGPT-4でマーケティング戦略を革新する5つの方法",
    weeklyTheme: "ChatGPT活用週間",
    focus: "AIマーケティング",
    aiSuggestion: {
      mainKeyword: "ChatGPT マーケティング",
      searchVolume: "15,400/月",
      difficulty: 7,
      relatedKeywords: ["AI活用", "マーケティング自動化"],
      outline: [
        {
          heading: "🎯 なぜ今、ChatGPTマーケティングなのか",
          description: "現状の問題点と機会の提示"
        },
        {
          heading: "💡 5つの革新的活用方法",
          description: "具体的手法を段階的に説明"
        }
      ]
    }
  };
  
  // 提案を保存
  const proposalId = `test_${new Date().getTime()}`;
  PropertiesService.getScriptProperties().setProperty(proposalId, JSON.stringify(testProposal));
  PropertiesService.getScriptProperties().setProperty('latestDailyProposal', proposalId);
  
  // ブログ作成実行
  const success = createPremiumBlogPost("テスト実行");
  
  if (success) {
    console.log('✅ ブログ作成成功！GitHubを確認してください');
  } else {
    console.log('❌ ブログ作成失敗');
  }
}
```

### **GitHub接続確認**

```javascript
// GitHub API接続テスト
function testGitHubAPI() {
  const githubToken = PropertiesService.getScriptProperties().getProperty('GITHUB_TOKEN');
  
  if (!githubToken) {
    console.log('❌ GitHub Token未設定');
    return;
  }
  
  console.log('GitHub Token: ✅ 設定済み');
  
  try {
    // テスト用のdispatchイベント送信
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
          event_type: 'create-blog-post',
          client_payload: {
            title: 'テスト記事投稿',
            description: 'GitHub Actions接続テスト',
            category: 'AIマーケティング',
            target: 'テスト',
            keywords: ['test'],
            customInstruction: 'テスト投稿',
            content: '# テスト記事\n\nこれはテスト投稿です。',
            timestamp: new Date().toISOString()
          }
        }),
        muteHttpExceptions: true
      }
    );
    
    const responseCode = response.getResponseCode();
    console.log('Response Code:', responseCode);
    
    if (responseCode === 204) {
      console.log('✅ GitHub Actions トリガー成功！');
      console.log('→ GitHubのActionsタブを確認してください');
    } else {
      console.log('❌ GitHub API エラー');
      console.log('Response:', response.getContentText());
    }
    
  } catch (error) {
    console.error('❌ GitHub接続エラー:', error);
    console.error('詳細:', error.toString());
  }
}
```

### **総合診断（改良版）**

```javascript
// 改良版システム診断
function systemCheck() {
  console.log('🩺 システム診断開始...\n');
  
  // 1. 設定確認
  console.log('=== 1. API設定確認 ===');
  const keys = ['ANTHROPIC_API_KEY', 'GITHUB_TOKEN', 'UNSPLASH_ACCESS_KEY'];
  keys.forEach(key => {
    const value = PropertiesService.getScriptProperties().getProperty(key);
    console.log(`${key}: ${value ? '✅ 設定済み' : '❌ 未設定'}`);
  });
  
  // 2. トリガー確認
  console.log('\n=== 2. トリガー設定 ===');
  const triggers = ScriptApp.getProjectTriggers();
  if (triggers.length === 0) {
    console.log('⚠️ トリガーが設定されていません');
    console.log('→ setupPremiumScheduling() を実行してください');
  } else {
    triggers.forEach(trigger => {
      console.log(`✅ ${trigger.getHandlerFunction()} - ${trigger.getEventType()}`);
    });
  }
  
  // 3. 最新のメール確認
  console.log('\n=== 3. 最新メール確認 ===');
  testEmailSearchLoose();
  
  console.log('\n診断完了！');
}
```

## 📋 実行手順

**以下の順番で実行してください：**

1. `systemCheck()` - システム全体の診断
2. `testEmailSearchLoose()` - メールが正しく検索されるか確認
3. `testGitHubAPI()` - GitHub接続テスト
4. `testManualBlogCreation()` - 手動でブログ作成

各実行結果を教えてください！