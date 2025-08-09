# お問い合わせフォーム設定ガイド

## 概要
このドキュメントでは、LeadFiveのお問い合わせフォームの設定方法について説明します。
フォームからの送信は以下の2つの方法で受信できます：

1. **Formspree経由でメール送信** (推奨)
2. **Google Sheets自動登録 + メール通知**

## 1. Formspree設定（推奨）

### ステップ1: Formspreeアカウント作成
1. [Formspree](https://formspree.io/)にアクセス
2. 無料アカウントを作成（月50件まで無料）
3. 新しいフォームを作成

### ステップ2: フォーム設定
1. Formspreeダッシュボードで「New Form」をクリック
2. フォーム名を「LeadFive Contact Form」に設定
3. 通知先メールアドレスに `leadfive.138@gmail.com` を設定
4. 生成されたForm IDをコピー（例：`xkgwrrqv`）

### ステップ3: コードに反映
```javascript
// /assets/js/contact-handler.js の以下の行を更新
this.formspreeEndpoint = 'https://formspree.io/f/YOUR_FORM_ID';
// ↓
this.formspreeEndpoint = 'https://formspree.io/f/xkgwrrqv'; // あなたのForm IDに置き換え
```

### ステップ4: カスタム設定（オプション）
Formspreeダッシュボードで以下の設定が可能：
- 自動返信メールの設定
- スパムフィルターの設定
- Webhook連携
- カスタムリダイレクト

## 2. Google Sheets連携設定

### ステップ1: Googleスプレッドシート作成
1. [Google Sheets](https://sheets.google.com)で新規スプレッドシートを作成
2. シート名を「LeadFive お問い合わせ管理」に設定
3. 以下のヘッダーを1行目に追加：
   - A1: 受信日時
   - B1: 会社名
   - C1: お名前
   - D1: メールアドレス
   - E1: 電話番号
   - F1: お問い合わせ種別
   - G1: 興味のあるサービス
   - H1: メッセージ
   - I1: 送信元URL
   - J1: ステータス

### ステップ2: Google Apps Script設定
1. スプレッドシートのメニューから「拡張機能」→「Apps Script」を選択
2. 以下のコードを貼り付け：

```javascript
function doPost(e) {
  try {
    // POSTデータを解析
    const data = JSON.parse(e.postData.contents);
    
    // スプレッドシートを取得
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // 新しい行にデータを追加
    sheet.appendRow([
      new Date(), // 受信日時
      data.company,
      data.name,
      data.email,
      data.phone,
      data.inquiry_type,
      data.interest,
      data.message,
      data.source_url,
      '未対応' // ステータス
    ]);
    
    // メール通知を送信
    sendNotificationEmail(data);
    
    // 成功レスポンス
    return ContentService
      .createTextOutput(JSON.stringify({status: 'success'}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // エラーレスポンス
    return ContentService
      .createTextOutput(JSON.stringify({status: 'error', message: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function sendNotificationEmail(data) {
  const recipient = 'leadfive.138@gmail.com';
  const subject = `【LeadFive】新規お問い合わせ: ${data.name}様`;
  
  const body = `
新しいお問い合わせを受信しました。

━━━━━━━━━━━━━━━━━━━━━━
■ お客様情報
━━━━━━━━━━━━━━━━━━━━━━
会社名: ${data.company}
お名前: ${data.name}
メール: ${data.email}
電話番号: ${data.phone}

■ お問い合わせ内容
━━━━━━━━━━━━━━━━━━━━━━
種別: ${data.inquiry_type}
興味のあるサービス: ${data.interest}

メッセージ:
${data.message}

━━━━━━━━━━━━━━━━━━━━━━
受信日時: ${new Date().toLocaleString('ja-JP')}
送信元: ${data.source_url}

スプレッドシート:
${SpreadsheetApp.getActiveSpreadsheet().getUrl()}
`;

  // メール送信
  GmailApp.sendEmail(recipient, subject, body, {
    name: 'LeadFive お問い合わせシステム',
    replyTo: data.email
  });
}
```

### ステップ3: Web App として公開
1. Apps Scriptエディタで「デプロイ」→「新しいデプロイ」をクリック
2. 種類を「ウェブアプリ」に設定
3. 以下の設定を行う：
   - 説明: LeadFive Contact Form Handler
   - 実行ユーザー: 自分
   - アクセス権: 全員
4. 「デプロイ」をクリック
5. 生成されたWeb App URLをコピー

### ステップ4: コードに反映
```javascript
// /assets/js/contact-handler.js の以下の行を更新
this.googleSheetsWebhook = null;
// ↓
this.googleSheetsWebhook = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
```

## 3. HTMLフォームへの実装

既存のフォームに以下のスクリプトを追加：

```html
<!-- お問い合わせフォームページの最後に追加 -->
<script src="/assets/js/contact-handler.js"></script>
```

## 4. テスト方法

1. ブラウザでフォームページを開く
2. 以下のテストデータを入力：
   - 会社名: テスト会社
   - お名前: テスト太郎
   - メール: test@example.com
   - 電話番号: 03-1234-5678
   - メッセージ: これはテストメッセージです
3. 送信ボタンをクリック
4. 成功メッセージが表示されることを確認
5. メールまたはスプレッドシートでデータを確認

## 5. トラブルシューティング

### Formspreeでメールが届かない場合
- Form IDが正しいか確認
- Formspreeダッシュボードでフォームが有効になっているか確認
- スパムフォルダを確認

### Google Sheetsに記録されない場合
- Web App URLが正しいか確認
- Apps Scriptの実行権限を確認
- ブラウザのコンソールでエラーを確認

### CORS エラーが発生する場合
Google Sheetsへの送信で`mode: 'no-cors'`を使用しているため、
レスポンスの詳細は取得できませんが、送信自体は成功します。

## 6. セキュリティ考慮事項

- Formspreeは自動的にスパムフィルタリングを提供
- Google Sheetsへのアクセスは読み取り専用に設定可能
- センシティブな情報はHTTPS経由でのみ送信
- レート制限を実装済み（クライアント側）

## お問い合わせ

設定に関するご質問は leadfive.138@gmail.com までお問い合わせください。