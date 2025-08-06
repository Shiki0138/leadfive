import os
  from datetime import datetime

  print("=== LeadFive ブログ生成システム ===")
  keyword = input("キーワードを入力: ")
  title = "AIで" + keyword + "を改善する方法"
  print("タイトル: " + title)

  answer = input("生成しますか？(y/n): ")
  if answer == "y":
      os.makedirs("_posts", exist_ok=True)
      date_str = datetime.now().strftime("%Y-%m-%d")
      filename = "_posts/" + date_str + "-test.md"
      with open(filename, "w") as f:
          f.write("# " + title + "\n\nテスト記事です。")
      print("作成しました: " + filename)
