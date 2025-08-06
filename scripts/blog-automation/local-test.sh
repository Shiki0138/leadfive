#!/bin/bash

# ローカルテスト用スクリプト
# APIキーなしでブログ生成システムをテストできます

echo "🧪 ローカルテスト環境でブログ生成をテストします"
echo ""

# 色の定義
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# テストキーワードの選択
KEYWORDS=(
  "AIマーケティング 自動化"
  "消費者心理 8つの本能"
  "ChatGPT ビジネス活用"
  "デジタル変革 中小企業"
  "SEO対策 AI活用"
)

echo "テストキーワードを選択してください:"
select KEYWORD in "${KEYWORDS[@]}" "カスタム入力"; do
  case $KEYWORD in
    "カスタム入力")
      read -p "キーワードを入力: " KEYWORD
      break
      ;;
    *)
      break
      ;;
  esac
done

echo -e "\n選択されたキーワード: ${GREEN}$KEYWORD${NC}"
echo ""

# 依存関係の確認
echo -e "${YELLOW}📦 依存関係を確認中...${NC}"
if [ ! -d "node_modules" ]; then
  echo "依存関係をインストールします..."
  npm install
fi

# モックジェネレーターの実行
echo -e "\n${YELLOW}🚀 モックブログ生成を開始...${NC}"
node mock-blog-generator.js "$KEYWORD"

# 生成結果の確認
echo -e "\n${YELLOW}📋 生成結果を確認中...${NC}"
TODAY=$(date '+%Y-%m-%d')
GENERATED_FILE=$(find ../../_posts -name "${TODAY}-mock-*.md" -type f | head -1)

if [ -n "$GENERATED_FILE" ]; then
  echo -e "${GREEN}✅ ブログ記事が生成されました:${NC}"
  echo "   $GENERATED_FILE"
  echo ""
  echo "記事の内容（最初の20行）:"
  echo "----------------------------------------"
  head -20 "$GENERATED_FILE"
  echo "----------------------------------------"
  echo ""
  echo -e "${GREEN}✨ テスト成功！${NC}"
  echo ""
  echo "次のステップ:"
  echo "1. 生成された記事を確認: $GENERATED_FILE"
  echo "2. Jekyll でビルド: cd ../.. && bundle exec jekyll build"
  echo "3. ローカルサーバーで確認: bundle exec jekyll serve"
else
  echo -e "${RED}❌ ブログ記事の生成に失敗しました${NC}"
fi

echo ""
echo "💡 本番環境で使用する場合:"
echo "   1. Anthropic Console で API キーを取得"
echo "   2. export ANTHROPIC_API_KEY='your-key'"
echo "   3. node claude-blog-generator.js '$KEYWORD'"