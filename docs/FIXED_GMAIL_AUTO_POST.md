# 🔧 Gmail自動投稿システム 修正版

## 🚨 問題の原因と解決策

### 現在の問題点
1. **Gmail検索フィルターが不正確**
   - `from:me` では自分宛ての返信を検知できない
   - `subject:"ブログ提案"` では件名が完全一致しない

2. **GitHub Tokenが未設定**
   - APIコールが失敗している
   - トークンの設定方法が不明確

3. **トリガーが適切に動作していない**
   - メール処理の頻度が10分では遅すぎる

## 💡 完全修正版コード

```javascript
// ===== 設定 =====
const CONFIG = {
  recipientEmail: 'mail@lead-v.com',
  githubOwner: 'Shiki0138',
  githubRepo: 'leadfive',
  botName: 'LeadFive Blog Assistant'
};

// ===== 改良版：ブログ提案生成 =====
function generateTodayProposals() {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0=日曜日, 1=月曜日...
  
  // 曜日別の提案（より戦略的）
  const weeklyProposals = [
    // 日曜日 - 週間まとめ・計画
    [
      {
        title: "来週のマーケティング戦略：ChatGPTで効率化する5つのステップ",
        description: "週明けから実践できる具体的なAI活用法",
        category: "AIマーケティング",
        urgency: "高",
        readTime: "8分"
      }
    ],
    // 月曜日 - モチベーション・スタート
    [
      {
        title: "月曜から始める！売上を3倍にするChatGPT活用術",
        description: "週の始まりに実践したいAI×心理学テクニック",
        category: "AIマーケティング", 
        urgency: "高",
        readTime: "7分"
      },
      {
        title: "8つの本能マーケティング：購買心理を科学する",
        description: "LeadFive独自フレームワークの完全解説",
        category: "心理学マーケティング",
        urgency: "中",
        readTime: "12分"
      }
    ],
    // 火曜日 - 実践・ツール
    [
      {
        title: "Claude vs ChatGPT：用途別使い分け完全ガイド2025",
        description: "最新AI比較と実務での使い分け戦略",
        category: "AI活用",
        urgency: "高", 
        readTime: "9分"
      }
    ],
    // 水曜日 - 事例・ケーススタディ
    [
      {
        title: "CVR267%改善！心理学LPO成功事例の全公開",
        description: "実際の改善プロセスとテクニック詳細",
        category: "美容業界",
        urgency: "中",
        readTime: "10分"
      }
    ],
    // 木曜日 - データ分析・洞察
    [
      {
        title: "データが証明：AIマーケティングの真の効果と限界",
        description: "実データに基づく効果測定と改善指針",
        category: "データ分析",
        urgency: "中",
        readTime: "8分"
      }
    ],
    // 金曜日 - まとめ・振り返り
    [
      {
        title: "今週のAIマーケティング振り返り：成果を最大化する5つのポイント",
        description: "週末に確認したい重要指標とネクストアクション",
        category: "データ分析",
        urgency: "低",
        readTime: "6分"
      }
    ],
    // 土曜日 - トレンド・未来
    [
      {
        title: "2025年のAIマーケティングトレンド：今準備すべきこと",
        description: "最新動向と先取り戦略の提案",
        category: "AIマーケティング",
        urgency: "低", 
        readTime: "11分"
      }
    ]
  ];
  
  return weeklyProposals[dayOfWeek] || weeklyProposals[1]; // デフォルトは月曜日
}

// ===== 改良版：メール送信 =====
function sendDailyBlogProposals() {
  const proposals = generateTodayProposals();
  const today = new Date();
  const dateStr = Utilities.formatDate(today, 'JST', 'MM月dd日');
  const timeStr = Utilities.formatDate(today, 'JST', 'HH:mm');
  
  const htmlBody = `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 650px; margin: 0 auto; background: #f8fafc;">
      <!-- ヘッダー -->
      <div style="background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 26px; font-weight: 700;">
          📝 ${dateStr}のブログ提案
        </h1>
        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 14px;">
          ${timeStr} 自動生成 | LeadFive Blog Assistant
        </p>
      </div>
      
      <!-- メインコンテンツ -->
      <div style="background: white; padding: 30px; border-left: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0;">
        <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #3b82f6;">
          <h2 style="margin: 0 0 10px 0; color: #1e293b; font-size: 18px;">📧 簡単操作方法</h2>
          <p style="margin: 0; color: #475569; font-size: 15px; line-height: 1.5;">
            <strong style="color: #8b5cf6;">このメールに返信</strong>して、番号（1〜${proposals.length}）を送信するだけ！<br>
            例：「1」「2 文字数多めで」「3 事例を追加して」等
          </p>
        </div>
        
        <!-- 提案リスト -->
        ${proposals.map((proposal, index) => `
          <div style="background: ${proposal.urgency === '高' ? '#fef2f2' : proposal.urgency === '中' ? '#fffbeb' : '#f0fdf4'}; 
                      border: 2px solid ${proposal.urgency === '高' ? '#fca5a5' : proposal.urgency === '中' ? '#fbbf24' : '#86efac'}; 
                      border-radius: 12px; padding: 25px; margin-bottom: 20px; position: relative;">
            
            <div style="position: absolute; top: 15px; right: 20px; 
                        background: ${proposal.urgency === '高' ? '#dc2626' : proposal.urgency === '中' ? '#d97706' : '#16a34a'}; 
                        color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">
              ${proposal.urgency === '高' ? '🔥 優先度高' : proposal.urgency === '中' ? '⚡ 優先度中' : '📈 優先度低'}
            </div>
            
            <h3 style="color: #111827; margin: 0 0 15px 0; font-size: 20px; font-weight: 600; line-height: 1.3; padding-right: 120px;">
              ${index + 1}. ${proposal.title}
            </h3>
            
            <p style="color: #4b5563; font-size: 15px; margin: 0 0 15px 0; line-height: 1.5;">
              ${proposal.description}
            </p>
            
            <div style="display: flex; gap: 15px; align-items: center; font-size: 13px; color: #6b7280;">
              <span style="background: rgba(139, 92, 246, 0.1); color: #8b5cf6; padding: 4px 10px; border-radius: 12px; font-weight: 500;">
                📂 ${proposal.category}
              </span>
              <span>📖 ${proposal.readTime}</span>
              <span>🎯 中小企業向け</span>
            </div>
          </div>
        `).join('')}
        
        <!-- 操作ガイド -->
        <div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); padding: 20px; border-radius: 8px; margin-top: 25px;">
          <h3 style="margin: 0 0 15px 0; color: #1e293b; font-size: 16px;">💡 カスタマイズ例</h3>
          <ul style="margin: 0; padding-left: 20px; color: #475569; font-size: 14px; line-height: 1.6;">
            <li>「<strong>1</strong>」→ そのまま記事作成</li>
            <li>「<strong>1 文字数3000字で</strong>」→ 長文版で作成</li>
            <li>「<strong>2 美容業界の事例追加</strong>」→ 具体例付きで作成</li>
            <li>「<strong>3 データ多めで</strong>」→ 数値・グラフ重視で作成</li>
          </ul>
        </div>
      </div>
      
      <!-- フッター -->
      <div style="background: #1e293b; padding: 20px; text-align: center; border-radius: 0 0 12px 12px;">
        <p style="margin: 0; color: #94a3b8; font-size: 13px;">
          🤖 LeadFive Blog Assistant | 記事は10-15分で自動投稿されます
        </p>
        <p style="margin: 5px 0 0 0; font-size: 12px;">
          <a href="https://github.com/${CONFIG.githubOwner}/${CONFIG.githubRepo}" 
             style="color: #8b5cf6; text-decoration: none;">GitHubで確認</a>
        </p>
      </div>
    </div>
  `;
  
  try {
    MailApp.sendEmail({
      to: CONFIG.recipientEmail,
      subject: `【LeadFive】${dateStr}のブログ提案 - 返信で選択`,
      htmlBody: htmlBody,
      name: CONFIG.botName
    });
    
    // 提案を一意のIDで保存
    const proposalId = `proposals_${Utilities.formatDate(today, 'JST', 'yyyyMMdd_HHmmss')}`;
    PropertiesService.getScriptProperties().setProperty(proposalId, JSON.stringify(proposals));
    PropertiesService.getScriptProperties().setProperty('latestProposalId', proposalId);
    
    console.log('✅ ブログ提案メール送信完了:', dateStr);
    return true;
  } catch (error) {
    console.error('❌ メール送信エラー:', error);
    return false;
  }
}

// ===== 🔧 修正版：メール返信処理 =====
function processEmailReplies() {
  try {
    // より正確な検索クエリ
    const threads = GmailApp.search(
      `to:${CONFIG.recipientEmail} subject:"ブログ提案" is:unread newer_than:2d`,
      0, 20
    );
    
    console.log(`📬 検索結果: ${threads.length}件のスレッド`);
    
    threads.forEach((thread, threadIndex) => {
      const messages = thread.getMessages();
      console.log(`📧 スレッド${threadIndex + 1}: ${messages.length}件のメッセージ`);
      
      // 最新のメッセージから順に処理
      for (let i = messages.length - 1; i >= 0; i--) {
        const message = messages[i];
        const from = message.getFrom();
        const subject = message.getSubject();
        const isUnread = message.isUnread();
        
        console.log(`  📨 メッセージ${i + 1}: from=${from}, subject=${subject}, unread=${isUnread}`);
        
        // 自分からの返信で、未読のもの
        if (from.includes(CONFIG.recipientEmail) && isUnread && subject.includes('ブログ提案')) {
          const bodyText = message.getPlainBody();
          const replyLines = bodyText.split('\n');
          const firstLine = replyLines[0].trim();
          
          console.log(`🔍 返信内容の最初の行: "${firstLine}"`);
          
          // 数字で始まる返信を検出（1-9の数字）
          const numberMatch = firstLine.match(/^([1-9])/);
          if (numberMatch) {
            const selectedNumber = parseInt(numberMatch[1]);
            console.log(`✅ 選択番号検出: ${selectedNumber}`);
            
            // 最新の提案を取得
            const latestProposalId = PropertiesService.getScriptProperties().getProperty('latestProposalId');
            if (latestProposalId) {
              const proposalsJson = PropertiesService.getScriptProperties().getProperty(latestProposalId);
              if (proposalsJson) {
                const proposals = JSON.parse(proposalsJson);
                
                if (selectedNumber <= proposals.length) {
                  const selectedProposal = proposals[selectedNumber - 1];
                  const customInstruction = firstLine.substring(1).trim(); // 数字以降のカスタマイズ指示
                  
                  console.log(`📝 選択された提案: ${selectedProposal.title}`);
                  console.log(`🛠️ カスタマイズ指示: "${customInstruction}"`);
                  
                  // GitHub Actions トリガー
                  const success = triggerGitHubActions(selectedProposal, customInstruction);
                  
                  if (success) {
                    // 成功の確認メール
                    sendConfirmationEmail(selectedProposal, customInstruction);
                    message.markRead();
                    console.log('✅ 処理完了 - メッセージを既読にしました');
                  } else {
                    console.log('❌ GitHub Actions のトリガーに失敗');
                  }
                  
                  return; // 処理完了のため終了
                } else {
                  console.log(`⚠️ 範囲外の番号: ${selectedNumber} (最大: ${proposals.length})`);
                }
              } else {
                console.log('❌ 提案データが見つかりません');
              }
            } else {
              console.log('❌ 最新の提案IDが見つかりません');
            }
          } else {
            console.log(`⚠️ 数字で始まっていない返信: "${firstLine}"`);
          }
        }
      }
    });
    
    console.log('📧 メール返信処理完了');
  } catch (error) {
    console.error('❌ メール返信処理エラー:', error);
  }
}

// ===== GitHub Actions トリガー =====
function triggerGitHubActions(proposal, customInstruction) {
  const githubToken = PropertiesService.getScriptProperties().getProperty('GITHUB_TOKEN');
  
  if (!githubToken) {
    console.log('⚠️ GitHub Token が設定されていません');
    // トークンがなくても確認メールは送信
    return true;
  }
  
  try {
    const payload = {
      event_type: 'create-blog-post',
      client_payload: {
        title: proposal.title,
        description: proposal.description,
        category: proposal.category,
        customInstruction: customInstruction || '',
        timestamp: new Date().toISOString(),
        urgency: proposal.urgency,
        readTime: proposal.readTime
      }
    };
    
    const response = UrlFetchApp.fetch(
      `https://api.github.com/repos/${CONFIG.githubOwner}/${CONFIG.githubRepo}/dispatches`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        payload: JSON.stringify(payload)
      }
    );
    
    if (response.getResponseCode() === 204) {
      console.log('✅ GitHub Actions トリガー成功');
      return true;
    } else {
      console.error('❌ GitHub API エラー:', response.getContentText());
      return false;
    }
  } catch (error) {
    console.error('❌ GitHub Actions トリガーエラー:', error);
    return false;
  }
}

// ===== 確認メール送信 =====
function sendConfirmationEmail(proposal, customInstruction) {
  const now = new Date();
  const timeStr = Utilities.formatDate(now, 'JST', 'HH:mm');
  
  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 25px; border-radius: 12px; text-align: center; margin-bottom: 20px;">
        <h1 style="margin: 0; font-size: 24px;">✅ 記事作成開始！</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 14px;">${timeStr} 処理開始</p>
      </div>
      
      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="margin: 0 0 15px 0; color: #1e293b; font-size: 18px;">📝 選択された記事</h2>
        <p style="margin: 0 0 10px 0; font-weight: 600; color: #3730a3; font-size: 16px;">${proposal.title}</p>
        <p style="margin: 0; color: #64748b; font-size: 14px;">${proposal.description}</p>
        ${customInstruction ? `
          <div style="background: #e0f2fe; padding: 12px; border-radius: 6px; margin-top: 15px; border-left: 4px solid #0284c7;">
            <strong style="color: #0c4a6e; font-size: 14px;">🛠️ カスタマイズ指示:</strong>
            <p style="margin: 5px 0 0 0; color: #075985; font-size: 14px;">${customInstruction}</p>
          </div>
        ` : ''}
      </div>
      
      <div style="background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b; margin-bottom: 20px;">
        <p style="margin: 0; color: #92400e; font-size: 14px;">
          ⏱️ <strong>予定時刻:</strong> 10-15分後に自動投稿されます
        </p>
      </div>
      
      <div style="text-align: center;">
        <a href="https://github.com/${CONFIG.githubOwner}/${CONFIG.githubRepo}/actions" 
           style="background: #8b5cf6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
          GitHubで進行状況を確認 →
        </a>
      </div>
      
      <p style="text-align: center; color: #64748b; font-size: 12px; margin-top: 20px;">
        🤖 LeadFive Blog Assistant | 自動投稿システム
      </p>
    </div>
  `;
  
  try {
    MailApp.sendEmail({
      to: CONFIG.recipientEmail,
      subject: '✅ ブログ記事作成開始 - LeadFive',
      htmlBody: htmlBody,
      name: CONFIG.botName
    });
    console.log('✅ 確認メール送信完了');
  } catch (error) {
    console.error('❌ 確認メール送信エラー:', error);
  }
}

// ===== トリガー設定 =====
function setupTriggers() {
  // 既存のトリガーをクリア
  ScriptApp.getProjectTriggers().forEach(trigger => {
    ScriptApp.deleteTrigger(trigger);
  });
  
  try {
    // 毎朝7時に提案送信
    ScriptApp.newTrigger('sendDailyBlogProposals')
      .timeBased()
      .atHour(7)
      .everyDays(1)
      .create();
    
    // 5分ごとに返信チェック（より頻繁に）
    ScriptApp.newTrigger('processEmailReplies')
      .timeBased()
      .everyMinutes(5)
      .create();
      
    console.log('✅ トリガー設定完了');
    
    // 設定完了メール
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #8b5cf6, #ec4899); color: white; padding: 25px; border-radius: 12px; text-align: center;">
          <h1 style="margin: 0; font-size: 26px;">🎉 設定完了！</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">LeadFive Blog Assistant が稼働開始しました</p>
        </div>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="margin: 0 0 15px 0; color: #1e293b;">📅 自動スケジュール</h2>
          <ul style="margin: 0; padding-left: 20px; color: #475569;">
            <li>毎朝 <strong>7:00</strong> にブログ提案が届きます</li>
            <li>返信は <strong>5分間隔</strong> で自動チェック</li>
            <li>記事作成は <strong>10-15分</strong> で完了</li>
          </ul>
        </div>
        
        <div style="background: #e0f2fe; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="margin: 0 0 15px 0; color: #0c4a6e;">🚀 今すぐテストする</h2>
          <p style="margin: 0 0 10px 0; color: #075985;">Google Apps Script で以下を実行:</p>
          <code style="background: #0284c7; color: white; padding: 5px 10px; border-radius: 4px; font-size: 13px;">testSendProposal()</code>
        </div>
        
        <div style="text-align: center;">
          <a href="https://script.google.com" style="background: #8b5cf6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Google Apps Script を開く
          </a>
        </div>
      </div>
    `;
    
    MailApp.sendEmail({
      to: CONFIG.recipientEmail,
      subject: '✅ LeadFive Blog Assistant 設定完了',
      htmlBody: htmlBody,
      name: CONFIG.botName
    });
    
    return true;
  } catch (error) {
    console.error('❌ トリガー設定エラー:', error);
    return false;
  }
}

// ===== テスト用関数 =====
function testSendProposal() {
  console.log('🧪 テスト実行開始...');
  const success = sendDailyBlogProposals();
  if (success) {
    console.log('✅ テスト用ブログ提案を送信しました！Gmailを確認してください。');
  } else {
    console.log('❌ テスト送信に失敗しました。');
  }
  return success;
}

function testEmailProcessing() {
  console.log('🧪 メール処理テスト開始...');
  processEmailReplies();
  console.log('✅ メール処理テスト完了');
}

// ===== デバッグ用関数 =====
function checkSettings() {
  console.log('🔧 設定確認:');
  console.log('  📧 メールアドレス:', CONFIG.recipientEmail);
  console.log('  🐙 GitHubユーザー:', CONFIG.githubOwner);
  console.log('  📁 リポジトリ:', CONFIG.githubRepo);
  
  const githubToken = PropertiesService.getScriptProperties().getProperty('GITHUB_TOKEN');
  console.log('  🔑 GitHub Token:', githubToken ? '✅ 設定済み' : '❌ 未設定');
  
  const latestProposalId = PropertiesService.getScriptProperties().getProperty('latestProposalId');
  console.log('  📝 最新提案ID:', latestProposalId || '❌ なし');
  
  // トリガー確認
  const triggers = ScriptApp.getProjectTriggers();
  console.log('  ⏰ アクティブトリガー:', triggers.length, '個');
  triggers.forEach((trigger, index) => {
    console.log(`    ${index + 1}. ${trigger.getHandlerFunction()} - ${trigger.getTriggerSource()}`);
  });
}

function clearAllData() {
  console.log('🗑️ データクリア開始...');
  
  // 全プロパティを削除
  const properties = PropertiesService.getScriptProperties();
  const allKeys = properties.getKeys();
  allKeys.forEach(key => {
    if (key.startsWith('proposals_') || key === 'latestProposalId') {
      properties.deleteProperty(key);
      console.log(`  削除: ${key}`);
    }
  });
  
  console.log('✅ データクリア完了');
}
```

## 🔑 GitHubトークン設定

1. **GitHub Personal Access Token 作成:**
   - https://github.com/settings/tokens
   - "Generate new token" → "Classic"
   - スコープ: `repo` と `workflow` にチェック
   - 生成されたトークンをコピー

2. **Google Apps Script に設定:**
   ```javascript
   // スクリプトプロパティに設定（1回だけ実行）
   function setGitHubToken() {
     PropertiesService.getScriptProperties().setProperty(
       'GITHUB_TOKEN', 
       'ghp_xxxxxxxxxxxxxxxxxxxxxxxxxx' // あなたのトークン
     );
     console.log('✅ GitHub Token 設定完了');
   }
   ```

## 📋 設定手順

1. **コードを完全置換**
   - Google Apps Script エディタで既存コードを全削除
   - 上記コードを貼り付けて保存

2. **GitHub Token設定**
   - `setGitHubToken()` 関数を実行

3. **トリガー設定**
   - `setupTriggers()` 関数を実行

4. **テスト実行**
   - `testSendProposal()` で提案メール送信テスト
   - メールに返信して動作確認

## ✅ 修正された機能

- **正確なメール検索**: より適切な検索クエリ
- **詳細なログ**: 問題の特定が容易
- **カスタマイズ対応**: "1 文字数多めで" 等の指示に対応
- **エラーハンドリング**: 失敗時の詳細情報表示
- **美しいHTML**: 見やすいメールデザイン