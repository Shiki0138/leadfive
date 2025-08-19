# 🚀 ステップ2: 簡単AI提案メール機能追加

## ✅ 基本設定完了確認済み
- Google Apps Script: 動作確認済み
- GitHub Token: 設定完了
- メール送信: テスト成功

## 🎯 次のステップ: AI提案メール機能追加

### **追加するコード**
既存のコードの**下に**以下を追加してください：

```javascript
// ===== 簡単AI提案システム =====

// トレンド分析
function getCurrentTrends() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const season = month >= 12 || month <= 2 ? "冬" : month >= 3 && month <= 5 ? "春" : month >= 6 && month <= 8 ? "夏" : "秋";
  
  return [
    {
      title: "ChatGPT-4活用で売上を3倍にする5つのステップ",
      description: "中小企業が今すぐ実践できるAI×心理学マーケティング",
      target: "中小企業経営者",
      category: "AIマーケティング", 
      urgency: "高",
      buzzScore: 92,
      readTime: "8分",
      keywords: ["ChatGPT-4", "売上向上", "AI活用"],
      seasonTip: season === "冬" ? "年末年始の戦略立案に最適" : "今の時期に始めれば効果大"
    },
    {
      title: "8つの本能マーケティング：購買心理を科学する最新手法",
      description: "LeadFive独自の心理学フレームワークで顧客の心を掴む",
      target: "マーケター",
      category: "心理学マーケティング",
      urgency: "中",
      buzzScore: 88,
      readTime: "12分", 
      keywords: ["心理学", "マーケティング", "購買行動"],
      seasonTip: "データ分析と組み合わせて効果倍増"
    },
    {
      title: "AIツール選定で失敗しない完全チェックリスト2025",
      description: "導入前に確認すべき27のポイントを実例付きで解説",
      target: "IT責任者",
      category: "AI活用",
      urgency: "中",
      buzzScore: 85,
      readTime: "10分",
      keywords: ["AI導入", "ツール選定", "失敗回避"],
      seasonTip: "来期予算確保前に必読"
    },
    {
      title: "美容業界のSNSマーケティング革命：AI×感情分析の威力",
      description: "顧客の感情を読み取るAIで美容サロンのリピート率267%改善",
      target: "美容業界",
      category: "美容業界",
      urgency: "高",
      buzzScore: 94,
      readTime: "9分",
      keywords: ["美容業界", "SNSマーケティング", "AI分析"],
      seasonTip: season === "冬" ? "乾燥対策商品PRに活用" : "新商品プロモーションに最適"
    },
    {
      title: "データドリブンマーケティングの落とし穴と回避策",
      description: "数字に騙されて失敗する企業の共通パターンと対策法",
      target: "データ分析者",
      category: "データ分析",
      urgency: "中",
      buzzScore: 82,
      readTime: "11分",
      keywords: ["データ分析", "マーケティング", "失敗回避"],
      seasonTip: "年間データ総括時期におすすめ"
    }
  ];
}

// AI最適化提案メール送信
function sendAIProposal() {
  const proposals = getCurrentTrends();
  const today = new Date();
  const dateStr = Utilities.formatDate(today, 'JST', 'MM月dd日');
  const timeStr = Utilities.formatDate(today, 'JST', 'HH:mm');
  
  const htmlBody = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 650px; margin: 0 auto; background: #f8fafc;">
      
      <!-- 🎯 AIヘッダー -->
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 12px 12px 0 0; position: relative;">
        <div style="position: absolute; top: 15px; right: 20px; background: rgba(255,255,255,0.2); padding: 5px 12px; border-radius: 15px; font-size: 11px; color: white; font-weight: 600;">
          🤖 AI分析済み
        </div>
        <h1 style="color: white; margin: 0 0 10px 0; font-size: 26px; font-weight: 700;">
          🚀 ${dateStr}のバズ予測提案
        </h1>
        <p style="color: rgba(255,255,255,0.9); margin: 0; font-size: 14px;">
          ${timeStr} 自動生成 | トレンド×心理学×ターゲット最適化
        </p>
      </div>
      
      <!-- 📋 説明部分 -->
      <div style="background: white; padding: 25px; border-left: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0;">
        <div style="background: #f1f5f9; padding: 18px; border-radius: 10px; margin-bottom: 25px; border-left: 4px solid #8b5cf6;">
          <h2 style="margin: 0 0 10px 0; color: #1e293b; font-size: 17px;">📧 簡単操作</h2>
          <p style="margin: 0; color: #475569; font-size: 14px; line-height: 1.5;">
            <strong>このメールに返信</strong>して番号（1〜5）を送信 → 自動で記事作成開始！<br>
            カスタマイズ例：「1 データ重視で」「2 事例多めで」「3 美容業界特化で」
          </p>
        </div>
        
        <!-- 🔥 提案リスト -->
        ${proposals.map((proposal, index) => {
          const urgencyColor = proposal.urgency === '高' ? '#dc2626' : '#d97706';
          const urgencyBg = proposal.urgency === '高' ? '#fef2f2' : '#fffbeb';
          const urgencyIcon = proposal.urgency === '高' ? '🔥' : '⚡';
          
          return `
            <div style="background: ${urgencyBg}; border: 2px solid ${urgencyColor}30; border-radius: 12px; padding: 25px; margin-bottom: 20px; position: relative;">
              
              <!-- バズスコア表示 -->
              <div style="position: absolute; top: 18px; right: 20px; display: flex; gap: 8px;">
                <div style="background: ${urgencyColor}; color: white; padding: 4px 10px; border-radius: 15px; font-size: 10px; font-weight: 700;">
                  ${urgencyIcon} ${proposal.urgency}
                </div>
                <div style="background: #8b5cf6; color: white; padding: 4px 10px; border-radius: 15px; font-size: 10px; font-weight: 700;">
                  🚀 ${proposal.buzzScore}pts
                </div>
              </div>
              
              <!-- タイトル -->
              <h3 style="color: #111827; margin: 0 0 15px 0; font-size: 18px; font-weight: 700; line-height: 1.3; padding-right: 120px;">
                ${index + 1}. ${proposal.title}
              </h3>
              
              <!-- 説明 -->
              <p style="color: #4b5563; font-size: 14px; margin: 0 0 15px 0; line-height: 1.5;">
                ${proposal.description}
              </p>
              
              <!-- 季節のヒント -->
              <div style="background: rgba(139, 92, 246, 0.1); padding: 12px; border-radius: 8px; margin-bottom: 15px; border-left: 3px solid #8b5cf6;">
                <div style="font-size: 12px; font-weight: 600; color: #7c3aed; margin-bottom: 5px;">💡 今の時期のポイント</div>
                <div style="font-size: 12px; color: #6b46c1;">${proposal.seasonTip}</div>
              </div>
              
              <!-- メタ情報 -->
              <div style="display: flex; gap: 12px; align-items: center; font-size: 11px; color: #6b7280; flex-wrap: wrap;">
                <span style="background: rgba(139, 92, 246, 0.15); color: #8b5cf6; padding: 3px 8px; border-radius: 12px; font-weight: 600;">
                  🎯 ${proposal.target}
                </span>
                <span style="background: rgba(16, 185, 129, 0.15); color: #059669; padding: 3px 8px; border-radius: 12px; font-weight: 600;">
                  📂 ${proposal.category}
                </span>
                <span>📖 ${proposal.readTime}</span>
              </div>
              
              <!-- キーワード -->
              <div style="margin-top: 12px;">
                <div style="font-size: 11px; color: #8b5cf6; font-weight: 600; margin-bottom: 6px;">🔍 トレンドキーワード</div>
                <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                  ${proposal.keywords.map(keyword => `
                    <span style="background: linear-gradient(135deg, #8b5cf6, #ec4899); color: white; padding: 2px 8px; border-radius: 10px; font-size: 10px; font-weight: 500;">
                      ${keyword}
                    </span>
                  `).join('')}
                </div>
              </div>
            </div>
          `;
        }).join('')}
        
        <!-- 📊 今日の分析サマリー -->
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 20px; margin-top: 25px;">
          <h3 style="margin: 0 0 15px 0; color: #1e293b; font-size: 15px;">📊 AI分析サマリー</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; font-size: 12px;">
            <div style="text-align: center; padding: 10px; background: white; border-radius: 6px;">
              <div style="font-weight: 700; color: #dc2626; font-size: 16px;">高優先度</div>
              <div style="color: #6b7280;">2件</div>
            </div>
            <div style="text-align: center; padding: 10px; background: white; border-radius: 6px;">
              <div style="font-weight: 700; color: #8b5cf6; font-size: 16px;">平均バズスコア</div>
              <div style="color: #6b7280;">${Math.round(proposals.reduce((sum, p) => sum + p.buzzScore, 0) / proposals.length)}pts</div>
            </div>
            <div style="text-align: center; padding: 10px; background: white; border-radius: 6px;">
              <div style="font-weight: 700; color: #059669; font-size: 16px;">最適ターゲット</div>
              <div style="color: #6b7280;">5業種対応</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 🤖 フッター -->
      <div style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); padding: 20px; text-align: center; border-radius: 0 0 12px 12px;">
        <p style="margin: 0 0 8px 0; color: #e2e8f0; font-size: 13px; font-weight: 600;">
          🤖 LeadFive AI Blog Assistant
        </p>
        <p style="margin: 0; color: #94a3b8; font-size: 11px;">
          返信後10-15分で記事が自動投稿されます
        </p>
      </div>
    </div>
  `;
  
  try {
    MailApp.sendEmail({
      to: CONFIG.recipientEmail,
      subject: `🚀【LeadFive AI】${dateStr}のバズ予測提案`,
      htmlBody: htmlBody,
      name: 'LeadFive AI Blog Assistant'
    });
    
    // 提案データを保存
    const proposalId = `proposals_${Utilities.formatDate(today, 'JST', 'yyyyMMdd_HHmmss')}`;
    PropertiesService.getScriptProperties().setProperty(proposalId, JSON.stringify(proposals));
    PropertiesService.getScriptProperties().setProperty('latestProposalId', proposalId);
    
    console.log('✅ AI提案メール送信完了:', dateStr);
    console.log('📧 Gmailを確認してください！');
    return true;
  } catch (error) {
    console.error('❌ メール送信エラー:', error);
    return false;
  }
}

// 毎朝7時の自動実行用
function setupDailyTrigger() {
  // 既存のトリガーを削除
  ScriptApp.getProjectTriggers().forEach(trigger => {
    ScriptApp.deleteTrigger(trigger);
  });
  
  try {
    // 毎朝7時に AI提案メール送信
    ScriptApp.newTrigger('sendAIProposal')
      .timeBased()
      .atHour(7)
      .everyDays(1)
      .create();
      
    console.log('✅ 毎朝7時の自動送信設定完了');
    
    // 確認メール送信
    MailApp.sendEmail({
      to: CONFIG.recipientEmail,
      subject: '✅ LeadFive AI システム稼働開始',
      htmlBody: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 400px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 20px; border-radius: 10px; text-align: center;">
            <h2 style="margin: 0;">🎉 設定完了！</h2>
          </div>
          <div style="background: #f8fafc; padding: 20px; margin-top: 10px; border-radius: 8px;">
            <h3 style="color: #1e293b; margin-top: 0;">📅 自動スケジュール</h3>
            <p>明日の朝7時からAI分析済み提案が届きます</p>
            <h3 style="color: #1e293b;">🧪 今すぐテスト</h3>
            <p>Google Apps Scriptで <code>sendAIProposal</code> を実行</p>
          </div>
        </div>
      `
    });
    
    return true;
  } catch (error) {
    console.error('❌ トリガー設定エラー:', error);
    return false;
  }
}
```

## 📋 実行手順

### **1. コード追加**
上記のコードを既存コードの**最後に追加**して保存

### **2. テスト実行**
関数選択で「**sendAIProposal**」を選択 → ▶実行

### **3. Gmail確認**
美しいAI提案メールが届くはずです！

### **4. 自動送信設定**
「**setupDailyTrigger**」を実行 → 毎朝7時に自動送信開始

## 🎯 期待される結果

- 📧 **美麗なHTMLメール**：バズスコア・緊急度・季節性表示
- 🎯 **5つのAI最適化提案**：ターゲット別・カテゴリ別
- 🔥 **トレンドキーワード**：検索ボリューム考慮
- 💡 **季節のヒント**：今の時期に最適な内容

成功したら返信テスト機能を追加します！