# Google Sheetsのみでお問い合わせフォーム設定ガイド

## 概要
Formspreeを使わずに、Google Sheets + Google Apps Script (GAS) のみでお問い合わせフォームを実装します。
受信したお問い合わせは自動的にスプレッドシートに記録され、`mail@lead-v.com` にメール通知されます。

## 設定手順（約10分）

### ステップ1: Google スプレッドシート作成

1. [Google Sheets](https://sheets.google.com) を開く
2. 「空白」をクリックして新規スプレッドシートを作成
3. スプレッドシート名を「LeadFive お問い合わせ管理」に変更

### ステップ2: Google Apps Script設定

1. スプレッドシートのメニューから「拡張機能」→「Apps Script」をクリック
2. 開いたエディタの内容をすべて削除
3. `gas-code.gs` の内容をコピーして貼り付け
4. ファイル名を「お問い合わせ受信システム」に変更
5. 「プロジェクトを保存」をクリック（Ctrl+S または Cmd+S）

### ステップ3: Web App として公開

1. Apps Scriptエディタで「デプロイ」→「新しいデプロイ」をクリック
2. 歯車アイコンをクリックして「ウェブアプリ」を選択
3. 以下の設定を行う：
   - **説明**: LeadFive Contact Form
   - **実行ユーザー**: 自分
   - **アクセスできるユーザー**: 全員
4. 「デプロイ」ボタンをクリック
5. 初回は権限の承認が必要：
   - 「アクセスを承認」をクリック
   - Googleアカウントを選択
   - 「詳細」をクリック→「お問い合わせ受信システム（安全ではないページ）に移動」
   - 「許可」をクリック
6. 表示されたWeb App URLをコピー
   ```
   例: https://script.google.com/macros/s/AKfycbxxxxxxxxxx/exec
   ```

### ステップ4: JavaScriptファイルを更新

1. `/assets/js/contact-handler-gas.js` を開く
2. 6行目のURLを更新：
   ```javascript
   this.gasEndpoint = 'YOUR_GAS_WEB_APP_URL';
   // ↓ コピーしたURLに変更
   this.gasEndpoint = 'https://script.google.com/macros/s/AKfycbxxxxxxxxxx/exec';
   ```

### ステップ5: HTMLファイルを更新

`/_layouts/default.html` の最後のscriptタグを変更：
```html
<!-- 変更前 -->
<script src="{{ site.baseurl }}/assets/js/contact-handler.js"></script>

<!-- 変更後 -->
<script src="{{ site.baseurl }}/assets/js/contact-handler-gas.js"></script>
```

### ステップ6: テスト

1. Apps Scriptエディタで `testDoPost` 関数を選択
2. 「実行」ボタンをクリック
3. 以下を確認：
   - スプレッドシートに「お問い合わせ」シートが作成される
   - テストデータが追加される
   - `mail@lead-v.com` にテストメールが届く

## トラブルシューティング

### メールが届かない場合
1. 迷惑メールフォルダを確認
2. GmailApp の1日の送信制限（100通）を超えていないか確認
3. Apps Scriptの実行ログを確認

### フォーム送信でエラーになる場合
1. Web App URLが正しくコピーされているか確認
2. デプロイの設定で「全員」が選択されているか確認
3. ブラウザのコンソールでエラーを確認

### スプレッドシートに記録されない場合
1. Apps Scriptの実行権限が正しく設定されているか確認
2. スプレッドシートの共有設定を確認

## 機能

- ✅ フォーム送信時に自動でスプレッドシートに記録
- ✅ 即座にメール通知（HTML形式）
- ✅ ステータス管理（未対応/対応中/完了）
- ✅ 送信元URL・日時の自動記録
- ✅ スパム対策（クライアント側バリデーション）

## カスタマイズ

### 通知先メールアドレスの変更
`gas-code.gs` の162行目を編集：
```javascript
const recipient = 'mail@lead-v.com'; // 変更したいアドレスに
```

### スプレッドシートの列を追加
`gas-code.gs` の51行目のheaders配列に追加：
```javascript
const headers = [
  '受信日時',
  'ステータス',
  // ... 既存の列 ...
  '新しい列名' // 追加
];
```

## セキュリティ考慮事項

- Google Apps Scriptは自動的にHTTPS通信
- スプレッドシートへのアクセスは制限可能
- レート制限あり（1分あたり20回まで）
- 送信データはすべてGoogleのサーバーで処理

## 完了！

これで設定は完了です。実際のフォームからテスト送信して動作を確認してください。