#!/bin/bash

# Jekyll起動スクリプト
echo "Starting Jekyll server..."

# rbenvを初期化
eval "$(rbenv init -)"

# Jekyllサーバーを起動
bundle exec jekyll serve --livereload

# または本番環境向けの場合
# JEKYLL_ENV=production bundle exec jekyll serve