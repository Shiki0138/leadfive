/**
 * 革新的なブログテンプレート集
 * 読者の期待を超える、想像を超えるコンテンツを生成
 */

class BlogTemplates {
  constructor() {
    this.revolutionaryTemplates = {
      'shock-and-awe': {
        name: '衝撃と感動型',
        description: '読者に強烈なインパクトを与え、行動を促す',
        sections: [
          { 
            title: '衝撃的な事実の提示',
            template: '「もしあなたが{topic}で{negative_result}なら、この統計を見てください。実は{shocking_stat}の企業が、たった一つの要素を見落としているだけで、{lost_opportunity}を失っています。」'
          },
          {
            title: '隠された真実の暴露',
            template: '業界の常識は間違っていました。{industry_myth}という考えは、実は{instinct}を無視した古い発想です。最新の研究で判明した真実は...'
          },
          {
            title: '革命的な解決策',
            template: 'これまでの{topic}の概念を覆す、全く新しいアプローチがあります。それは{instinct}×AIの融合による{revolutionary_method}です。'
          },
          {
            title: '未来への招待',
            template: 'あなたのビジネスが{future_vision}になる未来を想像してください。それは夢物語ではありません。すでに{success_count}社が実現しています。'
          }
        ]
      },
      
      'story-transformation': {
        name: '物語変革型',
        description: 'ストーリーテリングで感情に訴求し、変革を促す',
        sections: [
          {
            title: '主人公の苦悩',
            template: '{industry}業界のA社は、{problem}に悩んでいました。何を試しても{failure_result}。社長の{ceo_name}さんは、もう諦めかけていました...'
          },
          {
            title: '運命の出会い',
            template: 'そんな時、ある{encounter}がきっかけで、{instinct}の重要性に気づきます。「なぜ今まで、この視点で考えなかったんだろう」'
          },
          {
            title: '挑戦と変革',
            template: '半信半疑で始めた{new_approach}。最初は{initial_challenge}もありました。しかし、データが示し始めた変化に、チーム全員が驚きました。'
          },
          {
            title: '劇的な結末',
            template: '3ヶ月後、{dramatic_result}を達成。今では{ceo_quote}と語るA社。この変革は、あなたの会社でも起こせます。'
          }
        ]
      },
      
      'scientific-breakthrough': {
        name: '科学的発見型',
        description: 'データと研究結果で論理的に説得する',
        sections: [
          {
            title: '研究の背景',
            template: '{university}大学と{company}の共同研究により、{topic}における画期的な発見がありました。{sample_size}のサンプルを{duration}にわたって分析した結果...'
          },
          {
            title: 'データが示す真実',
            template: '統計的に有意な差（p<0.01）で、{instinct}を活用したグループは{percentage}%の改善を示しました。特に注目すべきは{key_finding}です。'
          },
          {
            title: '実践への応用',
            template: 'この研究結果を実際のビジネスに応用すると、{practical_application}が可能になります。具体的な実装方法は以下の通りです。'
          },
          {
            title: '検証と最適化',
            template: '導入企業での追跡調査では、平均{roi}%のROIを達成。さらに{optimization_method}により、効果は継続的に向上しています。'
          }
        ]
      },
      
      'future-vision': {
        name: '未来予測型',
        description: '未来のビジョンを示し、先行者利益を訴求',
        sections: [
          {
            title: '2025年の{topic}',
            template: '今から{months}ヶ月後、{topic}の世界は劇的に変わっています。{future_change}が当たり前になり、{old_method}を使っている企業は...'
          },
          {
            title: 'パラダイムシフト',
            template: '{instinct}を理解している企業とそうでない企業の差は、もはや埋められないほど開いています。勝者と敗者を分けたのは{key_difference}でした。'
          },
          {
            title: '今すぐ始める理由',
            template: 'なぜ今なのか？それは{urgency_reason}だからです。先行者利益は{early_adopter_benefit}と推定されています。'
          },
          {
            title: '未来への第一歩',
            template: 'あなたが踏み出す最初の一歩が、{company_future}を決定づけます。まずは{first_action}から始めましょう。'
          }
        ]
      },
      
      'problem-agitation-hope': {
        name: '問題増幅希望型',
        description: '問題を深掘りし、希望への道筋を示す',
        sections: [
          {
            title: '見過ごされている危機',
            template: 'あなたは気づいていないかもしれませんが、{hidden_problem}が静かに{business_aspect}を蝕んでいます。'
          },
          {
            title: '問題の本質',
            template: '表面的な{symptom}は氷山の一角に過ぎません。真の問題は{root_cause}にあり、それは{instinct}の無視から生じています。'
          },
          {
            title: '放置した場合の未来',
            template: 'このまま何もしなければ、{timeframe}以内に{worst_scenario}という事態に陥る可能性があります。実際、{failed_company}社は...'
          },
          {
            title: '希望の光',
            template: 'しかし、まだ間に合います。{solution_method}を今すぐ始めれば、{positive_outcome}を実現できます。必要なのは{required_action}だけです。'
          }
        ]
      },
      
      'exclusive-insight': {
        name: '独占的洞察型',
        description: '特別な知識を共有し、優越感を与える',
        sections: [
          {
            title: '業界のインサイダー情報',
            template: '{industry}業界のトップ{top_percentage}%だけが知っている秘密があります。それは{insider_knowledge}という事実です。'
          },
          {
            title: 'なぜ公開されないのか',
            template: 'この情報が一般に知られていない理由は{secrecy_reason}。しかし、{instinct}の観点から見れば、答えは明白です。'
          },
          {
            title: '実践者の証言',
            template: '「{testimonial_quote}」- この方法を実践している{practitioner_title}は語ります。彼らの共通点は{common_trait}でした。'
          },
          {
            title: 'あなたも仲間入り',
            template: '今、この知識を手に入れたあなたは、{elite_group}の仲間入りです。次は{next_step}を実行する番です。'
          }
        ]
      }
    };

    this.dynamicElements = {
      hooks: {
        question: [
          'なぜ{competitor}は{achievement}を達成できたのに、あなたはできないのでしょうか？',
          'もし{desired_result}を{timeframe}で実現できるとしたら、どうしますか？',
          '{percentage}%の企業が失敗する{topic}、あなたは大丈夫ですか？'
        ],
        statement: [
          '{topic}の常識は、もう通用しません。',
          'AIが暴いた{topic}の真実に、業界が震撼しています。',
          '{famous_company}も実践している{method}を、あなたはまだ知らない。'
        ],
        statistic: [
          '驚愕の事実：{stat_subject}の{percentage}%が{surprising_fact}',
          'データが証明：{method}実践企業の売上は平均{increase}%増',
          '{timeframe}で{result}を達成した企業の共通点とは'
        ]
      },
      
      transitions: {
        moreover: ['さらに驚くべきことに', 'それだけではありません', '加えて注目すべきは'],
        however: ['しかし、ここで重要なのは', 'ただし、忘れてはならないのが', '一方で'],
        therefore: ['つまり', 'したがって', 'これが意味するのは'],
        finally: ['そして最終的に', '結論として', 'すべてを統合すると']
      },
      
      power_words: {
        emotion: ['衝撃', '革命', '覚醒', '解放', '突破', '飛躍', '覚悟', '決断'],
        urgency: ['今すぐ', '残りわずか', '期間限定', '先着順', '最後のチャンス'],
        exclusivity: ['極秘', '初公開', '限定公開', '特別提供', 'VIP向け'],
        transformation: ['激変', '一変', '急成長', '爆発的', '劇的改善']
      },
      
      data_points: {
        percentages: [73, 84, 92, 127, 234, 312, 467],
        timeframes: ['24時間', '3日間', '1週間', '2週間', '1ヶ月', '3ヶ月'],
        multipliers: ['2倍', '3倍', '5倍', '10倍', '20倍'],
        companies: ['Google', 'Amazon', 'トヨタ', 'ソフトバンク', 'ユニクロ']
      }
    };
  }

  /**
   * 革新的なテンプレートを選択
   */
  selectRevolutionaryTemplate(topic, instinct, targetAudience) {
    // トピックと本能、ターゲットに基づいて最適なテンプレートを選択
    const templates = Object.values(this.revolutionaryTemplates);
    
    // スコアリングロジック
    let bestTemplate = templates[0];
    let highestScore = 0;
    
    templates.forEach(template => {
      let score = 0;
      
      // ターゲットオーディエンスとの相性
      if (targetAudience === 'advanced' && template.name.includes('科学的')) score += 3;
      if (targetAudience === 'beginner' && template.name.includes('物語')) score += 3;
      
      // 本能との相性
      if (instinct.name.includes('階層') && template.name.includes('独占')) score += 2;
      if (instinct.name.includes('学習') && template.name.includes('科学')) score += 2;
      
      if (score > highestScore) {
        highestScore = score;
        bestTemplate = template;
      }
    });
    
    return bestTemplate;
  }

  /**
   * ダイナミックコンテンツを生成
   */
  generateDynamicContent(template, variables) {
    let content = template;
    
    // 変数を置換
    Object.keys(variables).forEach(key => {
      const regex = new RegExp(`{${key}}`, 'g');
      content = content.replace(regex, variables[key]);
    });
    
    // ランダム要素を追加
    content = this.addRandomElements(content);
    
    return content;
  }

  /**
   * ランダム要素を追加
   */
  addRandomElements(content) {
    // パワーワードをランダムに挿入
    const powerWords = this.dynamicElements.power_words;
    const categories = Object.keys(powerWords);
    
    categories.forEach(category => {
      const words = powerWords[category];
      const randomWord = words[Math.floor(Math.random() * words.length)];
      content = content.replace(`{${category}_word}`, randomWord);
    });
    
    // データポイントをランダムに選択
    const dataPoints = this.dynamicElements.data_points;
    Object.keys(dataPoints).forEach(key => {
      const values = dataPoints[key];
      const randomValue = values[Math.floor(Math.random() * values.length)];
      content = content.replace(`{random_${key}}`, randomValue);
    });
    
    return content;
  }

  /**
   * 感情的な訴求ポイントを生成
   */
  generateEmotionalTriggers(instinct) {
    const triggers = {
      '生存本能': ['安全', 'リスク回避', '損失回避', '確実性'],
      '生殖本能': ['魅力', 'ステータス', '優位性', '選ばれる'],
      '養育本能': ['成長', 'サポート', '見守り', '育成'],
      '縄張り本能': ['独占', '所有', 'コントロール', '支配'],
      '階層本能': ['地位', '評価', '承認', '優越'],
      '学習本能': ['発見', '理解', '習得', 'マスター'],
      '伝達本能': ['共有', '影響', 'つながり', '発信'],
      '遊戯本能': ['楽しさ', '挑戦', '達成', 'ゲーム化']
    };
    
    return triggers[instinct.name] || ['成功', '達成', '改善', '向上'];
  }

  /**
   * CTA（Call to Action）を生成
   */
  generatePowerfulCTA(instinct, urgency = 'medium') {
    const ctas = {
      high: [
        `今すぐ無料診断を受けて、${instinct.name}を最大化する方法を発見する`,
        `残り24時間限定！${instinct.name}活用の極意を無料で手に入れる`,
        `先着10社限定：${instinct.name}×AI戦略の個別相談に申し込む`
      ],
      medium: [
        `${instinct.name}を活用した成功事例集を無料でダウンロード`,
        `あなたのビジネスに最適な${instinct.name}戦略を診断する`,
        `${instinct.name}マーケティングの無料ガイドを受け取る`
      ],
      low: [
        `${instinct.name}について詳しく学ぶ`,
        `関連記事を読んで理解を深める`,
        `メールマガジンに登録して最新情報を受け取る`
      ]
    };
    
    const selectedCTAs = ctas[urgency] || ctas.medium;
    return selectedCTAs[Math.floor(Math.random() * selectedCTAs.length)];
  }
}

// エクスポート
if (typeof window !== 'undefined') {
  window.BlogTemplates = BlogTemplates;
}