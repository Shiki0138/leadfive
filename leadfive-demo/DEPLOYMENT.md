# LeadFive Jekyll サイト デプロイメントガイド

## 概要

このドキュメントでは、WixからJekyllサイトへの移行手順を説明します。

## 事前準備

### 1. 会社情報の更新

以下のファイルで仮の情報を実際の情報に更新してください：

- `_config.yml` - 会社の基本情報
- `_pages/company.md` - 会社概要ページ
- `_pages/contact.md` - 連絡先情報

### 2. 実際のコンテンツの追加

#### サービスページ
`_services/`ディレクトリに以下のファイルを作成済み：
- `ai-marketing.md` - 広告・マーケティングサポート

残り3つのサービスページも同様に作成してください：
- AIプロンプトエンジニアリング
- エンジニアリングサポート
- 戦略コンサルティング

#### ケーススタディ
`_case_studies/`ディレクトリに以下のファイルを作成済み：
- `beauty-salon.md` - 美容室チェーンの事例

残り2つの事例も追加してください：
- BtoBソフトウェア会社の事例
- EC販売の事例

## ローカルでのテスト

### 1. Ruby環境のセットアップ

```bash
# rbenvを使用する場合（推奨）
rbenv install 3.0.0
rbenv local 3.0.0

# またはrvmを使用する場合
rvm install 3.0.0
rvm use 3.0.0
```

### 2. 依存関係のインストール

```bash
cd leadfive-jekyll
bundle install
```

### 3. ローカルサーバーの起動

```bash
bundle exec jekyll serve
```

ブラウザで `http://localhost:4000` にアクセスして確認。

## デプロイオプション

### オプション1: GitHub Pages（推奠）

1. GitHubにリポジトリを作成
2. コードをプッシュ
```bash
git init
git add .
git commit -m "Initial Jekyll site"
git remote add origin https://github.com/[username]/leadfive-jekyll.git
git push -u origin main
```

3. GitHub Pagesの設定
- Settings > Pages
- Source: Deploy from a branch
- Branch: main / root
- Save

4. カスタムドメインの設定
- Custom domain欄に `www.leadfive138.com` を入力
- CNAMEファイルが自動生成される

### オプション2: Netlify

1. [Netlify](https://www.netlify.com/)にサインアップ
2. GitHubリポジトリと連携
3. Build設定：
   - Build command: `jekyll build`
   - Publish directory: `_site`
4. カスタムドメインを設定

### オプション3: 自社サーバー

1. サーバーでJekyllをビルド
```bash
JEKYLL_ENV=production bundle exec jekyll build
```

2. `_site/`ディレクトリの内容をWebサーバーにアップロード

## ドメイン移行手順

### 1. DNS設定の準備

Wixから移行する前に、新しいホスティング先のDNS情報を確認：

#### GitHub Pagesの場合
```
A レコード:
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153

CNAME レコード:
www -> [username].github.io
```

#### Netlifyの場合
Netlifyが提供するDNS情報を使用

### 2. 移行スケジュール

1. **事前準備（1週間前）**
   - Jekyllサイトの完全なテスト
   - すべてのコンテンツの確認
   - バックアップの作成

2. **移行当日**
   - DNSのTTLを短く設定（300秒）
   - 新しいDNSレコードを設定
   - 旧サイトと新サイトの両方を一時的に維持

3. **移行後**
   - DNS伝播の確認（24-48時間）
   - 旧サイトのリダイレクト設定
   - Google Search Consoleの更新

## チェックリスト

移行前に以下を確認してください：

- [ ] すべての会社情報が正確に更新されている
- [ ] すべてのサービスページが作成されている
- [ ] すべてのケーススタディが作成されている
- [ ] 問い合わせフォームが機能している
- [ ] Google Analyticsが設定されている
- [ ] メタタグとSEO設定が適切
- [ ] 404ページが機能している
- [ ] すべての内部リンクが正常
- [ ] 画像が最適化されている
- [ ] モバイル表示が正常

## トラブルシューティング

### ビルドエラーが発生する場合
```bash
bundle update
bundle exec jekyll clean
bundle exec jekyll build --verbose
```

### CSSが反映されない場合
- `_config.yml`の`baseurl`と`url`を確認
- ブラウザのキャッシュをクリア

### 画像が表示されない場合
- 画像パスが正しいか確認
- 画像ファイルが`assets/images/`に存在するか確認

## サポート

問題が発生した場合は、以下を参照してください：

- [Jekyll公式ドキュメント](https://jekyllrb.com/docs/)
- [GitHub Pages ドキュメント](https://docs.github.com/en/pages)
- [Netlify ドキュメント](https://docs.netlify.com/)

## 次のステップ

1. コンテンツの継続的な更新
2. ブログ記事の定期的な投稿
3. アクセス解析の設定と監視
4. SEO最適化の継続
5. パフォーマンスの監視と改善