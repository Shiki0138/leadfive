# Google Apps Script テスト手順

## 1. テスト関数の実行

Google Apps Scriptエディタで以下の手順を実行してください：

1. **関数選択**
   - 上部のドロップダウンから `testDoPost` を選択

2. **実行**
   - 実行ボタン（▶）をクリック

3. **初回実行時の承認**
   - 「承認が必要です」と表示されたら「権限を確認」
   - Googleアカウントを選択
   - 「詳細」をクリック
   - 「安全でないページに移動」をクリック
   - 必要な権限を許可

## 2. 実行結果の確認

### A. 実行ログを確認
- 表示 → 実行ログ
- エラーメッセージを確認

### B. スプレッドシートを確認
- 「お問い合わせ」シートが作成されているか
- テストデータが入力されているか

## 3. よくあるエラーと対処法

### エラー1: TypeError: Cannot read property 'postData' of undefined
**原因**: 直接実行時は正常
**対処**: このエラーは無視してOK（テスト実行時のみ発生）

### エラー2: Exception: You do not have permission to call SpreadsheetApp.getActiveSpreadsheet
**原因**: 権限不足
**対処**: 
1. 承認プロセスを完了する
2. スプレッドシートから Apps Script を開き直す

### エラー3: Exception: Cannot call SpreadsheetApp.getActiveSpreadsheet() from this context
**原因**: スタンドアロンのスクリプト
**対処**: 
1. スプレッドシートを開く
2. 拡張機能 → Apps Script
3. コードを貼り付けて保存

## 4. 簡易デバッグコードの追加

以下のコードをGASに追加して、リクエストをログに記録：

```javascript
function doPost(e) {
  // デバッグ用ログ
  console.log('リクエスト受信:', new Date().toLocaleString('ja-JP'));
  console.log('postData:', e.postData);
  console.log('contents:', e.postData.contents);
  
  try {
    // 既存のコード...
    const data = JSON.parse(e.postData.contents);
    
    // デバッグ用ログ
    console.log('パースしたデータ:', data);
    
    // 以下既存のコード...
  } catch (error) {
    console.error('エラー発生:', error);
    // エラー内容も返す
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: error.toString(),
        stack: error.stack
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

## 5. 実行ログの確認方法

1. Apps Script エディタで
2. 表示 → 実行ログ
3. 直近のログを確認

## 6. 別の確認方法

ブラウザで直接GAS URLにアクセス：
```
https://script.google.com/macros/s/AKfycbxufN4CPujE75vKqgeMqKMhumfFm9HE4j4pN0sZMSaKJGXS7wP5vp6P1d5jKgz8LIne/exec
```

「スクリプト関数が見つかりません: doGet」と表示されれば、デプロイは成功しています。

## 7. 再デプロイが必要な場合

1. コードを修正・保存
2. デプロイ → デプロイを管理
3. 編集（鉛筆アイコン）
4. バージョン: 「新バージョン」
5. 説明: 「デバッグ追加」など
6. デプロイ

新しいURLが発行された場合は、contact-handler-gas.js を更新してください。