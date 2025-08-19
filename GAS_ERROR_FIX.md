# Google Apps Script エラー解決方法

## エラー内容
```
ReferenceError: document is not defined
```

## 原因
Google Apps Scriptに誤って**ブラウザ用のJavaScriptコード**（contact.jsなど）が貼り付けられています。

## 解決手順

### 1. 現在のコードを削除
Google Apps Scriptエディタで：
1. 全てのコードを選択（Ctrl+A または Cmd+A）
2. 削除

### 2. 正しいコードを貼り付け
以下のいずれかのファイルの内容を**全て**コピー＆ペースト：

- `gas-code.gs`（通常版）
- `gas-code-debug.gs`（デバッグ版 - 推奨）

### 3. 保存
- ファイル → 保存（Ctrl+S または Cmd+S）

### 4. 再デプロイ
1. デプロイ → デプロイを管理
2. 編集（鉛筆アイコン）をクリック
3. バージョン: 「新バージョン」を選択
4. 説明: 「エラー修正」
5. デプロイ

### 5. テスト実行
1. 関数選択: `testDoPost`
2. 実行ボタンをクリック
3. 実行ログでエラーがないか確認

## 正しいコードの確認方法

Google Apps Scriptのコードには以下の特徴があります：
- `document`、`window`、`alert`などのブラウザAPIは使用しない
- `SpreadsheetApp`、`GmailApp`などのGAS専用APIを使用
- `doPost(e)`、`doGet(e)`などの関数を含む

## よくある間違い

| 間違い | 正しい対応 |
|--------|-----------|
| contact.js を貼り付け | gas-code.gs を貼り付け |
| contact-handler.js を貼り付け | gas-code.gs を貼り付け |
| HTMLファイルを貼り付け | gas-code.gs を貼り付け |

## 確認コマンド

正しいコードが貼り付けられているか確認：
```javascript
function checkCode() {
  console.log('GASコードが正しく設定されています');
  console.log('スプレッドシート:', SpreadsheetApp.getActiveSpreadsheet().getName());
}
```

このコードを追加して実行し、エラーが出なければ正しく設定されています。