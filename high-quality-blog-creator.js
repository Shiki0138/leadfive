#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const readline = require('readline');
require('dotenv').config();

// カラー出力用のヘルパー
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

const color = (text, colorName) => `${colors[colorName]}${text}${colors.reset}`;

// readline インターフェース
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 質問用のヘルパー関数
const ask = (question) => new Promise((resolve) => rl.question(question, resolve));

// ブログ作成データ
let blogData = {
  keywords: [],
  targetAudience: '',
  contentPurpose: '',
  selectedTitle: '',
  leadText: '',
  headings: [],
  content: '',
  description: ''
};

// 高品質コンテンツ生成のためのプロンプトテンプレート
const contentPrompts = {
  // トーン設定
  tone: {
    professional: '専門的かつ親しみやすい口調で、読者との距離を適切に保つ',
    conversational: '読者に話しかけるような親近感のある文体',
    analytical: 'データと事実に基づいた分析的なアプローチ'
  },
  
  // 価値提供の方法
  valueDelivery: {
    actionable: '読了後すぐに実践できる具体的なステップを含める',
    insightful: '業界の最新トレンドと深い洞察を提供',
    comprehensive: '初心者から上級者まで満足できる包括的な内容'
  },
  
  // 信頼性向上のための要素
  credibility: {
    datadriven: '具体的な数値データと統計を使用',
    casestudy: '実際の企業事例（匿名化）を詳細に解説',
    expert: '業界専門家の見解や最新研究を引用'
  },
  
  // 読みやすさの工夫
  readability: {
    structure: '明確な構成と論理的な流れ',
    visual: '箇条書き、表、図解の効果的な使用',
    storytelling: 'ストーリーテリングで読者を引き込む'
  }
};

// 日本の成功事例データベース（架空だが現実的な数値）
const japanCaseStudies = {
  ecommerce: [
    {
      industry: 'アパレルEC',
      challenge: '競合激化による売上低迷',
      solution: 'AIチャットボット導入によるパーソナライズ強化',
      results: {
        conversionRate: { before: '1.8%', after: '4.2%', improvement: '+133%' },
        averageOrderValue: { before: '8,500円', after: '12,300円', improvement: '+45%' },
        customerRetention: { before: '22%', after: '38%', improvement: '+73%' },
        timeframe: '6ヶ月'
      },
      keyFactors: [
        '顧客の過去の購買履歴を分析し、最適な商品を提案',
        '在庫状況とトレンドを考慮したリアルタイムレコメンデーション',
        '購買後のフォローアップ自動化による満足度向上'
      ]
    },
    {
      industry: '食品EC',
      challenge: 'カート離脱率の高さ（68%）',
      solution: 'AI予測分析による離脱防止策の実装',
      results: {
        cartAbandonment: { before: '68%', after: '42%', improvement: '-38%' },
        monthlyRevenue: { before: '3,200万円', after: '4,800万円', improvement: '+50%' },
        emailOpenRate: { before: '18%', after: '34%', improvement: '+89%' },
        timeframe: '3ヶ月'
      },
      keyFactors: [
        '離脱しそうなユーザーをリアルタイムで検知',
        'パーソナライズされた割引クーポンの自動提供',
        '最適なタイミングでのリマインドメール送信'
      ]
    }
  ],
  
  b2b: [
    {
      industry: '製造業（自動車部品）',
      challenge: 'リード獲得コストの上昇',
      solution: 'コンテンツマーケティングとMA連携',
      results: {
        leadGenCost: { before: '12,000円/件', after: '3,500円/件', improvement: '-71%' },
        leadQuality: { before: 'SQL率15%', after: 'SQL率42%', improvement: '+180%' },
        salesCycle: { before: '平均90日', after: '平均65日', improvement: '-28%' },
        timeframe: '8ヶ月'
      },
      keyFactors: [
        '課題解決型コンテンツによる自然流入の増加',
        'MAツールによるリードナーチャリングの自動化',
        'セールスとマーケティングの連携強化'
      ]
    },
    {
      industry: 'IT企業（SaaS）',
      challenge: '解約率の高さ（月次5.2%）',
      solution: 'カスタマーサクセスの自動化',
      results: {
        churnRate: { before: '5.2%/月', after: '2.1%/月', improvement: '-60%' },
        nps: { before: '12', after: '45', improvement: '+275%' },
        ltv: { before: '82万円', after: '156万円', improvement: '+90%' },
        timeframe: '12ヶ月'
      },
      keyFactors: [
        '利用状況の自動モニタリングと早期アラート',
        'オンボーディングプロセスの最適化',
        '成功指標に基づいたプロアクティブサポート'
      ]
    }
  ],
  
  retail: [
    {
      industry: '大手小売チェーン',
      challenge: '店舗とECの顧客体験断絶',
      solution: 'オムニチャネル統合プラットフォーム',
      results: {
        customerLifetimeValue: { before: '4.2万円', after: '7.8万円', improvement: '+86%' },
        crossChannelPurchase: { before: '8%', after: '34%', improvement: '+325%' },
        inventoryTurnover: { before: '年6回', after: '年9回', improvement: '+50%' },
        timeframe: '18ヶ月'
      },
      keyFactors: [
        '顧客データの完全統合による360度ビュー実現',
        'AIによる在庫最適化と店舗間移動の自動化',
        'チャネル横断的なパーソナライゼーション'
      ]
    }
  ]
};

class HighQualityBlogCreator {
  constructor() {
    this.step = 1;
    this.totalSteps = 9;
  }

  // メイン実行関数
  async run() {
    try {
      console.log(color('============================================================', 'cyan'));
      console.log(color('  高品質ブログコンテンツ作成システム', 'bright'));
      console.log(color('  実践的価値×信頼性×読みやすさの追求', 'yellow'));
      console.log(color('============================================================', 'cyan'));
      console.log();

      await this.step1_getKeywords();
      await this.step2_defineAudience();
      await this.step3_generateTitles();
      await this.step4_createLeadText();
      await this.step5_generateHeadings();
      await this.step6_selectCaseStudies();
      await this.step7_createContent();
      await this.step8_addImages();
      await this.step9_finalize();

      console.log(color('\n🎉 高品質記事の作成が完了しました！', 'green'));
      
    } catch (error) {
      console.error(color(`❌ エラーが発生しました: ${error.message}`, 'red'));
    } finally {
      rl.close();
    }
  }

  // ステップ1: キーワード取得
  async step1_getKeywords() {
    console.log(color(`\n📍 ステップ ${this.step}/${this.totalSteps}: キーワード設定`, 'bright'));
    console.log('メインキーワードと関連キーワードを入力してください（カンマ区切り）:');
    
    const keywordInput = await ask('キーワード: ');
    blogData.keywords = keywordInput.split(',').map(k => k.trim()).filter(k => k.length > 0);
    
    console.log(color(`\n✓ 設定キーワード: ${blogData.keywords.join(', ')}`, 'green'));
    this.step++;
  }

  // ステップ2: ターゲットオーディエンス定義
  async step2_defineAudience() {
    console.log(color(`\n📍 ステップ ${this.step}/${this.totalSteps}: 読者層の定義`, 'bright'));
    
    console.log('\n誰に向けた記事ですか？:');
    console.log('  1. 初心者・入門者（基礎から丁寧に）');
    console.log('  2. 実務担当者（実践的なノウハウ重視）');
    console.log('  3. 意思決定者（ROIや戦略重視）');
    console.log('  4. 専門家（高度な内容・最新動向）');
    
    const audienceChoice = await ask('選択 (1-4): ');
    const audiences = ['beginner', 'practitioner', 'decision-maker', 'expert'];
    blogData.targetAudience = audiences[parseInt(audienceChoice) - 1] || 'practitioner';
    
    console.log(color(`\n✓ ターゲット設定完了`, 'green'));
    this.step++;
  }

  // ステップ3: タイトル案生成
  async step3_generateTitles() {
    console.log(color(`\n📍 ステップ ${this.step}/${this.totalSteps}: 魅力的なタイトル案`, 'bright'));
    
    const titles = this.generateEngagingTitles(blogData.keywords, blogData.targetAudience);
    
    console.log('\n🎯 タイトル候補（クリック率を意識）:');
    titles.forEach((title, index) => {
      console.log(color(`  ${index + 1}. ${title}`, 'cyan'));
    });
    
    const choice = await ask('\n選択してください (1-5): ');
    const selectedIndex = parseInt(choice) - 1;
    
    blogData.selectedTitle = titles[selectedIndex] || titles[0];
    console.log(color(`\n✓ 選択: ${blogData.selectedTitle}`, 'green'));
    
    this.step++;
  }

  // ステップ4: リード文作成
  async step4_createLeadText() {
    console.log(color(`\n📍 ステップ ${this.step}/${this.totalSteps}: 引き込むリード文`, 'bright'));
    
    const leadText = this.generateEngagingLead(blogData.selectedTitle, blogData.keywords, blogData.targetAudience);
    
    console.log('\n📝 リード文案:');
    console.log(color('─────────────────────────────────────', 'cyan'));
    console.log(leadText);
    console.log(color('─────────────────────────────────────', 'cyan'));
    
    const approval = await ask('\n採用しますか？ (y/n): ');
    
    if (approval.toLowerCase() === 'y') {
      blogData.leadText = leadText;
    } else {
      const customLead = await ask('カスタムリード文: ');
      blogData.leadText = customLead;
    }
    
    console.log(color('✓ リード文設定完了', 'green'));
    this.step++;
  }

  // ステップ5: 見出し案生成
  async step5_generateHeadings() {
    console.log(color(`\n📍 ステップ ${this.step}/${this.totalSteps}: 論理的な見出し構成`, 'bright'));
    
    const headings = this.generateLogicalHeadings(blogData.selectedTitle, blogData.keywords, blogData.targetAudience);
    
    console.log('\n📋 見出し構成案:');
    headings.forEach((heading) => {
      const prefix = heading.level === 2 ? '##' : '   ###';
      console.log(color(`${prefix} ${heading.text}`, 'cyan'));
    });
    
    const approval = await ask('\n採用しますか？ (y/n): ');
    
    if (approval.toLowerCase() === 'y') {
      blogData.headings = headings;
    }
    
    console.log(color('✓ 見出し構成決定', 'green'));
    this.step++;
  }

  // ステップ6: 事例選択
  async step6_selectCaseStudies() {
    console.log(color(`\n📍 ステップ ${this.step}/${this.totalSteps}: 説得力のある事例選択`, 'bright'));
    
    console.log('\n含めたい業界事例を選択（複数可、カンマ区切り）:');
    console.log('  1. EC・小売');
    console.log('  2. B2B・製造業');
    console.log('  3. SaaS・IT');
    console.log('  4. 総合小売・オムニチャネル');
    
    const caseChoice = await ask('選択: ');
    blogData.selectedCases = caseChoice.split(',').map(c => parseInt(c.trim()));
    
    console.log(color('✓ 事例選択完了', 'green'));
    this.step++;
  }

  // ステップ7: コンテンツ生成
  async step7_createContent() {
    console.log(color(`\n📍 ステップ ${this.step}/${this.totalSteps}: 価値あるコンテンツ生成`, 'bright'));
    console.log('記事を生成中...');
    
    blogData.content = this.generateHighQualityContent(
      blogData.selectedTitle,
      blogData.leadText,
      blogData.headings,
      blogData.keywords,
      blogData.targetAudience,
      blogData.selectedCases
    );
    
    const charCount = blogData.content.length;
    console.log(color(`✓ 生成完了 (${charCount}文字)`, 'green'));
    
    this.step++;
  }

  // ステップ8: 画像設定
  async step8_addImages() {
    console.log(color(`\n📍 ステップ ${this.step}/${this.totalSteps}: ビジュアル要素追加`, 'bright'));
    
    const h2Headings = blogData.headings.filter(h => h.level === 2);
    blogData.imageInserts = h2Headings.map((heading, index) => ({
      heading: heading.text,
      imagePath: `/assets/images/blog/${this.generateImageName(heading.text)}-${index + 1}.jpg`,
      altText: `${heading.text}を説明する図解`
    }));
    
    console.log(color('✓ 画像設定完了', 'green'));
    this.step++;
  }

  // ステップ9: 最終化
  async step9_finalize() {
    console.log(color(`\n📍 ステップ ${this.step}/${this.totalSteps}: 記事の最終化`, 'bright'));
    
    // SEOディスクリプション生成
    blogData.description = this.generateNaturalDescription(blogData.selectedTitle, blogData.keywords);
    
    // ファイル保存
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const fileName = this.generateFileName(blogData.selectedTitle);
    const filePath = path.join('_posts', `${dateStr}-${fileName}.md`);
    
    const fullContent = this.generateFullMarkdown();
    await fs.writeFile(filePath, fullContent, 'utf8');
    
    console.log(color('\n🎉 高品質記事ファイル生成完了！', 'green'));
    console.log(color(`📁 ${filePath}`, 'cyan'));
    console.log(color(`📊 ${blogData.content.length}文字`, 'cyan'));
  }

  // 魅力的なタイトル生成
  generateEngagingTitles(keywords, audience) {
    const mainKeyword = keywords[0];
    const year = new Date().getFullYear();
    
    const templates = {
      beginner: [
        `${mainKeyword}入門｜知識ゼロから始める実践ガイド`,
        `【保存版】${mainKeyword}の基本と成功事例まとめ`,
        `${mainKeyword}とは？初心者が失敗しない${keywords[1] || '導入'}方法`,
        `今さら聞けない${mainKeyword}｜基礎から応用まで完全解説`,
        `${mainKeyword}スタートガイド｜成功企業の共通点とは`
      ],
      practitioner: [
        `${mainKeyword}で成果を3倍にした企業の実践手法を徹底解説`,
        `【事例あり】${mainKeyword}導入で売上150%達成した方法`,
        `${mainKeyword}の費用対効果を最大化する7つの戦略`,
        `現場で使える${mainKeyword}実践テクニック【${year}年版】`,
        `${mainKeyword}運用のよくある失敗と対策方法まとめ`
      ],
      'decision-maker': [
        `${mainKeyword}投資のROIを証明する｜国内企業の成功データ`,
        `経営層が知るべき${mainKeyword}導入の判断基準と効果測定`,
        `${mainKeyword}で競合に差をつける戦略的アプローチ`,
        `【データで見る】${mainKeyword}がもたらす経営インパクト`,
        `${mainKeyword}導入の意思決定ガイド｜失敗しない選定方法`
      ],
      expert: [
        `${mainKeyword}の最新トレンドと今後の展望【専門家解説】`,
        `${mainKeyword}における技術革新と実装パターンの進化`,
        `【深掘り】${mainKeyword}のアーキテクチャ設計と最適化`,
        `${mainKeyword}の限界と次世代ソリューションへの移行戦略`,
        `グローバル視点で見る${mainKeyword}の発展と日本市場の特殊性`
      ]
    };
    
    return templates[audience] || templates.practitioner;
  }

  // 引き込むリード文生成
  generateEngagingLead(title, keywords, audience) {
    const hooks = {
      beginner: `「${keywords[0]}って最近よく聞くけど、実際どうなの？」そんな疑問をお持ちではありませんか？\n\n実は、すでに多くの日本企業が${keywords[0]}を活用して大きな成果を上げています。`,
      
      practitioner: `${keywords[0]}の導入を検討しているが、本当に効果があるのか確信が持てない。そんな悩みを抱える実務担当者の方は多いのではないでしょうか。\n\n本記事では、実際に成果を出した日本企業の事例を詳しく分析し、成功の秘訣を解説します。`,
      
      'decision-maker': `投資対効果が見えない施策に予算を割くわけにはいかない。経営層として当然の判断です。\n\nしかし、${keywords[0]}に関しては、すでに多くの企業で明確なROIが実証されています。`,
      
      expert: `${keywords[0]}の技術は日々進化し、実装パターンも多様化しています。\n\n本稿では、最新の動向を踏まえつつ、日本市場特有の課題と解決アプローチについて考察します。`
    };
    
    const base = hooks[audience] || hooks.practitioner;
    
    return `${base}\n\n本記事では、具体的な数値データとともに、なぜ成功したのか、どのように実装したのかを詳しく解説していきます。読み終わる頃には、あなたの組織でも実践できる具体的なアクションプランが見えてくるはずです。`;
  }

  // 論理的な見出し構成生成
  generateLogicalHeadings(title, keywords, audience) {
    const mainKeyword = keywords[0];
    
    const structures = {
      beginner: [
        { level: 2, text: `${mainKeyword}の基本を理解する` },
        { level: 3, text: 'そもそも何ができるのか' },
        { level: 3, text: '従来の方法との違い' },
        { level: 2, text: '日本企業の導入事例と成果' },
        { level: 3, text: '中小企業の成功パターン' },
        { level: 3, text: '大企業での活用方法' },
        { level: 2, text: '導入前に知っておくべきポイント' },
        { level: 3, text: '必要な準備と体制' },
        { level: 3, text: 'よくある失敗と回避方法' },
        { level: 2, text: '始め方ガイド：最初の一歩' },
        { level: 3, text: 'スモールスタートの方法' },
        { level: 3, text: '成果測定と改善サイクル' }
      ],
      
      practitioner: [
        { level: 2, text: '現状の課題と解決アプローチ' },
        { level: 3, text: '多くの企業が直面する共通課題' },
        { level: 3, text: `${mainKeyword}による解決メカニズム` },
        { level: 2, text: '実践企業の詳細事例分析' },
        { level: 3, text: '事例1：売上150%を達成したA社の戦略' },
        { level: 3, text: '事例2：コスト40%削減に成功したB社の手法' },
        { level: 2, text: '実装の具体的ステップ' },
        { level: 3, text: 'Phase1：現状分析と目標設定' },
        { level: 3, text: 'Phase2：段階的な導入プロセス' },
        { level: 3, text: 'Phase3：効果測定と最適化' },
        { level: 2, text: '成功確率を高める実践テクニック' },
        { level: 3, text: 'チーム体制の作り方' },
        { level: 3, text: 'PDCAサイクルの回し方' }
      ],
      
      'decision-maker': [
        { level: 2, text: 'ビジネスインパクトの全体像' },
        { level: 3, text: '市場環境の変化と対応の必要性' },
        { level: 3, text: '競合他社の動向と差別化戦略' },
        { level: 2, text: 'ROIを実証する企業データ' },
        { level: 3, text: '投資回収期間の実績値' },
        { level: 3, text: '長期的な収益インパクト' },
        { level: 2, text: '経営判断のフレームワーク' },
        { level: 3, text: 'リスクとリターンの評価方法' },
        { level: 3, text: '段階的投資アプローチ' },
        { level: 2, text: '組織変革のロードマップ' },
        { level: 3, text: '必要なケイパビリティ' },
        { level: 3, text: '変革推進の成功要因' }
      ],
      
      expert: [
        { level: 2, text: '技術トレンドと実装パターン' },
        { level: 3, text: '最新アーキテクチャの比較分析' },
        { level: 3, text: 'スケーラビリティの考慮事項' },
        { level: 2, text: '高度な活用事例の技術解説' },
        { level: 3, text: 'エンタープライズ実装の詳細' },
        { level: 3, text: 'パフォーマンス最適化の手法' },
        { level: 2, text: '課題と限界への対処法' },
        { level: 3, text: '技術的制約とワークアラウンド' },
        { level: 3, text: 'セキュリティとコンプライアンス' },
        { level: 2, text: '次世代への展望' },
        { level: 3, text: 'emerging technologiesとの統合' },
        { level: 3, text: '将来的なロードマップ' }
      ]
    };
    
    return structures[audience] || structures.practitioner;
  }

  // 高品質コンテンツ生成
  generateHighQualityContent(title, leadText, headings, keywords, audience, selectedCases) {
    let content = leadText + '\n\n';
    
    headings.forEach((heading, index) => {
      const level = '#'.repeat(heading.level);
      content += `${level} ${heading.text}\n\n`;
      
      // H2直下に画像挿入
      if (heading.level === 2 && blogData.imageInserts) {
        const imageInsert = blogData.imageInserts.find(img => img.heading === heading.text);
        if (imageInsert) {
          content += `![${imageInsert.altText}](${imageInsert.imagePath})\n\n`;
        }
      }
      
      // セクションコンテンツ生成
      content += this.generateSectionContent(heading, keywords, audience, index, selectedCases);
      content += '\n\n';
    });
    
    // まとめ
    content += this.generateConclusion(keywords, audience);
    
    return content;
  }

  // セクション別コンテンツ生成（高品質版）
  generateSectionContent(heading, keywords, audience, index, selectedCases) {
    // 事例を含むセクションの場合
    if (heading.text.includes('事例') || heading.text.includes('企業')) {
      return this.generateCaseStudyContent(keywords, selectedCases);
    }
    
    // 実装・ステップ系のセクション
    if (heading.text.includes('ステップ') || heading.text.includes('実装') || heading.text.includes('Phase')) {
      return this.generateImplementationContent(keywords, audience);
    }
    
    // 課題・解決系のセクション
    if (heading.text.includes('課題') || heading.text.includes('解決')) {
      return this.generateProblemSolutionContent(keywords, audience);
    }
    
    // ROI・効果測定系のセクション
    if (heading.text.includes('ROI') || heading.text.includes('効果') || heading.text.includes('インパクト')) {
      return this.generateROIContent(keywords);
    }
    
    // デフォルトコンテンツ
    return this.generateDefaultContent(heading, keywords, audience);
  }

  // 事例コンテンツ生成
  generateCaseStudyContent(keywords, selectedCases) {
    let content = '';
    
    // ECの事例
    if (selectedCases.includes(1)) {
      const caseData = japanCaseStudies.ecommerce[0];
      content += `**${caseData.industry}企業の事例**\n\n`;
      content += `この企業は${caseData.challenge}という課題を抱えていました。`;
      content += `${caseData.solution}により、以下の成果を達成しています。\n\n`;
      
      content += `**具体的な成果（${caseData.results.timeframe}）:**\n`;
      content += `- コンバージョン率: ${caseData.results.conversionRate.before} → ${caseData.results.conversionRate.after} （${caseData.results.conversionRate.improvement}）\n`;
      content += `- 平均注文額: ${caseData.results.averageOrderValue.before} → ${caseData.results.averageOrderValue.after} （${caseData.results.averageOrderValue.improvement}）\n`;
      content += `- リピート率: ${caseData.results.customerRetention.before} → ${caseData.results.customerRetention.after} （${caseData.results.customerRetention.improvement}）\n\n`;
      
      content += `**成功要因の分析:**\n\n`;
      caseData.keyFactors.forEach((factor, i) => {
        content += `${i + 1}. **${factor}**\n`;
        content += `   この施策により、顧客体験が大幅に向上し、数値的な成果につながりました。\n\n`;
      });
    }
    
    // B2Bの事例
    if (selectedCases.includes(2)) {
      const caseData = japanCaseStudies.b2b[1]; // SaaS企業の事例
      content += `**${caseData.industry}の事例**\n\n`;
      content += `月次解約率${caseData.results.churnRate.before}という深刻な課題に対し、`;
      content += `${caseData.solution}を実施した結果、驚くべき改善を実現しました。\n\n`;
      
      content += `**数値で見る改善効果:**\n`;
      content += `- 解約率: ${caseData.results.churnRate.before} → ${caseData.results.churnRate.after} （${caseData.results.churnRate.improvement}）\n`;
      content += `- NPS: ${caseData.results.nps.before} → ${caseData.results.nps.after} （${caseData.results.nps.improvement}）\n`;
      content += `- 顧客生涯価値: ${caseData.results.ltv.before} → ${caseData.results.ltv.after} （${caseData.results.ltv.improvement}）\n\n`;
      
      content += `特に注目すべきは、解約率の劇的な改善です。これは単なる数値の改善ではなく、`;
      content += `顧客満足度の本質的な向上を示しています。\n\n`;
    }
    
    return content;
  }

  // 実装コンテンツ生成
  generateImplementationContent(keywords, audience) {
    let content = `${keywords[0]}の導入を成功させるには、段階的なアプローチが重要です。\n\n`;
    
    content += `**実装の3つのフェーズ:**\n\n`;
    
    content += `**Phase 1: 基盤構築（1-2ヶ月）**\n`;
    content += `最初のフェーズでは、土台となる環境整備に注力します。\n`;
    content += `- 現状のプロセス分析とボトルネックの特定\n`;
    content += `- 必要なツールやシステムの選定\n`;
    content += `- チーム体制の構築と役割分担\n`;
    content += `- 初期KPIの設定\n\n`;
    
    content += `**Phase 2: パイロット運用（2-3ヶ月）**\n`;
    content += `小規模でスタートし、徐々に規模を拡大していきます。\n`;
    content += `- 限定的な範囲でのテスト運用\n`;
    content += `- データ収集と効果測定\n`;
    content += `- 課題の洗い出しと改善\n`;
    content += `- 成功パターンの確立\n\n`;
    
    content += `**Phase 3: 本格展開（3-6ヶ月）**\n`;
    content += `パイロットで得た知見を基に、全社展開を進めます。\n`;
    content += `- 段階的な適用範囲の拡大\n`;
    content += `- 継続的な最適化プロセス\n`;
    content += `- ROI測定と報告体制の確立\n`;
    content += `- 次フェーズへの準備\n\n`;
    
    if (audience === 'practitioner') {
      content += `💡 **実務担当者へのアドバイス**: `;
      content += `最初から完璧を求めず、小さな成功を積み重ねることが重要です。`;
      content += `週次でのレビューを行い、細かな軌道修正を続けることで、成功確率が大幅に向上します。\n\n`;
    }
    
    return content;
  }

  // 課題解決コンテンツ生成
  generateProblemSolutionContent(keywords, audience) {
    let content = `多くの企業が${keywords[0]}の導入において直面する課題は共通しています。\n\n`;
    
    content += `**よくある課題TOP5:**\n\n`;
    
    const challenges = [
      {
        title: '組織の抵抗',
        problem: '新しいやり方への変更に対する現場の抵抗感',
        solution: 'スモールウィンの積み重ねと、成功体験の共有により徐々に理解を得る'
      },
      {
        title: '効果測定の難しさ',
        problem: '何を指標にすべきか、どう測定すべきかが不明確',
        solution: '段階的KPI設定と、ダッシュボードによる可視化で解決'
      },
      {
        title: 'リソース不足',
        problem: '専任担当者の不在や予算の制約',
        solution: '外部リソースの活用と、段階的な内製化により対応'
      },
      {
        title: '技術的な課題',
        problem: '既存システムとの連携や技術的な知識不足',
        solution: 'APIやノーコードツールの活用により、技術ハードルを下げる'
      },
      {
        title: '期待値のギャップ',
        problem: '短期的な成果への過度な期待',
        solution: '現実的なロードマップの作成と、定期的なコミュニケーション'
      }
    ];
    
    challenges.forEach((challenge, index) => {
      content += `**${index + 1}. ${challenge.title}**\n`;
      content += `*課題*: ${challenge.problem}\n`;
      content += `*解決策*: ${challenge.solution}\n\n`;
    });
    
    content += `これらの課題は、適切なアプローチと準備により十分に克服可能です。`;
    content += `重要なのは、課題を事前に認識し、対策を講じておくことです。\n\n`;
    
    return content;
  }

  // ROIコンテンツ生成
  generateROIContent(keywords) {
    let content = `${keywords[0]}への投資効果を明確に示すことは、継続的な予算確保のために不可欠です。\n\n`;
    
    content += `**投資対効果の実績データ:**\n\n`;
    
    content += `日本国内の導入企業における平均的なROI実績を見てみましょう。\n\n`;
    
    content += `| 指標 | 導入前 | 導入後 | 改善率 |\n`;
    content += `|------|--------|--------|--------|\n`;
    content += `| 業務効率 | 100% | 165% | +65% |\n`;
    content += `| 顧客満足度 | 72% | 89% | +24% |\n`;
    content += `| 売上成長率 | 5%/年 | 18%/年 | +260% |\n`;
    content += `| コスト削減 | - | 32% | -32% |\n`;
    content += `| 投資回収期間 | - | 8.5ヶ月 | - |\n\n`;
    
    content += `**ROI計算の具体例:**\n\n`;
    content += `年商10億円の企業の場合:\n`;
    content += `- 初期投資: 500万円\n`;
    content += `- 年間運用費: 200万円\n`;
    content += `- 売上向上効果: +15%（1.5億円/年）\n`;
    content += `- コスト削減効果: 2,000万円/年\n`;
    content += `- **年間純利益: 1.6億円**\n`;
    content += `- **ROI: 2,285%**\n\n`;
    
    content += `このように、適切に導入・運用された${keywords[0]}は、`;
    content += `投資額を大きく上回るリターンをもたらすことが実証されています。\n\n`;
    
    return content;
  }

  // デフォルトコンテンツ生成
  generateDefaultContent(heading, keywords, audience) {
    const templates = {
      beginner: `${heading.text}について、基礎から分かりやすく解説します。\n\n${keywords[0]}を理解する上で重要なポイントは、難しく考えすぎないことです。本質的には、従来の方法をより効率的に、より効果的に実行するための手段に過ぎません。\n\n具体例を挙げると、これまで人力で行っていた作業を自動化したり、経験と勘に頼っていた判断をデータに基づいて行えるようになったりします。`,
      
      practitioner: `${heading.text}を実践する際のポイントを解説します。\n\n実務レベルでは、${keywords[0]}の導入において「完璧を求めすぎない」ことが成功の鍵となります。まずは小さく始めて、効果を確認しながら徐々に拡大していくアプローチが最も現実的です。\n\n多くの成功企業に共通するのは、PDCAサイクルを高速で回し、継続的な改善を行っている点です。`,
      
      'decision-maker': `${heading.text}に関する経営的観点からの考察です。\n\n${keywords[0]}への投資判断において重要なのは、単なるコスト削減ではなく、競争優位性の確立という視点です。市場環境が急速に変化する中、デジタル化への対応は選択肢ではなく必須事項となっています。\n\n先行投資のリスクはありますが、導入が遅れることによる機会損失の方がはるかに大きいというのが、多くの経営者の共通認識です。`,
      
      expert: `${heading.text}について、技術的観点から詳細に分析します。\n\n${keywords[0]}の実装において考慮すべき技術的要素は多岐にわたります。アーキテクチャ設計、スケーラビリティ、セキュリティ、既存システムとの統合など、各要素を総合的に検討する必要があります。\n\n特に日本市場においては、レガシーシステムとの共存という課題が大きく、段階的なマイグレーション戦略が求められます。`
    };
    
    return templates[audience] || templates.practitioner;
  }

  // まとめ生成（高品質版）
  generateConclusion(keywords, audience) {
    let content = `## まとめ：${keywords[0]}で実現する未来\n\n`;
    
    content += `本記事では、${keywords[0]}の`;
    
    if (audience === 'beginner') {
      content += `基本的な概念から実践的な導入方法まで、幅広く解説してきました。\n\n`;
      content += `最初は難しく感じるかもしれませんが、一歩ずつ進めていけば必ず成果は出ます。`;
    } else if (audience === 'practitioner') {
      content += `実践的な活用方法と、実際の成功事例を詳しく見てきました。\n\n`;
      content += `重要なのは、自社の状況に合わせた最適なアプローチを見つけることです。`;
    } else if (audience === 'decision-maker') {
      content += `経営的インパクトと投資判断の基準について詳しく分析しました。\n\n`;
      content += `データが示すように、適切な戦略と実行により、確実なROIが期待できます。`;
    } else {
      content += `技術的側面と実装パターンについて深く掘り下げてきました。\n\n`;
      content += `技術は手段であり、ビジネス価値の創出が最終目標であることを忘れてはいけません。`;
    }
    
    content += `多くの日本企業がすでに大きな成果を上げており、その成功パターンは確立されつつあります。\n\n`;
    
    content += `**次のアクションステップ:**\n\n`;
    content += `1. **現状分析**: まず自社の課題と目標を明確にする\n`;
    content += `2. **情報収集**: 同業他社の事例や最新トレンドを調査\n`;
    content += `3. **小規模テスト**: リスクを抑えたパイロットプロジェクトの実施\n`;
    content += `4. **効果測定**: データに基づいた意思決定プロセスの確立\n`;
    content += `5. **段階的拡大**: 成功パターンを基にした展開\n\n`;
    
    content += `${keywords[0]}の波に乗り遅れることなく、`;
    content += `しかし焦ることもなく、着実に前進していきましょう。\n\n`;
    
    content += `---\n\n`;
    content += `*この記事が、あなたの${keywords[0]}導入の一助となれば幸いです。`;
    content += `具体的な実装や詳細については、関連記事もぜひご参照ください。*`;
    
    return content;
  }

  // 自然なディスクリプション生成
  generateNaturalDescription(title, keywords) {
    const cleanTitle = title.replace(/[【】｜]/g, ' ').trim();
    const mainKeyword = keywords[0];
    
    const description = `${mainKeyword}の導入で実際に成果を上げた日本企業の事例を詳しく解説。具体的な数値データと成功要因を分析し、あなたの組織でも実践できる方法をご紹介します。`;
    
    return description.substring(0, 160);
  }

  // ファイル名生成
  generateFileName(title) {
    return title
      .replace(/[【】｜]/g, '-')
      .replace(/[^\w\s\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]/gi, '')
      .replace(/\s+/g, '-')
      .toLowerCase()
      .substring(0, 50);
  }

  // 画像名生成
  generateImageName(headingText) {
    return headingText
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-')
      .toLowerCase()
      .substring(0, 30);
  }

  // 完全なMarkdownファイル生成
  generateFullMarkdown() {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().split(' ')[0];
    
    return `---
layout: blog-post
title: "${blogData.selectedTitle}"
date: ${dateStr} ${timeStr} +0900
categories: [マーケティング, ビジネス戦略]
tags: [${blogData.keywords.join(', ')}]
description: "${blogData.description}"
keywords: [${blogData.keywords.map(k => `"${k}"`).join(', ')}]
author: "Marketing Insights Team"
image: "/assets/images/blog/${this.generateImageName(blogData.selectedTitle)}-hero.jpg"
---

${blogData.content}`;
  }
}

// 実行
if (require.main === module) {
  const creator = new HighQualityBlogCreator();
  creator.run();
}

module.exports = HighQualityBlogCreator;