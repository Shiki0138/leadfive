#!/bin/bash

# ブログ記事を自動的にGitHubにプッシュするスクリプト

echo "🔄 ブログ記事をGitHubにプッシュします..."

# スクリプトのディレクトリに移動
cd "$(dirname "$0")/../.."

# 現在のブランチを取得
CURRENT_BRANCH=$(git branch --show-current)
echo "現在のブランチ: $CURRENT_BRANCH"

# ブログ関連のファイルをステージング
echo "📝 ブログファイルをステージング中..."
git add _posts/*.md
git add assets/images/blog/
git add _data/blog/
git add _data/weekly-schedule.json

# 変更があるかチェック
if git diff --staged --quiet; then
    echo "✅ コミットする変更はありません"
    exit 0
fi

# コミットメッセージを生成
COMMIT_DATE=$(date '+%Y-%m-%d %H:%M:%S')
COMMIT_MSG="feat(blog): 自動生成されたブログ記事を追加 - $COMMIT_DATE

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"

# コミット
echo "💾 コミット中..."
git commit -m "$COMMIT_MSG"

# プッシュ（オプション）
if [ "$1" == "--push" ]; then
    echo "🚀 GitHubにプッシュ中..."
    git push origin "$CURRENT_BRANCH"
    echo "✅ プッシュ完了！"
else
    echo "ℹ️  プッシュするには --push オプションを使用してください"
    echo "   例: $0 --push"
fi

echo "✨ 完了！"