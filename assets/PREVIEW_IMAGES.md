# サービスプレビュー画像設定

各サービスのプレビュー画像として使用するUnsplash画像のURLリスト。
動画が用意できたら、対応するファイルを `/assets/videos/works/` に配置してください。

## 画像URL一覧

| サービス | Unsplash画像URL |
|---------|-----------------|
| FLEEKS | https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80 |
| HexaMind | https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80 |
| counseling-AI | https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80 |
| ふえるん | https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80 |
| 補助金申請AI | https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80 |
| 歯科予約管理 | https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&q=80 |
| Garden DX | https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80 |
| CRAFT | https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&q=80 |

## 動画ファイル配置場所

```
assets/videos/works/
├── fleeks.webm       (推奨: WebM形式)
├── fleeks.mp4        (フォールバック: MP4形式)
├── hexamind.webm
├── hexamind.mp4
├── counseling-ai.webm
├── counseling-ai.mp4
├── fuerun.webm
├── fuerun.mp4
├── subsidy.webm
├── subsidy.mp4
├── dental.webm
├── dental.mp4
├── garden.webm
├── garden.mp4
├── craft.webm
└── craft.mp4
```

## 動画作成のヒント

1. **画面録画ツール**: QuickTime Player, OBS Studio, ScreenFlow
2. **推奨時間**: 15〜30秒
3. **推奨解像度**: 1920x1080 または 1280x720
4. **フォーマット**: WebM (VP9) + MP4 (H.264) の両方
5. **ファイルサイズ**: 5MB以下推奨

## HTML での使用例

```html
<video autoplay muted loop playsinline poster="/assets/images/works/fleeks.jpg">
    <source src="/assets/videos/works/fleeks.webm" type="video/webm">
    <source src="/assets/videos/works/fleeks.mp4" type="video/mp4">
    <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80" alt="FLEEKS">
</video>
```
