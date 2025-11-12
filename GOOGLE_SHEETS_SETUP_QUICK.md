# Google Sheetsだけでお問い合わせフォーム設定（10分で完了）

## 実装済み内容
- ✅ Google Apps Script コード作成済み (`gas-code.gs`)
- ✅ JavaScript ハンドラー作成済み (`contact-handler-gas.js`)
- ✅ 自動メール通知機能（mail@lead-v.com宛）
- ✅ スプレッドシート自動記録

## 設定手順

### 1. スプレッドシート作成（2分）
1. [Google Sheets](https://sheets.google.com) で新規作成
2. 名前を「LeadFive お問い合わせ管理」に変更

### 2. Apps Script設定（3分）
1. メニュー「拡張機能」→「Apps Script」
2. `gas-code.gs` の内容をすべてコピー＆ペースト
3. 保存（Ctrl+S）

### 3. Web App公開（3分）
1. 「デプロイ」→「新しいデプロイ」
2. 設定:
   - 種類: ウェブアプリ
   - 実行ユーザー: 自分
   - アクセス: 全員
3. デプロイ → URLをコピー

### 4. URL更新（2分）
`/assets/js/contact-handler-gas.js` の6行目:
```javascript
this.gasEndpoint = 'コピーしたURL';
```

## テスト方法
1. Apps Scriptで `testDoPost` 関数を実行
2. メールとスプレッドシートを確認

## 完了！
フォームから送信すると自動的に:
- スプレッドシートに記録
- mail@lead-v.com にメール通知

詳細は `/docs/GOOGLE_SHEETS_ONLY_SETUP.md` 参照