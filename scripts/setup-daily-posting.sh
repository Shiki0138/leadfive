#!/bin/bash

# AI自動ブログ投稿システム セットアップスクリプト
# 毎日9時に自動でブログ記事を生成・投稿するcronジョブを設定

set -e

echo "🤖 AI自動ブログ投稿システム セットアップ開始"

# 現在のディレクトリ取得
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# 必要なディレクトリ作成
echo "📁 必要なディレクトリを作成中..."
mkdir -p "$PROJECT_DIR/logs"
mkdir -p "$PROJECT_DIR/_virtual"

# 環境変数設定ファイル作成（存在しない場合）
ENV_FILE="$PROJECT_DIR/.env"
if [ ! -f "$ENV_FILE" ]; then
    echo "⚙️  .env ファイルを作成中..."
    cat > "$ENV_FILE" << 'EOF'
# AI自動ブログ投稿システム設定
OPENAI_API_KEY=your_openai_api_key_here
GOOGLE_SERP_API_KEY=your_serp_api_key_here

# ブログ設定
BLOG_AUTHOR="LeadFive Content Team"
BLOG_BASE_URL="https://leadfive138.com/leadfive"

# 投稿設定
DAILY_POSTING_ENABLED=true
POSTING_TIME="09:00"
WEEKEND_POSTING=true

# 品質設定
MIN_WORD_COUNT=2000
MAX_WORD_COUNT=4000
SERP_ANALYSIS_ENABLED=true

# 通知設定
EMAIL_NOTIFICATIONS=false
SLACK_WEBHOOK_URL=""
EOF
    echo "✅ .env ファイルを作成しました。API キーを設定してください。"
else
    echo "✅ .env ファイルが既に存在します"
fi

# Node.js の依存関係確認
echo "📦 Node.js パッケージを確認中..."
cd "$PROJECT_DIR"

if [ ! -f "package.json" ]; then
    echo "📝 package.json を作成中..."
    npm init -y
fi

# 必要なパッケージをインストール
echo "⬇️  必要なパッケージをインストール中..."
npm install --save-dev dotenv node-cron

# 実行権限付与
chmod +x "$SCRIPT_DIR/auto-blog-scheduler.js"

# cron ジョブ設定
echo "⏰ cron ジョブを設定中..."

# 既存のcronジョブを確認
CRON_LINE="0 9 * * * cd $PROJECT_DIR && node scripts/auto-blog-scheduler.js --schedule >> logs/cron-blog.log 2>&1"
CRON_COMMENT="# LeadFive AI自動ブログ投稿 - 毎日9:00に実行"

# 現在のcrontabを取得
current_crontab=$(crontab -l 2>/dev/null || echo "")

# 既存のエントリーをチェック
if echo "$current_crontab" | grep -q "auto-blog-scheduler.js"; then
    echo "⚠️  既存のcronジョブが見つかりました。削除して再設定しますか？ (y/N)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        # LeadFive関連のcronジョブを削除
        filtered_crontab=$(echo "$current_crontab" | grep -v "auto-blog-scheduler.js" | grep -v "LeadFive AI自動ブログ投稿")
        echo "$filtered_crontab" | crontab -
        echo "🗑️  既存のcronジョブを削除しました"
    else
        echo "⏭️  既存のcronジョブをそのままにします"
        exit 0
    fi
fi

# 新しいcronジョブを追加
{
    echo "$current_crontab"
    echo "$CRON_COMMENT"
    echo "$CRON_LINE"
} | crontab -

echo "✅ cronジョブを設定しました"

# テスト実行
echo "🧪 システムのテスト実行中..."
cd "$PROJECT_DIR"

if node scripts/auto-blog-scheduler.js --test; then
    echo "✅ テスト実行が成功しました"
else
    echo "❌ テスト実行が失敗しました。設定を確認してください。"
    exit 1
fi

# 設定サマリー表示
echo "
🎉 AI自動ブログ投稿システム セットアップ完了！

📊 設定内容:
- 実行スケジュール: 毎日 9:00
- ログファイル: $PROJECT_DIR/logs/cron-blog.log
- 設定ファイル: $PROJECT_DIR/.env
- キーワード設定: $PROJECT_DIR/_data/auto-keywords.yml

📝 次のステップ:
1. .env ファイルに API キーを設定
2. _data/auto-keywords.yml でキーワード戦略をカスタマイズ
3. 初回投稿を確認 (明日の9:00に自動実行されます)

🔧 管理コマンド:
- 手動実行: node scripts/auto-blog-scheduler.js --schedule
- テスト実行: node scripts/auto-blog-scheduler.js --test  
- cronジョブ確認: crontab -l
- ログ確認: tail -f logs/cron-blog.log

⚠️  重要: OpenAI API キーの設定を忘れずに！
"