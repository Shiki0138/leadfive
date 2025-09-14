# Jekyll インストール手順

## 方法1: Homebrewを使用（macOS推奨）

```bash
# 1. Homebrewがインストールされているか確認
brew --version

# 2. rbenvをインストール（Rubyバージョン管理）
brew install rbenv ruby-build

# 3. rbenvを初期化
echo 'eval "$(rbenv init -)"' >> ~/.zshrc
source ~/.zshrc

# 4. 最新の安定版Rubyをインストール
rbenv install 3.2.2
rbenv global 3.2.2

# 5. Rubyのバージョンを確認
ruby -v

# 6. プロジェクトディレクトリに移動
cd /Users/leadfive/Desktop/system/022_HP/leadfive-jekyll

# 7. Bundlerをインストール
gem install bundler

# 8. Jekyll依存関係をインストール
bundle install
```

## 方法2: ユーザー権限でインストール

```bash
# プロジェクトディレクトリに移動
cd /Users/leadfive/Desktop/system/022_HP/leadfive-jekyll

# ユーザーディレクトリにgemをインストール
gem install bundler --user-install
bundle config set --local path 'vendor/bundle'
bundle install
```

## 方法3: Dockerを使用（権限問題を回避）

Dockerfileを作成：

```dockerfile
FROM jekyll/jekyll:latest
WORKDIR /srv/jekyll
COPY . .
RUN bundle install
CMD ["jekyll", "serve", "--host", "0.0.0.0"]
```

実行：
```bash
docker build -t leadfive-jekyll .
docker run -p 4000:4000 leadfive-jekyll
```

## エラーが発生した場合

### "sudo access required"エラー
```bash
# rbenvまたはrvmを使用してRubyをユーザー環境にインストール
```

### "bundle: command not found"エラー
```bash
gem install bundler
# または
sudo gem install bundler
```

### その他のエラー
```bash
# キャッシュをクリア
rm -rf vendor/bundle
rm Gemfile.lock
bundle install
```

## インストール確認

インストールが成功したら、以下で確認：

```bash
# Jekyllバージョンを確認
bundle exec jekyll -v

# ローカルサーバーを起動
bundle exec jekyll serve

# ブラウザで確認
open http://localhost:4000
```