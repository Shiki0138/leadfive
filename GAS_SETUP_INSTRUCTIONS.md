# Google Apps Script (GAS) お問い合わせフォーム連携設定手順

## 概要
お問い合わせフォームをGoogle Spreadsheetsと自動メール送信に連携させるための設定手順です。

## 手順

### 1. Google Spreadsheetsの準備
1. [Google Spreadsheets](https://docs.google.com/spreadsheets/)にアクセス
2. 新しいスプレッドシートを作成
3. ファイル名を「LeadFive お問い合わせ管理」に変更

### 2. Google Apps Scriptの設定
1. スプレッドシートから「拡張機能」→「Apps Script」を選択
2. デフォルトの`myFunction`を削除
3. `gas-code-debug.gs`ファイルの内容をコピー＆ペースト
4. プロジェクト名を「LeadFive Contact Form Handler」に変更
5. 「保存」をクリック

### 3. Web Appとしてデプロイ
1. 「デプロイ」→「新しいデプロイ」を選択
2. 「種類」で「ウェブアプリ」を選択
3. 設定：
   - **実行ユーザー**: 自分
   - **アクセスできるユーザー**: 全員
4. 「デプロイ」をクリック
5. **Web App URLをコピー**（例：`https://script.google.com/macros/s/ABC123.../exec`）

### 4. 権限の許可
1. 初回デプロイ時に権限の確認が表示される
2. 「権限を確認」をクリック
3. Googleアカウントでログイン
4. 「詳細」→「LeadFive Contact Form Handler（安全ではないページ）に移動」
5. 「許可」をクリック

### 5. WebサイトのJavaScriptファイル更新
以下のファイルの`gasEndpoint`を実際のWeb App URLに更新：

#### `assets/js/contact-handler-gas.js`
```javascript
this.gasEndpoint = '実際のWeb App URLに置き換え';
```

#### `assets/js/contact-modal.js`
```javascript
const gasEndpoint = '実際のWeb App URLに置き換え';
```

### 6. テスト実行
1. Apps Scriptエディタで`testDoPost`関数を選択
2. 「実行」をクリック
3. 実行ログでエラーがないことを確認
4. スプレッドシートにテストデータが追加されることを確認
5. `leadfive.138@gmail.com`にテストメールが届くことを確認

### 7. 本番テスト
1. ウェブサイトのお問い合わせフォームから実際にテスト送信
2. スプレッドシートに正しくデータが記録されることを確認
3. 自動メール通知が正しく送信されることを確認

## 現在の設定状況
- ✅ GAS コード: 完成（`gas-code-debug.gs`）
- ✅ フロントエンド連携: 完成（GAS エンドポイント設定済み）
- ⏳ Web App URL: **要設定**（上記手順3-4で取得）
- ⏳ 権限許可: **要実行**（上記手順4）

## トラブルシューティング

### よくあるエラー
1. **「スクリプトが見つかりません」**
   - Web App URLが正しく設定されているか確認
   - デプロイが正常に完了しているか確認

2. **「権限がありません」**
   - 手順4の権限許可を再実行
   - 実行ユーザーが「自分」になっているか確認

3. **「メールが送信されない」**
   - Gmailの送信制限に達していないか確認
   - `leadfive.138@gmail.com`が正しく設定されているか確認

### デバッグ方法
1. Apps Scriptエディタの「表示」→「実行ログ」でログ確認
2. `getDebugInfo`関数を実行してシステム状態確認
3. ブラウザの開発者ツールでネットワークタブを確認

## 完了確認
以下が全て動作すれば設定完了：
- [ ] お問い合わせフォーム送信が正常に完了
- [ ] スプレッドシートに自動でデータが記録
- [ ] `leadfive.138@gmail.com`に自動で通知メールが送信
- [ ] お問い合わせ者に確認メールが送信（今後実装予定）