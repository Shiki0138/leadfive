#!/usr/bin/env node

/**
 * Claude API品質テストスクリプト
 * APIキーがない場合はサンプル出力を表示
 */

const ClaudeBlogGenerator = require('./claude-blog-generator');

async function testClaudeQuality() {
  console.log('🧪 Claude API 記事品質テスト\n');
  
  const apiKey = process.env.ANTHROPIC_API_KEY;
  
  if (!apiKey || apiKey === 'test') {
    console.log('⚠️  API キーが設定されていません。サンプル出力を表示します。\n');
    showSampleOutput();
    return;
  }
  
  // テスト用のキーワード
  const testKeyword = 'AI活用 中小企業 成功事例';
  
  console.log(`📝 キーワード: ${testKeyword}`);
  console.log('⏳ Claude APIで記事を生成中...\n');
  
  const generator = new ClaudeBlogGenerator({
    anthropicApiKey: apiKey,
    keyword: testKeyword,
    category: 'AIマーケティング',
    targetLength: 2500
  });
  
  try {
    // ドライラン（ファイル保存なし）
    const result = await generator.generateContentPreview();
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📄 生成された記事プレビュー');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    console.log(`タイトル: ${result.title}\n`);
    console.log(`説明: ${result.description}\n`);
    console.log('本文:');
    console.log(result.content.substring(0, 1000) + '...\n');
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 記事の統計');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    console.log(`文字数: ${result.content.length}文字`);
    console.log(`推定読了時間: ${Math.ceil(result.content.length / 500)}分`);
    console.log(`SEOスコア: ${result.seoScore || 'N/A'}`);
    
  } catch (error) {
    console.error('❌ エラー:', error.message);
  }
}

function showSampleOutput() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📄 Claude API で生成される記事の例');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  const sample = `タイトル: なぜAI導入で成功した中小企業はわずか18%なのか？失敗企業が見落とした3つの真実

説明: AI活用で成功する中小企業の共通点は「AIを使わない領域を明確にすること」でした。82%の失敗企業が陥った罠と、成功企業の逆説的アプローチを実例で解説。

本文:
## 結論: AI成功の鍵は「人間の仕事を残すこと」だった

{{IMAGE:AI導入成功率の衝撃的なグラフ}}

驚くべきことに、AI導入で期待した成果を得られた中小企業はわずか18%。しかし、成功企業には明確な共通点がありました。それは「AIに任せない領域を最初に決めていた」ことです。

一般的には「AIで業務を自動化すれば効率が上がる」と考えられています。しかし、実際のデータは全く逆の結果を示しています：

- AI依存度が高い企業ほど顧客満足度が低下
- 完全自動化を目指した企業の73%が売上減少
- 人間とAIの役割分担を明確にした企業は売上2.3倍

{{INTERNAL_LINK:AI導入の失敗パターン完全ガイド}}

## なぜ多くの中小企業がAI活用で失敗するのか

{{IMAGE:失敗企業の共通パターン図解}}

### 誤解1: AIは万能である

多くの経営者が「AIを導入すれば全てが解決する」と考えています。しかし、これはAIベンダーが作り出した幻想に過ぎません...`;
  
  console.log(sample);
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✨ Claude API の特徴');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  console.log('1. 結論ファースト構成');
  console.log('2. 常識を覆す切り口');
  console.log('3. 具体的なデータと事例');
  console.log('4. 読者の興味を維持する構成');
  console.log('5. SEO最適化された文章');
  console.log('\n💡 GitHub Secrets に ANTHROPIC_API_KEY を設定すると、実際の生成が可能になります。');
}

// メイン実行
testClaudeQuality();