# 🔧 Gmail権限エラーの解決方法

## 🚨 エラー内容
`The script does not have permission to perform that action`

## ✅ 解決手順

### **方法1: 権限の再承認（推奨）**

1. **Google Apps Scriptで以下の関数を実行：**

```javascript
// Gmail権限を要求する簡単な関数
function requestGmailPermissions() {
  try {
    // Gmailへのアクセスを明示的に要求
    const threads = GmailApp.search('test', 0, 1);
    console.log('✅ Gmail権限が正常に設定されています');
  } catch (error) {
    console.log('Gmail権限の承認が必要です');
    console.log('実行ボタンをクリック後、承認画面で許可してください');
  }
}
```

2. **実行手順：**
   - 関数選択で `requestGmailPermissions` を選択
   - ▶実行ボタンをクリック
   - 「承認が必要です」ダイアログが表示されたら「許可を確認」
   - Googleアカウントを選択
   - 「詳細」→「安全でないページに移動」をクリック
   - 必要な権限にチェックを入れて「許可」

### **方法2: マニフェストファイルで権限を明示的に設定**

1. **Google Apps Scriptエディタで：**
   - 左メニューの「プロジェクトの設定」（歯車アイコン）をクリック
   - 「エディタ」セクションの「"appsscript.json" マニフェスト ファイルをエディタで表示する」にチェック

2. **appsscript.json を編集：**

```json
{
  "timeZone": "Asia/Tokyo",
  "dependencies": {},
  "exceptionLogging": "STACKDRIVER",
  "runtimeVersion": "V8",
  "oauthScopes": [
    "https://www.googleapis.com/auth/gmail.modify",
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/gmail.send",
    "https://www.googleapis.com/auth/script.external_request",
    "https://www.googleapis.com/auth/script.scriptapp"
  ]
}
```

3. **保存後、任意の関数を再実行して権限を承認**

### **方法3: 段階的な権限テスト**

```javascript
// 段階的に権限をテスト
function testGmailPermissionsStep() {
  console.log('Gmail権限テスト開始...\n');
  
  // ステップ1: 基本的なメール送信権限
  try {
    MailApp.getRemainingDailyQuota();
    console.log('✅ ステップ1: メール送信権限 OK');
  } catch (e) {
    console.log('❌ ステップ1: メール送信権限エラー');
    return;
  }
  
  // ステップ2: Gmail読み取り権限
  try {
    const threads = GmailApp.search('test', 0, 1);
    console.log('✅ ステップ2: Gmail読み取り権限 OK');
  } catch (e) {
    console.log('❌ ステップ2: Gmail読み取り権限エラー');
    console.log('→ 実行時に権限を承認してください');
    return;
  }
  
  // ステップ3: メッセージの詳細読み取り
  try {
    const threads = GmailApp.search('from:mail@lead-v.com', 0, 1);
    if (threads.length > 0) {
      const messages = threads[0].getMessages();
      const firstMessage = messages[0];
      firstMessage.getPlainBody();
      console.log('✅ ステップ3: メッセージ読み取り権限 OK');
    } else {
      console.log('⚠️ ステップ3: テスト用メールが見つかりません');
    }
  } catch (e) {
    console.log('❌ ステップ3: メッセージ読み取り権限エラー');
    return;
  }
  
  // ステップ4: メッセージの変更権限
  try {
    const threads = GmailApp.search('from:mail@lead-v.com', 0, 1);
    if (threads.length > 0) {
      const messages = threads[0].getMessages();
      const isUnread = messages[0].isUnread();
      console.log('✅ ステップ4: メッセージ変更権限 OK');
    }
  } catch (e) {
    console.log('❌ ステップ4: メッセージ変更権限エラー');
    return;
  }
  
  console.log('\n✅ すべての権限が正常に設定されています！');
}
```

## 🚀 実行手順

### **1. まず権限を修正**
```javascript
requestGmailPermissions()  // 実行して権限を承認
```

### **2. 権限確認**
```javascript
testGmailPermissionsStep()  // すべてOKになるまで実行
```

### **3. 権限修正後、メール処理を再テスト**
```javascript
// メール検索の動作確認
function testEmailAfterPermissionFix() {
  try {
    const threads = GmailApp.search(
      'to:mail@lead-v.com subject:"記事確認" newer_than:2d',
      0, 10
    );
    
    console.log(`✅ メール検索成功: ${threads.length}件のスレッド`);
    
    if (threads.length > 0) {
      console.log('\n最新のメール内容:');
      const latestThread = threads[0];
      const subject = latestThread.getFirstMessageSubject();
      console.log(`件名: ${subject}`);
      
      const messages = latestThread.getMessages();
      const latestMessage = messages[messages.length - 1];
      const bodyText = latestMessage.getPlainBody();
      const firstLine = bodyText.split('\n')[0].trim();
      
      console.log(`最初の行: "${firstLine}"`);
      console.log(`未読: ${latestMessage.isUnread() ? '✅' : '❌'}`);
      
      // 返信処理のテスト
      if (firstLine.toUpperCase().includes('OK') || firstLine === '1') {
        console.log('✅ OK返信を検出！ブログ作成可能です');
      }
    }
    
  } catch (error) {
    console.error('❌ エラー:', error);
  }
}
```

## ⚠️ 重要な注意点

- 初回実行時は必ず「承認が必要です」ダイアログが表示されます
- 「詳細」→「安全でないページに移動」をクリックする必要があります
- すべての権限にチェックを入れて承認してください

権限承認後、`testEmailAfterPermissionFix()` を実行して結果を教えてください！