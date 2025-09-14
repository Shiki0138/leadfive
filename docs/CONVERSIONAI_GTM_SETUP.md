# ConversionAI Tracking - GTM設置ガイド

## 概要

ConversionAI Trackingシステムを Google Tag Manager（GTM-KFLZV7QS）に設置するためのガイドです。

## GTM設置手順

### 1. GTM管理画面にアクセス
- https://tagmanager.google.com
- GTM-KFLZV7QS コンテナを選択

### 2. 新しいタグを作成
1. **「タグ」** → **「新規」** をクリック
2. **「タグの種類」** → **「カスタムHTML」** を選択
3. **「タグ名」**: `ConversionAI Tracking - Variant A`

### 3. HTMLコードを設定

以下のコードをHTMLフィールドに貼り付けてください：

```html
<!-- ConversionAI Tracking - Variant A -->
<script id="conversionai-Leadfive138-A">
(function() {
  // ConversionAI 設定
  window.ConversionAI = window.ConversionAI || {};
  window.ConversionAI.config = {
    projectId: 'Leadfive138',
    variant: 'A',
    apiEndpoint: 'https://api.leadfive138.com/api/track',
    version: '2.0.0',
    debugMode: false  // 本番環境では false に設定
  };

  // セッション管理
  window.ConversionAI.sessionId = window.ConversionAI.sessionId || 
    'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

  // ライブラリ読み込み
  var script = document.createElement('script');
  script.src = 'https://cdn.leadfive138.com/cdn/conversionai-tracker.min.js';
  script.async = true;
  script.onload = function() {
    if (window.ConversionAI && window.ConversionAI.Tracker) {
      window.ConversionAI.tracker = new window.ConversionAI.Tracker(window.ConversionAI.config);
      window.ConversionAI.tracker.init();
      
      // ページビュー自動追跡
      window.ConversionAI.tracker.trackPageView();
      
      if (window.ConversionAI.config.debugMode) {
        console.log("ConversionAI Tracker initialized for variant A");
      }
    }
  };
  
  script.onerror = function() {
    console.error('ConversionAI tracker failed to load');
  };
  
  document.head.appendChild(script);
  
  // デバッグモード（本番環境では削除推奨）
  window.ConversionAI.debug = {
    log: function(message, data) {
      if (window.ConversionAI.config.debugMode) {
        console.log('[ConversionAI Debug]', message, data);
      }
    },
    trackEvent: function(eventType, data) {
      this.log('Event tracked: ' + eventType, data);
    }
  };
})();
</script>
<!-- End ConversionAI Tracking -->
```

### 4. 配信トリガーを設定
1. **「配信トリガー」** → **「All Pages」** を選択
   - 全ページで追跡する場合
2. 特定ページのみの場合は、カスタムトリガーを作成

### 5. 保存と公開
1. **「保存」** をクリック
2. **「送信」** をクリックして変更を公開
3. バージョン名: `ConversionAI Tracking追加`

## 設定詳細

### 重要な変更点
- `localhost:3005` → 本番環境URL に変更
- `debugMode: false` に設定（本番環境）
- エラーハンドリング改善

### 追跡対象イベント
- ページビュー（自動）
- コンバージョンイベント
- ユーザー行動分析

### データレイヤー連携（オプション）

GTMのデータレイヤーと連携する場合：

```javascript
// データレイヤーにイベントをプッシュ
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  'event': 'conversionai_pageview',
  'conversionai_variant': 'A',
  'conversionai_session_id': window.ConversionAI.sessionId
});
```

## テスト確認

### 1. プレビューモード
GTMの「プレビュー」機能でタグの動作を確認

### 2. ブラウザ開発者ツール
- Console でエラーがないか確認
- Network タブで API リクエストを確認

### 3. 確認項目
- [ ] ConversionAI タグが正常に読み込まれる
- [ ] API エンドポイントへのリクエストが送信される
- [ ] セッションIDが生成される
- [ ] ページビューイベントが追跡される

## トラブルシューティング

### よくある問題
1. **スクリプトが読み込まれない**
   - CDN URLを確認
   - CORS設定を確認

2. **API リクエストが失敗する**
   - エンドポイントURLを確認
   - サーバー側の設定を確認

3. **GTMでタグが発火しない**
   - トリガー条件を確認
   - プレビューモードで動作確認

### デバッグ方法
一時的に `debugMode: true` に設定してコンソールログを確認

## 備考

- **プライバシー**: ConversionAI は個人情報を収集しません
- **パフォーマンス**: 非同期読み込みでページ速度に影響しません
- **セキュリティ**: GTMのセキュリティ機能を活用

---

**設定完了後、24時間以内にデータ収集が開始されます。**