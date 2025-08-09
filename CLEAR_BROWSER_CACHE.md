# ブラウザキャッシュクリア手順

## エラー解決のために

以下のエラーはブラウザキャッシュに起因している可能性があります：

- automation-systems.jpg 404エラー
- ai-analysis-business.jpg 404エラー
- conversion-optimization.jpg 404エラー
- strategic-consulting.jpg 404エラー

## キャッシュクリア方法

### Chrome
1. Ctrl + Shift + R (Windows) / Cmd + Shift + R (Mac)
2. または開発者ツール → Network → Disable cache にチェック

### Safari
1. Cmd + Option + R
2. または開発メニュー → キャッシュを空にする

### Firefox
1. Ctrl + Shift + R (Windows) / Cmd + Shift + R (Mac)

## 修正済みの内容

以下のエラーはすべて修正済みです：

1. **main.scss 404エラー** ✅
   - styles.css内の参照を main.css に修正

2. **favicon.ico 404エラー** ✅
   - favicon.ico ファイルが存在することを確認

3. **main.js querySelector エラー** ✅
   - 空のhref="#"の場合の処理を追加

4. **formspree.io 404エラー** ✅
   - GAS（Google Apps Script）のみを使用する設定になっている

## GASコードについて

GASコード（gas-code.gs）は正しく設定されています。
エラーが続く場合は、Google Apps Script側の設定を確認してください：

1. デプロイが完了しているか
2. アクセス権限が「全員」になっているか
3. URLが正しくコピーされているか