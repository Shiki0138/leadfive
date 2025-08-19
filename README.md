# LeadFive Jekyll Website

AI×心理学マーケティングコンサルティング会社「LeadFive」のJekyll製ウェブサイトです。

## セットアップ

### 必要な環境

- Ruby 2.7以上
- Bundler
- Jekyll 4.3.2

### インストール手順

1. リポジトリをクローン
```bash
git clone [repository-url]
cd leadfive-jekyll
```

2. 依存関係をインストール
```bash
bundle install
```

3. ローカルサーバーを起動
```bash
# 開発用（baseurlなし）
bundle exec jekyll serve --config _config.yml,_config_development.yml

# 本番環境と同じ設定で確認
bundle exec jekyll serve
```

4. ブラウザで確認
```
http://localhost:4000
```

## ディレクトリ構造

```
leadfive-jekyll/
├── _config.yml          # サイト設定
├── _layouts/            # レイアウトテンプレート
├── _includes/           # 再利用可能なコンポーネント
├── _posts/              # ブログ記事
├── _pages/              # 静的ページ
├── _services/           # サービスページ
├── _case_studies/       # 事例ページ
├── assets/              # CSS、JS、画像
│   ├── css/
│   ├── js/
│   └── images/
├── blog/                # ブログインデックス
└── index.html           # トップページ
```

## カスタマイズ

### 会社情報の更新

`_config.yml`内の会社情報を更新してください：

```yaml
company:
  name: LeadFive（リードファイブ）
  address: "大阪府大阪市北区梅田１−１３−１大阪梅田ツインタワーズ・サウス１５階"
  phone: "06-7713-6747"
  email: info@leadfive138.com
  representative: "代表取締役 山下公一"
  established: "2024年4月8日"
```

### 新しいブログ記事の追加

`_posts/`ディレクトリに以下の命名規則でファイルを作成：

```
YYYY-MM-DD-title-of-post.md
```

### サービスページの追加

`_services/`ディレクトリにMarkdownファイルを作成し、必要なフロントマターを設定。

### ケーススタディの追加

`_case_studies/`ディレクトリにMarkdownファイルを作成。

## デプロイ

### GitHub Pages

1. GitHubリポジトリにプッシュ
2. Settings > Pages でGitHub Pagesを有効化
3. ソースブランチを選択

### 独自ドメイン（Wixからの移行）

1. DNSレコードを更新
2. `_config.yml`の`url`を更新
3. CNAMEファイルを作成（GitHub Pagesの場合）

## 注意事項

- 会社情報（住所、電話番号など）は仮のものです。実際の情報に更新してください
- Google AnalyticsのトラッキングIDを設定してください
- メールフォームの送信先を設定してください（Formspree等のサービスを推奨）

## サポート

問題が発生した場合は、以下をご確認ください：

- Jekyllの[公式ドキュメント](https://jekyllrb.com/docs/)
- [GitHub Issues](https://github.com/jekyll/jekyll/issues)

## ライセンス

© 2024 LeadFive. All rights reserved.