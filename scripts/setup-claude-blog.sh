#!/bin/bash

# Claude AI ブログ自動生成システムのセットアップスクリプト

echo "🚀 Claude AI ブログ自動生成システムのセットアップを開始します..."

# 色の定義
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# エラーハンドリング
set -e
trap 'echo -e "${RED}❌ エラーが発生しました。セットアップを中止します。${NC}"' ERR

# 1. 必要なディレクトリの作成
echo -e "\n${YELLOW}📁 ディレクトリ構造を作成中...${NC}"
mkdir -p scripts/blog-automation
mkdir -p _data/blog
mkdir -p logs
mkdir -p assets/images/blog

# 2. Node.js の確認
echo -e "\n${YELLOW}🔍 Node.js バージョンを確認中...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js がインストールされていません。${NC}"
    echo "Node.js 18.0.0 以上をインストールしてください。"
    exit 1
fi

NODE_VERSION=$(node -v)
echo "Node.js バージョン: $NODE_VERSION"

# 3. 依存関係のインストール
echo -e "\n${YELLOW}📦 依存関係をインストール中...${NC}"
cd scripts/blog-automation

# package.json が存在しない場合は作成
if [ ! -f package.json ]; then
    npm init -y
fi

# 必要なパッケージをインストール
npm install axios sharp js-yaml dotenv node-schedule cheerio

# 4. 環境変数のチェック
echo -e "\n${YELLOW}🔐 環境変数を確認中...${NC}"

if [ -z "$ANTHROPIC_API_KEY" ]; then
    echo -e "${YELLOW}⚠️  ANTHROPIC_API_KEY が設定されていません。${NC}"
    echo "以下のコマンドで設定してください:"
    echo "export ANTHROPIC_API_KEY='your-api-key'"
else
    echo -e "${GREEN}✅ ANTHROPIC_API_KEY が設定されています${NC}"
fi

if [ -z "$UNSPLASH_API_KEY" ]; then
    echo -e "${YELLOW}ℹ️  UNSPLASH_API_KEY が設定されていません（オプション）${NC}"
fi

# 5. トピックデータベースの初期化
echo -e "\n${YELLOW}📊 トピックデータベースを初期化中...${NC}"
if [ -f topic-manager.js ]; then
    node topic-manager.js init
    echo -e "${GREEN}✅ トピックデータベースを初期化しました${NC}"
else
    echo -e "${YELLOW}⚠️  topic-manager.js が見つかりません${NC}"
fi

# 6. テストの実行
echo -e "\n${YELLOW}🧪 システムテストを実行中...${NC}"
if [ -f test-generator.js ]; then
    node test-generator.js
else
    echo -e "${YELLOW}⚠️  test-generator.js が見つかりません${NC}"
fi

# 7. GitHub Actions の確認
cd ../..
echo -e "\n${YELLOW}🔍 GitHub Actions ワークフローを確認中...${NC}"
if [ -f .github/workflows/claude-auto-blog-daily.yml ]; then
    echo -e "${GREEN}✅ GitHub Actions ワークフローが設定されています${NC}"
else
    echo -e "${RED}❌ GitHub Actions ワークフローが見つかりません${NC}"
fi

# 8. 完了メッセージ
echo -e "\n${GREEN}✨ セットアップが完了しました！${NC}"
echo -e "\n次のステップ:"
echo "1. GitHub の Settings > Secrets で以下を設定:"
echo "   - ANTHROPIC_API_KEY (必須)"
echo "   - UNSPLASH_API_KEY (オプション)"
echo "   - SLACK_WEBHOOK_URL (オプション)"
echo ""
echo "2. 手動でブログを生成:"
echo "   cd scripts/blog-automation"
echo "   node claude-blog-generator.js 'あなたのキーワード'"
echo ""
echo "3. GitHub Actions で自動実行を有効化"
echo ""
echo -e "${GREEN}頑張ってください！🚀${NC}"