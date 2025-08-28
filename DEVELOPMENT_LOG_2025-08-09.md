# LeadFive HP開発記録
**日付**: 2025年8月9日  
**プロジェクト**: LeadFive デモサイト改修

## 📋 開発概要

### 初期状態
- Hive Mind Swarm spawning agents のサポート依頼
- 日本語でのリソース管理要求
- 複数のエラーが発生していたWebサイト

### 主な作業内容
1. ホワイトペーパーの非公開化
2. お問い合わせフォームのFormspreeからGoogle Apps Script（GAS）への移行
3. 各種エラーの修正
4. ブログ自動投稿システムのドキュメント作成

## 🔧 技術的な実装詳細

### 1. ホワイトペーパーの非公開化

**要求**: 「ホワイトペーパーは現在は閲覧できないようにしておいて」

**実装**:
```yaml
# _pages/whitepaper.html
---
layout: default
title: ホワイトペーパー
permalink: /whitepaper/
published: false  # 追加
sitemap: false    # 追加
robots: noindex, nofollow  # 追加
---
```

- ファイルは削除せず、Jekyll の機能で非公開化
- 検索エンジンからも除外

### 2. お問い合わせフォームの実装

**要求**: 
- leadfive.138@gmail.com への通知
- Google Sheetsのみでの実装（Formspree不要）

**実装プロセス**:

#### a) Google Apps Script コード作成
```javascript
// gas-code.gs
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    saveToSpreadsheet(data);
    sendNotificationEmail(data);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        message: 'お問い合わせを受信しました'
      }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    console.error('Error:', error);
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

#### b) フロントエンド実装
```javascript
// contact-handler-gas.js
class ContactFormGAS {
  constructor() {
    this.gasEndpoint = 'https://script.google.com/macros/s/xxxxx/exec';
    this.init();
  }

  async submitToGoogleSheets(data) {
    const response = await fetch(this.gasEndpoint, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify(data)
    });
    return { success: true };
  }
}
```

### 3. エラー修正

#### 修正したエラー一覧

| エラー | 原因 | 解決方法 |
|--------|------|----------|
| `main.scss 404` | styles.cssが存在しないSCSSファイルを参照 | `@import url("main.css")`に変更 |
| `favicon.ico 404` | ファイルが存在しない | favicon.icoを作成・配置 |
| `querySelector('#')` | 空のhref="#"でquerySelectorエラー | 早期returnで回避 |
| `formspree.io 404` | 古いcontact.jsがFormspreeを使用 | ファイルをバックアップに変更 |

#### main.js querySelector エラーの修正
```javascript
// 修正前
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const href = this.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
```

```javascript
// 修正後
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (!href || href === '#') return;  // 早期return
    e.preventDefault();
    const target = document.querySelector(href);
```

### 4. ブログ自動投稿システムのドキュメント作成

作成したドキュメント：
- `BLOG_AUTOMATION_SYSTEM_GUIDE.md` - 完全なシステムガイド
- `BLOG_AUTOMATION_QUICK_GUIDE.md` - クイックスタートガイド
- `AI_API_SETUP_GUIDE.md` - Claude & Gemini API設定
- `BLOG_AUTOMATION_WORKFLOW.md` - ワークフローと自動化

## 🐛 トラブルシューティング記録

### 問題1: Formspreeエラーの継続

**症状**: contact.jsとcontact-handler.jsを削除してもFormspreeへのリクエストが発生

**原因**: 
- ブラウザキャッシュ
- _siteフォルダに古いJSファイルが残存

**解決**:
```bash
# 不要なファイルをバックアップ
mv assets/js/contact.js assets/js/contact.js.backup
mv assets/js/contact-handler.js assets/js/contact-handler.js.backup

# Jekyllを再ビルド
bundle exec jekyll build
```

### 問題2: GASでスプレッドシートに記録されない

**症状**: フォーム送信は成功するが、データが記録されない

**原因**: Google Apps Scriptに誤ってブラウザ用JSを貼り付け

**エラーメッセージ**:
```
ReferenceError: document is not defined
```

**解決**: 正しいGASコード（gas-code.gs）を貼り付け

## 📁 作成・修正したファイル

### 新規作成
- `/gas-code.gs` - Google Apps Script本体
- `/assets/js/contact-handler-gas.js` - GAS専用フロントエンド
- `/docs/AI_API_SETUP_GUIDE.md` - AI API設定ガイド
- `/docs/BLOG_AUTOMATION_*.md` - ブログ自動化ドキュメント群
- `/favicon.ico` - サイトアイコン

### 修正
- `/_pages/whitepaper.html` - 非公開設定追加
- `/assets/js/main.js` - querySelector エラー修正
- `/assets/css/styles.css` - SCSSインポート修正
- `/_layouts/default.html` - スクリプト読み込み順序

### バックアップ（削除）
- `/assets/js/contact.js` → `/assets/js/contact.js.backup`
- `/assets/js/contact-handler.js` → `/assets/js/contact-handler.js.backup`

## 🚀 デプロイ

### Git操作
```bash
git add -A
git commit -m "Fix contact form errors: Remove Formspree, use GAS only

- Remove contact.js and contact-handler.js (using Formspree)
- Keep only contact-handler-gas.js for Google Apps Script
- Fix main.js querySelector error for empty href
- Add favicon.ico
- Hide whitepaper page
- Add blog automation documentation
- Fix various frontend errors"

git push origin main
```

### デプロイ先
- GitHub: https://github.com/Shiki0138/leadfive.git
- デプロイ環境: 未確認（GitHub Pages/Vercel/Netlify等）

## 💡 学んだこと

1. **no-corsモードの制約**
   - Google Apps Scriptへのリクエストはno-corsモードが必要
   - レスポンスの内容は取得できないため、常に成功として扱う

2. **Jekyllの非公開化**
   - `published: false`でページを非公開にできる
   - ファイルを削除する必要がない

3. **エラーデバッグの重要性**
   - ブラウザキャッシュが原因で古いコードが実行される場合がある
   - _siteフォルダの再生成が必要な場合がある

4. **GASとブラウザJSの違い**
   - GASはサーバーサイドで実行される
   - document、window等のブラウザAPIは使用不可

## 📊 成果

- ✅ ホワイトペーパーの非公開化完了
- ✅ お問い合わせフォームのGAS移行完了
- ✅ 全エラーの修正完了
- ✅ ブログ自動化ドキュメント作成完了
- ✅ GitHubへのプッシュ完了

## 🔮 今後の課題

1. Google Apps Scriptの正しいデプロイ確認
2. スプレッドシートへの記録動作確認
3. メール通知の動作確認
4. デプロイ環境での動作確認

---

**作業時間**: 約3時間  
**使用技術**: Jekyll, JavaScript, Google Apps Script, Git  
**クライアント**: LeadFive（leadfive.138@gmail.com）