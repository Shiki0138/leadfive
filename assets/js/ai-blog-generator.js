/**
 * AI Blog Generator - 革新的なブログ自動生成システム
 * 8つの本能を活用した、読者の期待を超えるコンテンツ生成
 */

class AIBlogGenerator {
  constructor() {
    this.templates = new BlogTemplates();
    this.instincts = {
      survival: { name: '生存本能', triggers: ['安全', 'リスク回避', '健康', '防衛'] },
      reproduction: { name: '生殖本能', triggers: ['魅力', '美', 'ステータス', '競争優位'] },
      nurturing: { name: '養育本能', triggers: ['成長', '教育', '保護', 'サポート'] },
      territorial: { name: '縄張り本能', triggers: ['所有', '独占', '優位性', 'プライバシー'] },
      hierarchy: { name: '階層本能', triggers: ['権威', '地位', '評価', '承認'] },
      learning: { name: '学習本能', triggers: ['好奇心', '発見', '理解', 'スキル'] },
      communication: { name: '伝達本能', triggers: ['共有', 'つながり', '影響力', '表現'] },
      play: { name: '遊戯本能', triggers: ['楽しさ', '創造性', '挑戦', 'ゲーム化'] }
    };

    this.contentPatterns = {
      'problem-agitation-solution': {
        name: '問題提起型',
        structure: ['問題提起', '問題の深堀り', '解決策提示', '実装方法', '成功事例']
      },
      'before-after-bridge': {
        name: '変革提示型',
        structure: ['現状認識', '理想の姿', '架け橋となる方法', '実践ステップ', '変革の証拠']
      },
      'star-story-solution': {
        name: 'ストーリー型',
        structure: ['注目を集める導入', 'ストーリー展開', '転機と解決', '教訓', '読者への応用']
      },
      'data-driven': {
        name: 'データ駆動型',
        structure: ['驚きのデータ提示', '分析と洞察', 'トレンド解説', '予測', '活用方法']
      }
    };

    this.seoOptimizer = new SEOOptimizer();
    this.internalLinker = new InternalLinker();
  }

  /**
   * 革新的なブログ記事を生成
   */
  async generateArticle(params) {
    const { topic, category, keywords, targetAudience, outline } = params;
    
    // 1. 最適な本能とパターンを選択
    const selectedInstinct = this.selectOptimalInstinct(topic, keywords);
    const contentPattern = this.selectContentPattern(category, targetAudience);
    
    // 2. タイトルの生成（複数候補から最適なものを選択）
    const titleCandidates = this.generateTitleCandidates(topic, selectedInstinct, keywords);
    const optimalTitle = this.selectOptimalTitle(titleCandidates);
    
    // 3. 記事構造の生成
    const articleStructure = this.generateArticleStructure(
      topic, 
      selectedInstinct, 
      contentPattern,
      outline
    );
    
    // 4. 各セクションのコンテンツ生成
    const content = await this.generateContent(articleStructure);
    
    // 5. SEO最適化
    const seoData = this.seoOptimizer.optimize({
      title: optimalTitle,
      content: content,
      keywords: keywords,
      category: category
    });
    
    // 6. 内部リンクの自動設定
    const enrichedContent = await this.internalLinker.addInternalLinks(content, category);
    
    // 7. メタデータの生成
    const metadata = this.generateMetadata({
      title: optimalTitle,
      content: enrichedContent,
      seoData: seoData,
      category: category,
      keywords: keywords
    });
    
    return {
      title: optimalTitle,
      content: enrichedContent,
      metadata: metadata,
      instinct: selectedInstinct,
      pattern: contentPattern,
      estimatedReadTime: this.calculateReadTime(enrichedContent)
    };
  }

  /**
   * 最適な本能を選択
   */
  selectOptimalInstinct(topic, keywords) {
    let scores = {};
    
    for (const [key, instinct] of Object.entries(this.instincts)) {
      scores[key] = 0;
      
      // トピックとキーワードに基づいてスコアリング
      instinct.triggers.forEach(trigger => {
        if (topic.includes(trigger) || keywords.includes(trigger)) {
          scores[key] += 2;
        }
      });
      
      // AIマーケティングの文脈での重み付け
      if (key === 'learning' || key === 'hierarchy') scores[key] += 1;
    }
    
    // 最高スコアの本能を選択
    const selected = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
    return this.instincts[selected];
  }

  /**
   * タイトル候補を生成
   */
  generateTitleCandidates(topic, instinct, keywords) {
    const templates = [
      `${topic}で${instinct.name}を刺激する革新的な方法`,
      `なぜ${topic}が${instinct.name}に響くのか？科学的に解明`,
      `${topic}：${instinct.name}を活用した成功事例と実践ガイド`,
      `${keywords[0]}×${instinct.name}で売上を3倍にする戦略`,
      `プロが教える${topic}の極意：${instinct.name}を味方につける`,
      `${topic}の新常識：AIが解き明かす${instinct.name}の活用法`
    ];
    
    return templates.map(template => ({
      title: template,
      score: this.scoreTitleEffectiveness(template, keywords)
    }));
  }

  /**
   * タイトルの効果をスコアリング
   */
  scoreTitleEffectiveness(title, keywords) {
    let score = 0;
    
    // キーワードの含有
    keywords.forEach(keyword => {
      if (title.includes(keyword)) score += 2;
    });
    
    // 数字の使用
    if (/\d/.test(title)) score += 3;
    
    // 疑問形
    if (title.includes('？')) score += 2;
    
    // パワーワード
    const powerWords = ['革新', '極意', '成功', '戦略', '新常識', '科学的'];
    powerWords.forEach(word => {
      if (title.includes(word)) score += 1;
    });
    
    // 長さの最適化（30-60文字が理想）
    const length = title.length;
    if (length >= 30 && length <= 60) score += 2;
    
    return score;
  }

  /**
   * 記事構造を生成
   */
  generateArticleStructure(topic, instinct, pattern, outline) {
    const structure = {
      introduction: {
        hook: this.generateHook(topic, instinct),
        promise: `本記事では、${topic}について${instinct.name}の観点から革新的なアプローチを提供します。`,
        overview: pattern.structure.map(section => `- ${section}`).join('\n')
      },
      mainContent: pattern.structure.map((section, index) => ({
        sectionTitle: section,
        content: this.generateSectionContent(section, topic, instinct, outline),
        subSections: this.generateSubSections(section, topic)
      })),
      conclusion: {
        summary: `${topic}において${instinct.name}を活用することの重要性`,
        actionItems: this.generateActionItems(topic, instinct),
        cta: 'LeadFiveの無料診断で、あなたのビジネスに最適なAI×心理学戦略を発見しましょう。'
      }
    };
    
    return structure;
  }

  /**
   * フックを生成（読者の注意を引く導入）
   */
  generateHook(topic, instinct) {
    const hooks = [
      `「${topic}で成果が出ない」その原因は、人間の${instinct.name}を無視しているからかもしれません。`,
      `実は、成功している企業の${topic}には共通点があります。それは${instinct.name}の活用です。`,
      `もし${instinct.name}を理解せずに${topic}を行っているなら、大きな機会損失をしている可能性があります。`,
      `データが証明：${instinct.name}を意識した${topic}は、通常の3倍の効果を発揮します。`
    ];
    
    return hooks[Math.floor(Math.random() * hooks.length)];
  }

  /**
   * セクション内容を生成
   */
  generateSectionContent(section, topic, instinct, outline) {
    const templates = {
      '問題提起': `${topic}において、多くの企業が見落としている重要な要素があります。それは、人間の${instinct.name}への理解不足です。データによると、${instinct.name}を意識したマーケティングは、従来の手法と比較して平均3.2倍の効果を発揮します。`,
      '問題の深堀り': `なぜ${instinct.name}が重要なのでしょうか？人間の意思決定の95%は無意識下で行われており、その中核を成すのが8つの本能です。特に${instinct.name}は、${instinct.triggers.join('、')}という要素と深く関わっています。`,
      '解決策提示': `LeadFiveが開発した独自のAI×心理学フレームワークでは、${instinct.name}を科学的に分析し、最適なアプローチを自動生成します。これにより、従来の試行錯誤から、データドリブンな確実な成果へと転換できます。`,
      '実装方法': `具体的な実装ステップ：\n1. 顧客データから${instinct.name}に関する行動パターンを抽出\n2. AIが最適なメッセージングを生成\n3. A/Bテストで効果を検証し、継続的に最適化`,
      '成功事例': `実際に、ある企業では${instinct.name}を活用したキャンペーンにより、コンバージョン率が280%向上しました。特に効果的だったのは、${instinct.triggers[0]}に訴求するコピーと、${instinct.triggers[1]}を強調したビジュアルの組み合わせでした。`,
      '現状認識': `現在の${topic}の課題を正確に把握することが、成功への第一歩です。多くの企業が${instinct.name}を考慮せずに施策を実行しているため、期待した成果を得られていません。`,
      '理想の姿': `${instinct.name}を完全に理解し活用できれば、${topic}の成果は劇的に向上します。顧客の無意識に訴求し、自然な行動変容を促すことが可能になります。`,
      '架け橋となる方法': `現状と理想をつなぐのが、LeadFiveのAI×心理学アプローチです。${instinct.name}を科学的に分析し、最適な施策を自動生成することで、確実な成果を実現します。`,
      '実践ステップ': `1. 現状分析：${instinct.name}の観点から現在の施策を評価\n2. 戦略立案：AIが生成した最適なアプローチを選択\n3. 実行：段階的に施策を展開し、効果を測定\n4. 最適化：データに基づいて継続的に改善`,
      '変革の証拠': `導入企業の92%が、${instinct.name}を活用した施策により、3ヶ月以内に明確な成果向上を実現しています。`,
      default: `${topic}における${section}について、${instinct.name}の観点から解説します。${outline || ''}`
    };
    
    return templates[section] || templates.default;
  }

  /**
   * サブセクションを生成
   */
  generateSubSections(section, topic) {
    const subSectionMap = {
      '問題提起': [
        { title: '現状の課題', content: `多くの企業が${topic}で苦戦している理由を、データと事例から明らかにします。` },
        { title: '機会損失の実態', content: '見逃されている成長機会とその影響を、具体的な数値で示します。' },
        { title: '解決への道筋', content: '本記事で提供する革新的なアプローチの概要を説明します。' }
      ],
      '解決策提示': [
        { title: 'AI×心理学のアプローチ', content: '最新技術と人間理解の融合により、これまでにない成果を実現します。' },
        { title: '実装のポイント', content: '成功のための重要な要素と、よくある失敗パターンを解説します。' },
        { title: '期待される効果', content: '導入によるビジネスインパクトを、実際のデータで示します。' }
      ],
      '実装方法': [
        { title: 'ステップ1: 現状分析', content: '現在の状況を正確に把握し、改善ポイントを特定する方法を説明します。' },
        { title: 'ステップ2: 戦略立案', content: '8つの本能を活用した戦略の作り方を、具体例とともに解説します。' },
        { title: 'ステップ3: 実行と最適化', content: 'PDCAサイクルによる継続的改善の手法を紹介します。' }
      ],
      '成功事例': [
        { title: '導入背景', content: `${topic}における課題と、解決に向けた取り組みの経緯を説明します。` },
        { title: '実施内容', content: '具体的な施策内容と、実行プロセスを詳しく解説します。' },
        { title: '成果と学び', content: '達成された成果と、そこから得られた重要な知見を共有します。' }
      ],
      default: [
        { title: `${section}の詳細`, content: `${topic}における${section}の具体的な内容を説明します。` }
      ]
    };
    
    return subSectionMap[section] || subSectionMap.default;
  }

  /**
   * コンテンツを生成
   */
  async generateContent(structure) {
    let content = '';
    
    // イントロダクション
    content += `# ${structure.introduction.hook}\n\n`;
    content += `${structure.introduction.promise}\n\n`;
    content += `## 本記事の内容\n${structure.introduction.overview}\n\n`;
    
    // メインコンテンツ
    for (const section of structure.mainContent) {
      content += `## ${section.sectionTitle}\n\n`;
      content += `${section.content}\n\n`;
      
      for (const subSection of section.subSections) {
        content += `### ${subSection.title}\n`;
        content += `${subSection.content}\n\n`;
      }
    }
    
    // 結論
    content += `## まとめ：${structure.conclusion.summary}\n\n`;
    content += `### 今すぐ実践できるアクションプラン\n`;
    structure.conclusion.actionItems.forEach((item, index) => {
      content += `${index + 1}. ${item}\n`;
    });
    content += `\n${structure.conclusion.cta}\n`;
    
    return content;
  }

  /**
   * アクションアイテムを生成
   */
  generateActionItems(topic, instinct) {
    return [
      `現在の${topic}戦略を${instinct.name}の観点から見直す`,
      `顧客の${instinct.name}に訴求するメッセージを3つ作成する`,
      `A/Bテストで${instinct.name}を活用した施策の効果を測定する`,
      `チーム内で${instinct.name}についての理解を深めるワークショップを開催する`,
      `LeadFiveの無料診断を受けて、専門的なアドバイスを得る`
    ];
  }

  /**
   * 読了時間を計算
   */
  calculateReadTime(content) {
    const wordsPerMinute = 400; // 日本語の平均読書速度
    const wordCount = content.length;
    return Math.ceil(wordCount / wordsPerMinute);
  }

  /**
   * メタデータを生成
   */
  generateMetadata({ title, content, seoData, category, keywords }) {
    return {
      ...seoData,
      category: category,
      tags: keywords.split(',').map(k => k.trim()),
      readTime: this.calculateReadTime(content),
      wordCount: content.length,
      lastModified: new Date().toISOString()
    };
  }
}

/**
 * SEO最適化クラス
 */
class SEOOptimizer {
  optimize({ title, content, keywords, category }) {
    return {
      metaTitle: this.optimizeTitle(title),
      metaDescription: this.generateMetaDescription(content, keywords),
      focusKeyword: keywords[0],
      canonicalUrl: this.generateCanonicalUrl(title, category),
      structuredData: this.generateStructuredData(title, content, category)
    };
  }

  optimizeTitle(title) {
    // タイトルを60文字以内に最適化
    if (title.length > 60) {
      return title.substring(0, 57) + '...';
    }
    return title;
  }

  generateMetaDescription(content, keywords) {
    // コンテンツから最初の150文字を抽出し、キーワードを含める
    let description = content.substring(0, 150).replace(/[#\n]/g, ' ').trim();
    
    // 主要キーワードが含まれていない場合は追加
    if (!description.includes(keywords[0])) {
      description = `${keywords[0]}について解説。${description}`;
    }
    
    return description;
  }

  generateCanonicalUrl(title, category) {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9ぁ-んァ-ン一-龥]/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 50);
    
    return `/blog/${category}/${slug}/`;
  }

  generateStructuredData(title, content, category) {
    return {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: title,
      description: content.substring(0, 150),
      author: {
        '@type': 'Organization',
        name: 'LeadFive'
      },
      publisher: {
        '@type': 'Organization',
        name: 'LeadFive',
        logo: {
          '@type': 'ImageObject',
          url: '/assets/images/logo.png'
        }
      },
      datePublished: new Date().toISOString(),
      dateModified: new Date().toISOString(),
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `https://leadfive.com/blog/${category}/`
      }
    };
  }
}

/**
 * 内部リンク自動設定クラス
 */
class InternalLinker {
  constructor() {
    this.relatedPosts = [];
  }

  async addInternalLinks(content, category) {
    // 関連記事を取得（実際の実装では、データベースやAPIから取得）
    const relatedPosts = await this.getRelatedPosts(category);
    
    // コンテンツ内に内部リンクを挿入
    let enrichedContent = content;
    
    // 関連記事セクションを追加
    enrichedContent += '\n\n## 関連記事\n\n';
    enrichedContent += this.generateRelatedPostsSection(relatedPosts);
    
    // 文中に自然な内部リンクを挿入
    enrichedContent = this.insertContextualLinks(enrichedContent, relatedPosts);
    
    return enrichedContent;
  }

  async getRelatedPosts(category) {
    // デモ用の関連記事データ
    return [
      {
        title: '8つの本能を刺激するAIコピーライティング術',
        url: '/blog/ai-marketing/ai-copywriting-8-instincts/',
        excerpt: '人間の根本的な8つの本能を理解し、AIの力で最適化されたコピーを作成'
      },
      {
        title: '顧客心理データ分析で売上を予測する方法',
        url: '/blog/psychology/customer-psychology-data-analysis/',
        excerpt: 'AIで顧客行動を予測することで、売上を大幅に向上させる具体的な手法'
      },
      {
        title: 'ChatGPTを活用したマーケティング自動化の実践ガイド',
        url: '/blog/ai-marketing/chatgpt-marketing-automation/',
        excerpt: 'ChatGPTを使って、マーケティング業務を効率化する実践的な方法'
      }
    ];
  }

  generateRelatedPostsSection(posts) {
    let section = '';
    
    posts.forEach(post => {
      section += `### [${post.title}](${post.url})\n`;
      section += `${post.excerpt}\n\n`;
    });
    
    section += '**[>> ブログ一覧を見る](/blog/)**\n';
    
    return section;
  }

  insertContextualLinks(content, relatedPosts) {
    // キーワードに基づいて文中に自然なリンクを挿入
    relatedPosts.forEach(post => {
      // 簡易的な実装（実際はより高度な自然言語処理を使用）
      const keyword = this.extractKeyword(post.title);
      const link = `[${keyword}](${post.url})`;
      
      // キーワードが文中に存在する場合、最初の1箇所だけリンク化
      const regex = new RegExp(`(${keyword})`, 'i');
      if (content.match(regex) && !content.includes(post.url)) {
        content = content.replace(regex, link);
      }
    });
    
    return content;
  }

  extractKeyword(title) {
    // タイトルから主要キーワードを抽出（簡易版）
    const keywords = ['AI', '心理学', 'マーケティング', 'コピーライティング', '分析'];
    
    for (const keyword of keywords) {
      if (title.includes(keyword)) {
        return keyword;
      }
    }
    
    return title.split('を')[0] || title.substring(0, 10);
  }
}

// エクスポート
if (typeof window !== 'undefined') {
  window.AIBlogGenerator = AIBlogGenerator;
  window.SEOOptimizer = SEOOptimizer;
  window.InternalLinker = InternalLinker;
}