#!/bin/bash

  echo "=== LeadFive AI×心理学ブログ生成システム ==="
  echo ""

  # 環境変数の設定
  export UNSPLASH_ACCESS_KEY="60TVM5Qo1LLe3oFS0YqMgYAgsJlmX4IjaToTNNlRYA4"
  export PEXELS_API_KEY="9xSvPQv4n7ThPDIcEJOkq9OsUUcMDcAHOABy7uIqigbgSSlULXHuRTmF"

  # Pythonスクリプトを実行
  python scripts/interactive_blog_generator.py
