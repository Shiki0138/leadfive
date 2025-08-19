#!/bin/bash

# Jekyll起動スクリプト
echo "Starting Jekyll server for local development..."

# rbenvを初期化
eval "$(rbenv init -)"

# 開発用設定でJekyllサーバーを起動
bundle exec jekyll serve --config _config.yml,_config_dev.yml --livereload --port 4005

# または本番環境向けの場合
# JEKYLL_ENV=production bundle exec jekyll serve