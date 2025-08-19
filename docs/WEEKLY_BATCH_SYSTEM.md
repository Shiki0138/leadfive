# 🗓️ 週次一括指示システム実装ガイド

## 📋 システム概要

週1回（月曜日）にメールで7日分の記事案を送信し、一括返信で全ての記事をカスタマイズできるシステムです。

## 🔄 新しいワークフロー

### 1. **週次企画メール（月曜日朝7時）**

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
          <p style="margin: 0; color: #475569;">
            各記事番号の後に指示を記入して返信してください。<br>
            例：<br>
            1: OK データ重視で<br>
            2: OK 事例多めで<br>
            3: SKIP<br>
            4: OK<br>
            5: OK 初心者向けで<br>
            6: OK 美容業界特化で<br>
            7: OK
          </p>
        </div>
        
        ${weeklyPlan.dailyTopics.map((topic, index) => {
          const dayNames = ['月', '火', '水', '木', '金', '土', '日'];
          const dayOfWeek = (today.getDay() + index) % 7;
          
          return `
            <div style="background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 12px; padding: 25px; margin-bottom: 20px;">
              <div style="display: flex; justify-content: space-between; align-items: start;">
                <div style="flex: 1;">
                  <h3 style="margin: 0 0 10px 0; color: #1e293b; font-size: 20px;">
                    ${index + 1}. ${dayNames[dayOfWeek]}曜日
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
          返信後、毎日指定時刻に自動投稿されます
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
    const match = line.match(/^(\d):\s*(.+)/);
    if (match) {
      const dayNumber = parseInt(match[1]);
      const instruction = match[2].trim();
      
      instructions.push({
        day: dayNumber,
        instruction: instruction,
        skip: instruction.toUpperCase() === 'SKIP',
        customization: instruction.replace(/^OK\s*/i, '').trim()
      });
    }
  });
  
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

// ===== 📅 毎日の自動実行 =====
function executeDailyPost() {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0=日曜日
  const adjustedDay = dayOfWeek === 0 ? 7 : dayOfWeek; // 月曜日を1とする
  
  // アクティブな週次指示を取得
  const instructionsId = PropertiesService.getScriptProperties().getProperty('activeWeeklyInstructions');
  if (!instructionsId) {
    console.log('⚠️ アクティブな週次指示がありません');
    return;
  }
  
  const weeklyData = JSON.parse(PropertiesService.getScriptProperties().getProperty(instructionsId));
  const todayInstruction = weeklyData.instructions.find(inst => inst.day === adjustedDay);
  
  if (!todayInstruction) {
    console.log(`ℹ️ ${adjustedDay}日目の指示がありません`);
    return;
  }
  
  if (todayInstruction.skip) {
    console.log(`⏭️ ${adjustedDay}日目はスキップ`);
    return;
  }
  
  // 週次プランから今日のトピックを取得
  const weeklyPlanId = PropertiesService.getScriptProperties().getProperty('currentWeeklyPlan');
  const weeklyPlan = JSON.parse(PropertiesService.getScriptProperties().getProperty(weeklyPlanId));
  const todaysTopic = weeklyPlan.dailyTopics[adjustedDay - 1];
  
  // 記事作成を実行
  console.log(`📝 ${adjustedDay}日目の記事作成: ${todaysTopic}`);
  console.log(`🛠️ カスタマイズ: ${todayInstruction.customization || 'なし'}`);
  
  // 提案データを作成
  const dailyProposal = {
    topic: todaysTopic,
    weeklyTheme: weeklyPlan.theme,
    aiSuggestion: generateAdvancedContentSuggestion(todaysTopic, weeklyPlan.focus),
    dayOfWeek: adjustedDay - 1
  };
  
  // 保存して記事作成
  const proposalId = `auto_daily_${Utilities.formatDate(today, 'JST', 'yyyyMMdd')}`;
  PropertiesService.getScriptProperties().setProperty(proposalId, JSON.stringify(dailyProposal));
  PropertiesService.getScriptProperties().setProperty('latestDailyProposal', proposalId);
  
  createPremiumBlogPost(todayInstruction.customization);
}

// ===== ⏰ 新しいスケジューリング設定 =====
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
    
    // 30分ごとに週次返信チェック（月曜日のみ頻繁に）
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
    return true;
  } catch (error) {
    console.error('❌ スケジューリング設定エラー:', error);
    return false;
  }
}
```

## 🎯 返信フォーマット例

### **基本的な返信**
```
1: OK
2: OK
3: OK
4: OK
5: OK
6: OK
7: OK
```

### **カスタマイズ込みの返信**
```
1: OK データ重視で
2: OK 事例多めで
3: SKIP
4: OK 初心者向けで
5: OK
6: OK 美容業界特化で
7: OK 実践手順で
```

### **部分的にスキップ**
```
1: OK
2: OK
3: SKIP
4: SKIP
5: OK データ重視で
6: OK
7: OK
```

## 📊 メリット

1. **効率性向上**
   - 週1回の確認で済む
   - 一括で計画を把握できる
   - 週末にまとめて計画可能

2. **柔軟性**
   - 各日個別にカスタマイズ可能
   - 特定の日をスキップ可能
   - 週の途中で変更不要

3. **計画性**
   - 1週間の流れを俯瞰できる
   - 戦略的なコンテンツ配置
   - 一貫性のあるテーマ展開

## 🔧 実装手順

1. **既存のGoogle Apps Scriptに上記コードを追加**
2. **`setupWeeklyBatchScheduling()` を実行**
3. **月曜日に週次確認メールが届く**
4. **指定フォーマットで返信**
5. **毎日自動で記事が投稿される**

## ⚠️ 注意事項

- 返信は月曜日中に行う必要があります
- 未返信の場合はデフォルト設定で投稿
- 週の途中での変更は次週から反映