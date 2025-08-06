#!/usr/bin/env node

// プロフェッショナルライティングプロンプト管理モジュール

const writingPrompts = {
  // 8つの本能に基づくプロンプトテンプレート
  instincts: {
    survival: {
      name: "生存本能",
      triggers: ["リスク回避", "安全性", "保証", "確実性"],
      template: `読者の${trigger}への欲求に訴えかけ、${keyword}がいかに彼らのビジネスを守り、持続可能な成長を実現するかを説明してください。`
    },
    reproduction: {
      name: "生殖本能",
      triggers: ["成長", "拡大", "継承", "レガシー"],
      template: `ビジネスの${trigger}と発展への本能的欲求に焦点を当て、${keyword}がどのように企業の未来を築くかを示してください。`
    },
    nurturing: {
      name: "養育本能",
      triggers: ["顧客ケア", "チーム育成", "サポート", "成長支援"],
      template: `${trigger}への本能的な欲求を活用し、${keyword}が顧客や従業員との関係をどう深めるかを説明してください。`
    },
    territorial: {
      name: "縄張り本能",
      triggers: ["市場シェア", "競争優位", "差別化", "独自性"],
      template: `${trigger}を守り拡大する本能に訴え、${keyword}がいかに競合に勝つための武器となるかを示してください。`
    },
    hierarchy: {
      name: "階層本能",
      triggers: ["業界リーダー", "権威性", "ステータス", "認知度"],
      template: `${trigger}への欲求を刺激し、${keyword}がどのように企業の地位を向上させるかを説明してください。`
    },
    learning: {
      name: "学習本能",
      triggers: ["知識欲", "スキルアップ", "最新情報", "専門性"],
      template: `${trigger}を満たす内容で、${keyword}に関する実践的な知識と洞察を提供してください。`
    },
    communication: {
      name: "伝達本能",
      triggers: ["情報共有", "コミュニケーション", "透明性", "連携"],
      template: `${trigger}の重要性を強調し、${keyword}がチームや顧客との${trigger}をどう改善するかを示してください。`
    },
    play: {
      name: "遊戯本能",
      triggers: ["創造性", "イノベーション", "実験", "楽しさ"],
      template: `仕事における${trigger}の価値を認識させ、${keyword}がどのように業務を楽しく革新的にするかを説明してください。`
    }
  },

  // コンテンツ構造テンプレート
  structures: {
    problemSolution: {
      name: "問題解決型",
      sections: [
        { title: "共感を呼ぶ問題提起", prompt: "読者が日々直面している具体的な課題を3つ挙げ、その痛みに共感を示してください。" },
        { title: "なぜ今この問題を解決すべきか", prompt: "この問題を放置することのリスクと、今すぐ行動することのメリットを対比させてください。" },
        { title: "革新的な解決策の提示", prompt: "${keyword}を使った具体的な解決策を、ステップバイステップで説明してください。" },
        { title: "成功事例と実績データ", prompt: "実際の成功事例（仮想でも可）と、期待できる具体的な数値改善を示してください。" },
        { title: "今すぐ始められるアクション", prompt: "読者が今日から実践できる3つの具体的なアクションを提示してください。" }
      ]
    },
    
    howTo: {
      name: "ハウツー型",
      sections: [
        { title: "この方法で得られる成果", prompt: "読者が得られる具体的なメリットを3つ、数値を交えて提示してください。" },
        { title: "必要な準備と前提知識", prompt: "始める前に準備すべきことと、知っておくべき基礎知識を簡潔に説明してください。" },
        { title: "ステップ1: 基礎設定", prompt: "最初のステップを、スクリーンショットや図解のイメージを含めて説明してください。" },
        { title: "ステップ2: 実装と応用", prompt: "次のステップで、より高度な使い方や応用例を紹介してください。" },
        { title: "ステップ3: 最適化と改善", prompt: "効果を最大化するための改善ポイントとコツを共有してください。" },
        { title: "よくある失敗と対処法", prompt: "初心者が陥りやすい3つの失敗パターンと、その回避方法を説明してください。" }
      ]
    },
    
    comparison: {
      name: "比較分析型",
      sections: [
        { title: "なぜ比較が重要なのか", prompt: "適切な選択をすることの重要性と、間違った選択のリスクを説明してください。" },
        { title: "評価基準の設定", prompt: "比較する際の5つの重要な評価基準を提示し、それぞれの重要性を説明してください。" },
        { title: "詳細な比較分析", prompt: "各選択肢を評価基準に基づいて比較し、表形式でまとめてください。" },
        { title: "シチュエーション別おすすめ", prompt: "読者の状況に応じた最適な選択を、3つのシナリオで提案してください。" },
        { title: "決定のためのチェックリスト", prompt: "最終決定のための10項目のチェックリストを提供してください。" }
      ]
    },
    
    caseStudy: {
      name: "事例研究型",
      sections: [
        { title: "背景と課題", prompt: "クライアント企業の背景と、直面していた3つの主要な課題を具体的に描写してください。" },
        { title: "なぜ従来の方法では解決できなかったか", prompt: "これまで試みた解決策とその失敗理由を分析してください。" },
        { title: "革新的アプローチの導入", prompt: "${keyword}を活用した新しいアプローチを、導入プロセスを含めて詳しく説明してください。" },
        { title: "実装の詳細とハードル", prompt: "実装時に直面した課題と、それをどう乗り越えたかを具体的に記述してください。" },
        { title: "成果と学び", prompt: "達成した具体的な成果（数値データ必須）と、プロジェクトから得た重要な学びを共有してください。" },
        { title: "他社への応用可能性", prompt: "この事例から他の企業が学べるポイントと、応用する際の注意点を提示してください。" }
      ]
    }
  },

  // SEO最適化テクニック
  seoTechniques: {
    titleFormulas: [
      "【${year}年最新】${keyword}完全ガイド｜${benefit}を実現する${number}つの方法",
      "${keyword}で${result}を達成！${industry}が注目する${technique}とは",
      "${problem}を解決する${keyword}活用術｜${percentage}%改善の実証データ公開",
      "なぜ${competitor}は${keyword}で成功したのか？${duration}で${achievement}した秘密",
      "${keyword}初心者が${duration}で${expertise}になれる実践ロードマップ"
    ],
    
    metaDescriptions: [
      "${keyword}の基礎から応用まで完全網羅。${benefit}を実現する具体的手法を、${number}の事例とともに解説。今すぐ実践できる${action}も紹介。",
      "${industry}向け${keyword}活用ガイド。${problem}を解決し、${result}を達成する方法を専門家が解説。無料${resource}付き。",
      "${keyword}で${percentage}%の${metric}改善を実現。成功企業の事例から学ぶ、効果的な導入方法と注意点を詳しく解説します。"
    ],
    
    headingPatterns: [
      "数値を含む見出し: ${number}つの${keyword}活用メソッド",
      "疑問形見出し: なぜ${keyword}が${industry}で注目されるのか？",
      "ハウツー見出し: ${keyword}を使って${result}を達成する方法",
      "比較見出し: ${optionA} vs ${optionB}：どちらを選ぶべきか",
      "時系列見出し: ${keyword}導入のステップバイステップガイド"
    ]
  },

  // エンゲージメント向上テクニック
  engagementTechniques: {
    hooks: [
      "ストーリー型: 「${company}の${person}さんは、${problem}に悩んでいました。しかし、${keyword}を導入してから...」",
      "統計型: 「${percentage}%の企業が${keyword}の重要性を認識しながら、実際に活用できているのはわずか${lowPercentage}%という事実をご存知ですか？」",
      "質問型: 「もし${situation}なら、あなたはどうしますか？実は、この答えが${keyword}成功の鍵を握っているのです。」",
      "衝撃型: 「${keyword}を正しく活用すれば、${duration}で${result}が可能です。信じられないかもしれませんが、これは事実です。」"
    ],
    
    transitions: [
      "さらに重要なことは...",
      "ここで見落としがちなポイントが...",
      "実は、多くの人が知らない事実として...",
      "次のステップに進む前に、必ず押さえておきたいのが...",
      "ここまでの内容を実践すれば素晴らしい成果が期待できますが、さらに..."
    ],
    
    ctas: [
      "今すぐ${keyword}を始めるための無料ガイドをダウンロード",
      "${keyword}の導入相談を無料で承っています。お気軽にお問い合わせください",
      "この記事で紹介した手法を、あなたのビジネスに最適化してご提案します",
      "${keyword}セミナーの次回開催情報をメールでお知らせします",
      "さらに詳しい事例や実装方法について、個別にご相談を承ります"
    ]
  },

  // コンテンツ品質チェックリスト
  qualityChecklist: [
    { category: "構成", items: ["明確な導入・本論・結論", "論理的な流れ", "適切な見出し階層", "段落の長さ（3-5文）"] },
    { category: "内容", items: ["具体的な数値データ", "実例・事例の使用", "専門用語の説明", "actionableな情報"] },
    { category: "SEO", items: ["キーワードの自然な配置", "関連キーワードの使用", "メタデータの最適化", "内部リンク"] },
    { category: "読みやすさ", items: ["簡潔な文章", "箇条書きの活用", "視覚的な区切り", "画像・図表の配置"] },
    { category: "エンゲージメント", items: ["感情に訴える要素", "読者への問いかけ", "次のアクションの明示", "価値の明確化"] }
  ]
};

// プロンプト生成関数
function generateWritingPrompt(keyword, options = {}) {
  const {
    structure = 'problemSolution',
    instinct = 'learning',
    targetAudience = '企業の意思決定者',
    tone = 'professional',
    length = 3000
  } = options;
  
  const selectedStructure = writingPrompts.structures[structure];
  const selectedInstinct = writingPrompts.instincts[instinct];
  
  const prompt = `
# ブログ記事作成指示

## 基本情報
- キーワード: ${keyword}
- ターゲット: ${targetAudience}
- トーン: ${tone}
- 文字数: ${length}文字
- 構造: ${selectedStructure.name}
- 訴求本能: ${selectedInstinct.name}

## 記事構成

${selectedStructure.sections.map((section, index) => `
### ${index + 1}. ${section.title}
${section.prompt.replace('${keyword}', keyword)}
`).join('\n')}

## 本能への訴求
${selectedInstinct.template.replace('${keyword}', keyword).replace('${trigger}', selectedInstinct.triggers[0])}

## SEO要件
- タイトル案を3つ提示（${writingPrompts.seoTechniques.titleFormulas[0]}の形式を参考に）
- メタディスクリプション（150文字程度）
- 各セクションに適切なh2/h3タグ
- 内部リンク候補を5箇所程度{{INTERNAL_LINK:トピック}}形式で挿入
- 画像配置位置を{{IMAGE:説明}}形式で4箇所程度指定

## エンゲージメント要素
- 冒頭フック: ${writingPrompts.engagementTechniques.hooks[0]}のパターンを使用
- 遷移文: 各セクション間で自然な流れを作る
- CTA: 記事の最後に${writingPrompts.engagementTechniques.ctas[0]}のような行動喚起

## 品質基準
${writingPrompts.qualityChecklist.map(cat => 
  `- ${cat.category}: ${cat.items.join('、')}`
).join('\n')}

必ず日本語で、指定された文字数と構成に従って高品質な記事を作成してください。
`;
  
  return prompt;
}

// エクスポート
module.exports = {
  writingPrompts,
  generateWritingPrompt
};

// CLI実行
if (require.main === module) {
  const keyword = process.argv[2];
  if (!keyword) {
    console.log('使用方法: node writing-prompts.js "キーワード"');
    process.exit(1);
  }
  
  const prompt = generateWritingPrompt(keyword);
  console.log(prompt);
}