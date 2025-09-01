#!/bin/bash

# ブログ自動投稿のcronジョブセットアップスクリプト

echo "ブログ自動投稿のcronジョブをセットアップします..."

# 環境変数ファイルのパスを確認
ENV_FILE="/Users/leadfive/Desktop/system/022_HP/shiki0138-leadfive/.env"
if [ ! -f "$ENV_FILE" ]; then
    echo "警告: .envファイルが見つかりません。環境変数を設定してください。"
    echo "必要な環境変数:"
    echo "  - ANTHROPIC_API_KEY"
    echo "  - UNSPLASH_API_KEY"
fi

# cronジョブのコマンド
CRON_COMMAND="cd /Users/leadfive/Desktop/system/022_HP/shiki0138-leadfive && /usr/local/bin/node scripts/blog-automation/run-daily-blog.js >> logs/cron.log 2>&1"

# 現在のcrontabを取得
crontab -l > /tmp/current_cron 2>/dev/null || true

# すでに登録されているかチェック
if grep -q "run-daily-blog.js" /tmp/current_cron; then
    echo "cronジョブはすでに登録されています。"
    echo "現在の設定:"
    grep "run-daily-blog.js" /tmp/current_cron
else
    # 新しいcronジョブを追加（毎日午前9時に実行）
    echo "0 9 * * * $CRON_COMMAND" >> /tmp/current_cron
    
    # crontabを更新
    crontab /tmp/current_cron
    echo "cronジョブを登録しました（毎日午前9時実行）"
fi

# 一時ファイルを削除
rm -f /tmp/current_cron

echo ""
echo "手動でテスト実行する場合:"
echo "cd /Users/leadfive/Desktop/system/022_HP/shiki0138-leadfive"
echo "node scripts/blog-automation/run-daily-blog.js"
echo ""
echo "cronログを確認する場合:"
echo "tail -f /Users/leadfive/Desktop/system/022_HP/shiki0138-leadfive/logs/cron.log"