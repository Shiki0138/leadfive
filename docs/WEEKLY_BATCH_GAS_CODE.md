# 📝 Google Apps Script 週次一括システム追加コード

## 既存のコードに以下を追加してください

```javascript
// ===== 📅 週次一括確認メール =====
function sendWeeklyBatchConfirmation() {
  const today = new Date();
  const weeklyPlan = createWeeklyContentPlan();
  
  const htmlBody = `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 800px; margin: 0 auto;">
      
      <!-- ヘッダー -->
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%); padding: 40px; text-align: center; border-radius: 15px 15px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 32px;">📅 今週の記事プラン（7日分）</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">${weeklyPlan.theme}</p>
      </div>
      
      <!-- 記事一覧 -->
      <div style="background: white; padding: 40px; border: 1px solid #e2e8f0;">
        <div style="background: #f8fafc; padding: 20px; border-radius: 10px; margin-bottom: 30px;">
          <h2 style="margin: 0 0 10px 0; color: #1e293b;">📧 返信方法</h2>
          <p style="margin: 0; color: #475569; line-height: 1.8;">
            各記事番号の後に指示を記入して返信してください。<br>
            <strong>返信例：</strong><br>
            <code style="background: #e2e8f0; padding: 10px; display: block; margin-top: 10px; border-radius: 5px;">
              1: OK データ重視で<br>
              2: OK 事例多めで<br>
              3: SKIP<br>
              4: OK<br>
              5: OK 初心者向けで<br>
              6: OK 美容業界特化で<br>
              7: OK
            </code>
          </p>
        </div>
        
        ${weeklyPlan.dailyTopics.map((topic, index) => {
          const dayNames = ['月', '火', '水', '木', '金', '土', '日'];
          const targetDate = new Date(today);
          targetDate.setDate(today.getDate() + index);
          const dateStr = Utilities.formatDate(targetDate, 'JST', 'MM/dd');
          
          return `
            <div style="background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 12px; padding: 25px; margin-bottom: 20px;">
              <div style="display: flex; justify-content: space-between; align-items: start;">
                <div style="flex: 1;">
                  <h3 style="margin: 0 0 10px 0; color: #1e293b; font-size: 20px;">
                    ${index + 1}. ${dateStr}（${dayNames[index]}）
                  </h3>
                  <p style="margin: 0 0 10px 0; color: #3730a3; font-weight: 600;">
                    ${topic}
                  </p>
                  <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                    <span style="background: #e0f2fe; color: #0369a1; padding: 4px 12px; border-radius: 15px; font-size: 12px;">
                      ${weeklyPlan.focus}
                    </span>
                    <span style="background: #fef3c7; color: #92400e; padding: 4px 12px; border-radius: 15px; font-size: 12px;">
                      読了8-12分
                    </span>
                  </div>
                </div>
                <div style="text-align: right;">
                  <div style="background: #8b5cf6; color: white; padding: 8px 16px; border-radius: 20px; font-size: 24px; font-weight: 700;">
                    ${index + 1}
                  </div>
                </div>
              </div>
            </div>
          `;
        }).join('')}
        
        <!-- カスタマイズオプション -->
        <div style="background: #fef7ff; border: 2px solid #d8b4fe; border-radius: 12px; padding: 25px; margin-top: 30px;">
          <h3 style="margin: 0 0 15px 0; color: #7c3aed;">🛠️ カスタマイズオプション</h3>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; font-size: 14px; color: #6b46c1;">
            <div>• <strong>OK</strong> = そのまま投稿</div>
            <div>• <strong>OK データ重視で</strong> = 統計・数値多め</div>
            <div>• <strong>OK 事例多めで</strong> = ケーススタディ中心</div>
            <div>• <strong>OK 初心者向けで</strong> = 基本説明充実</div>
            <div>• <strong>OK 美容業界特化で</strong> = 美容事例中心</div>
            <div>• <strong>SKIP</strong> = その日はスキップ</div>
          </div>
        </div>
      </div>
      
      <!-- フッター -->
      <div style="background: #1e293b; padding: 30px; text-align: center; border-radius: 0 0 15px 15px;">
        <p style="color: #e2e8f0; margin: 0;">
          🤖 LeadFive Premium AI - 週次一括指示システム
        </p>
        <p style="color: #94a3b8; margin: 10px 0 0 0; font-size: 14px;">
          返信後、毎日朝9時に自動投稿されます
        </p>
      </div>
    </div>
  `;
  
  try {
    MailApp.sendEmail({
      to: CONFIG.recipientEmail,
      subject: `📅【LeadFive】今週の記事プラン（${weeklyPlan.theme}）- 7日分一括確認`,
      htmlBody: htmlBody,
      name: CONFIG.botName
    });
    
    // 週次プランを保存
    const weeklyBatchId = `weekly_batch_${Utilities.formatDate(today, 'JST', 'yyyyMMdd')}`;
    PropertiesService.getScriptProperties().setProperty(weeklyBatchId, JSON.stringify({
      weeklyPlan,
      status: 'pending',
      timestamp: today.toISOString()
    }));
    
    PropertiesService.getScriptProperties().setProperty('latestWeeklyBatch', weeklyBatchId);
    
    console.log('✅ 週次一括確認メール送信完了');
    return true;
  } catch (error) {
    console.error('❌ 週次確認メール送信エラー:', error);
    return false;
  }
}

// ===== 📧 週次返信処理 =====
function processWeeklyBatchReplies() {
  try {
    const threads = GmailApp.search(
      `to:${CONFIG.recipientEmail} subject:"今週の記事プラン" is:unread newer_than:7d`,
      0, 5
    );
    
    console.log(`📬 週次返信検索結果: ${threads.length}件`);
    
    threads.forEach(thread => {
      const messages = thread.getMessages();
      const latestMessage = messages[messages.length - 1];
      
      if (latestMessage.getFrom().includes(CONFIG.recipientEmail) && latestMessage.isUnread()) {
        const bodyText = latestMessage.getPlainBody();
        const instructions = parseWeeklyInstructions(bodyText);
        
        if (instructions.length > 0) {
          saveWeeklyInstructions(instructions);
          latestMessage.markRead();
          sendWeeklyConfirmation(instructions);
          console.log('✅ 週次指示を保存しました');
        }
      }
    });
  } catch (error) {
    console.error('❌ 週次返信処理エラー:', error);
  }
}

// ===== 📝 週次指示の解析 =====
function parseWeeklyInstructions(bodyText) {
  const lines = bodyText.split('\\n');
  const instructions = [];
  
  lines.forEach(line => {
    // 1: OK データ重視で のようなパターンを検出
    const match = line.match(/^(\\d):\\s*(.+)/);
    if (match) {
      const dayNumber = parseInt(match[1]);
      const instruction = match[2].trim();
      
      instructions.push({
        day: dayNumber,
        instruction: instruction,
        skip: instruction.toUpperCase() === 'SKIP',
        customization: instruction.replace(/^OK\\s*/i, '').trim()
      });
    }
  });
  
  // 7日分の指示を確保（未指定はデフォルト）
  for (let i = 1; i <= 7; i++) {
    if (!instructions.find(inst => inst.day === i)) {
      instructions.push({
        day: i,
        instruction: 'OK',
        skip: false,
        customization: ''
      });
    }
  }
  
  // 日付順にソート
  instructions.sort((a, b) => a.day - b.day);
  
  return instructions;
}

// ===== 💾 週次指示の保存 =====
function saveWeeklyInstructions(instructions) {
  const today = new Date();
  const weeklyInstructionsId = `weekly_instructions_${Utilities.formatDate(today, 'JST', 'yyyyMMdd')}`;
  
  PropertiesService.getScriptProperties().setProperty(weeklyInstructionsId, JSON.stringify({
    instructions,
    createdAt: today.toISOString(),
    status: 'active'
  }));
  
  PropertiesService.getScriptProperties().setProperty('activeWeeklyInstructions', weeklyInstructionsId);
}

// ===== 📧 週次確認メール送信 =====
function sendWeeklyConfirmation(instructions) {
  const skipCount = instructions.filter(inst => inst.skip).length;
  const postCount = 7 - skipCount;
  
  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; border-radius: 12px; text-align: center;">
        <h1 style="margin: 0;">✅ 週次指示を受け付けました</h1>
      </div>
      
      <div style="background: #f8fafc; padding: 30px; margin-top: 20px; border-radius: 8px;">
        <h2 style="color: #1e293b; margin: 0 0 20px 0;">📊 今週の投稿計画</h2>
        
        <div style="display: flex; gap: 20px; margin-bottom: 20px;">
          <div style="background: white; padding: 15px; border-radius: 8px; flex: 1; text-align: center;">
            <div style="color: #10b981; font-size: 24px; font-weight: 700;">${postCount}</div>
            <div style="color: #6b7280; font-size: 14px;">投稿予定</div>
          </div>
          <div style="background: white; padding: 15px; border-radius: 8px; flex: 1; text-align: center;">
            <div style="color: #f59e0b; font-size: 24px; font-weight: 700;">${skipCount}</div>
            <div style="color: #6b7280; font-size: 14px;">スキップ</div>
          </div>
        </div>
        
        <h3 style="color: #1e293b; margin: 20px 0 10px 0;">📅 各日の設定</h3>
        ${instructions.map(inst => `
          <div style="background: ${inst.skip ? '#fee2e2' : '#dcfce7'}; padding: 10px 15px; margin-bottom: 5px; border-radius: 6px;">
            <strong>Day ${inst.day}:</strong> 
            ${inst.skip ? 'スキップ' : inst.customization || 'デフォルト投稿'}
          </div>
        `).join('')}
        
        <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
          毎日朝9時に自動投稿されます。変更が必要な場合は来週の指示で調整してください。
        </p>
      </div>
    </div>
  `;
  
  MailApp.sendEmail({
    to: CONFIG.recipientEmail,
    subject: '✅ 週次記事プラン確定 - LeadFive AI',
    htmlBody: htmlBody,
    name: CONFIG.botName
  });
}

// ===== 📅 毎日の自動実行 =====
function executeDailyPost() {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0=日曜日
  
  // 月曜日を1として計算（日曜日は7）
  const dayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const dayNumber = dayIndex + 1;
  
  console.log(`📅 本日: ${Utilities.formatDate(today, 'JST', 'yyyy-MM-dd')} (Day ${dayNumber})`);
  
  // アクティブな週次指示を取得
  const instructionsId = PropertiesService.getScriptProperties().getProperty('activeWeeklyInstructions');
  if (!instructionsId) {
    console.log('⚠️ アクティブな週次指示がありません');
    return;
  }
  
  const weeklyData = JSON.parse(PropertiesService.getScriptProperties().getProperty(instructionsId));
  const todayInstruction = weeklyData.instructions.find(inst => inst.day === dayNumber);
  
  if (!todayInstruction) {
    console.log(`ℹ️ Day ${dayNumber}の指示がありません`);
    return;
  }
  
  if (todayInstruction.skip) {
    console.log(`⏭️ Day ${dayNumber}はスキップ`);
    return;
  }
  
  // 週次プランから今日のトピックを取得
  const weeklyPlanId = PropertiesService.getScriptProperties().getProperty('currentWeeklyPlan');
  const weeklyPlan = JSON.parse(PropertiesService.getScriptProperties().getProperty(weeklyPlanId));
  const todaysTopic = weeklyPlan.dailyTopics[dayIndex];
  
  if (!todaysTopic) {
    console.log(`❌ Day ${dayNumber}のトピックが見つかりません`);
    return;
  }
  
  // 記事作成を実行
  console.log(`📝 Day ${dayNumber}の記事作成開始`);
  console.log(`📌 トピック: ${todaysTopic}`);
  console.log(`🛠️ カスタマイズ: ${todayInstruction.customization || 'なし'}`);
  
  // 提案データを作成
  const dailyProposal = {
    topic: todaysTopic,
    weeklyTheme: weeklyPlan.theme,
    aiSuggestion: generateAdvancedContentSuggestion(todaysTopic, weeklyPlan.focus),
    dayOfWeek: dayIndex
  };
  
  // 保存して記事作成
  const proposalId = `auto_daily_${Utilities.formatDate(today, 'JST', 'yyyyMMdd')}`;
  PropertiesService.getScriptProperties().setProperty(proposalId, JSON.stringify(dailyProposal));
  PropertiesService.getScriptProperties().setProperty('latestDailyProposal', proposalId);
  
  // 記事作成実行
  const success = createPremiumBlogPost(todayInstruction.customization);
  
  if (success) {
    console.log(`✅ Day ${dayNumber}の記事作成完了`);
  } else {
    console.log(`❌ Day ${dayNumber}の記事作成失敗`);
  }
}

// ===== ⏰ 週次一括システムのスケジューリング =====
function setupWeeklyBatchScheduling() {
  // 既存トリガーを削除
  ScriptApp.getProjectTriggers().forEach(trigger => {
    ScriptApp.deleteTrigger(trigger);
  });
  
  try {
    // 毎週月曜日朝7時に週次確認メール
    ScriptApp.newTrigger('sendWeeklyBatchConfirmation')
      .timeBased()
      .onWeekDay(ScriptApp.WeekDay.MONDAY)
      .atHour(7)
      .create();
    
    // 30分ごとに週次返信チェック
    ScriptApp.newTrigger('processWeeklyBatchReplies')
      .timeBased()
      .everyMinutes(30)
      .create();
    
    // 毎日朝9時に自動投稿実行
    ScriptApp.newTrigger('executeDailyPost')
      .timeBased()
      .atHour(9)
      .everyDays(1)
      .create();
    
    console.log('✅ 週次一括システムのスケジューリング設定完了');
    
    // 設定完了メール送信
    MailApp.sendEmail({
      to: CONFIG.recipientEmail,
      subject: '✅ 週次一括システム稼働開始 - LeadFive AI',
      htmlBody: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #8b5cf6, #ec4899); color: white; padding: 30px; border-radius: 12px; text-align: center;">
            <h1 style="margin: 0;">🎉 設定完了！</h1>
          </div>
          
          <div style="background: #f8fafc; padding: 25px; margin-top: 20px; border-radius: 8px;">
            <h2 style="color: #1e293b; margin: 0 0 15px 0;">📅 新しいスケジュール</h2>
            
            <div style="background: white; padding: 15px; border-radius: 6px; margin-bottom: 10px;">
              <strong style="color: #7c3aed;">毎週月曜日 朝7時</strong><br>
              週次記事プラン（7日分）が届きます
            </div>
            
            <div style="background: white; padding: 15px; border-radius: 6px; margin-bottom: 10px;">
              <strong style="color: #10b981;">返信で一括指示</strong><br>
              各記事のカスタマイズを指定できます
            </div>
            
            <div style="background: white; padding: 15px; border-radius: 6px;">
              <strong style="color: #f59e0b;">毎日朝9時</strong><br>
              指示に従って自動投稿されます
            </div>
            
            <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
              次回の週次確認メールは来週月曜日に届きます。
            </p>
          </div>
        </div>
      `,
      name: CONFIG.botName
    });
    
    return true;
  } catch (error) {
    console.error('❌ スケジューリング設定エラー:', error);
    return false;
  }
}

// ===== 🧪 テスト関数 =====
function testWeeklyBatchSystem() {
  console.log('🧪 週次一括システムテスト開始...');
  
  // 1. 週次確認メール送信テスト
  console.log('1. 週次確認メール送信テスト...');
  const emailSuccess = sendWeeklyBatchConfirmation();
  console.log('結果:', emailSuccess ? '✅成功' : '❌失敗');
  
  // 2. 週次指示の解析テスト
  console.log('\\n2. 週次指示解析テスト...');
  const testInstructions = parseWeeklyInstructions(`
    1: OK データ重視で
    2: OK 事例多めで
    3: SKIP
    4: OK
    5: OK 初心者向けで
  `);
  console.log('解析結果:', testInstructions.length + '件の指示');
  testInstructions.forEach(inst => {
    console.log(`Day ${inst.day}: ${inst.skip ? 'スキップ' : inst.customization || 'デフォルト'}`);
  });
  
  console.log('\\n✅ テスト完了');
}
```