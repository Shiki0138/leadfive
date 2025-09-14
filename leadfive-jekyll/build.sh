#!/bin/bash

# Jekyll ビルドスクリプト
# 使用方法: ./build.sh [環境]
# 環境: development (デフォルト), production

ENV=${1:-development}

echo "Building Jekyll site for $ENV environment..."

if [ "$ENV" = "production" ]; then
    echo "Running production build..."
    JEKYLL_ENV=production bundle exec jekyll build
else
    echo "Running development build..."
    bundle exec jekyll build
fi

echo "Build complete! Output in _site/"

# オプション: ビルド後にサイズをチェック
echo ""
echo "Site statistics:"
find _site -type f -name "*.html" | wc -l | xargs echo "HTML files:"
find _site -type f -name "*.css" | wc -l | xargs echo "CSS files:"
find _site -type f -name "*.js" | wc -l | xargs echo "JS files:"
du -sh _site | xargs echo "Total size:"