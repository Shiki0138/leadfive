// Google Apps Script - 週間ブログ自動投稿システム
// Gmail + GitHub Actions 連携 (週1回確認版)

// 設定
const CONFIG = {
  recipientEmail: 'your-email@gmail.com', // あなたのメールアドレス
  githubToken: 'YOUR_GITHUB_TOKEN', // PropertiesService に保存推奨
  githubOwner: 'YOUR_GITHUB_USERNAME',
  githubRepo: 'leadfive-demo',
  anthropicApiKey: 'YOUR_ANTHROPIC_API_KEY' // PropertiesService に保存推奨
};

// 毎週月曜日7時に実行される関数
function sendWeeklyBlogProposal() {
  const today = new Date();
  const dateStr = Utilities.formatDate(today, 'JST', 'MM月dd日');
  
  // 週間ブログ計画を生成（7記事）
  const weeklyPlan = generateWeeklyPlan();
  
  // HTMLメールを作成
  const htmlBody = createWeeklyPlanEmail(weeklyPlan, dateStr);
  
  // メール送信
  MailApp.sendEmail({
    to: CONFIG.recipientEmail,
    subject: `【LeadFive】${dateStr}からの週間ブログ計画 - 返信で承認`,
    htmlBody: htmlBody,
    name: 'LeadFive AIアシスタント'
  });
  
  // 週間計画をスプレッドシートに保存（後で参照用）
  saveWeeklyPlanToSheet(weeklyPlan);
}

// 週間ブログ計画を生成（7記事）
function generateWeeklyPlan() {
  const startDate = new Date();
  const weekDays = ['月', '火', '水', '木', '金', '土', '日'];
  
  // 曜日別のテーマ設定
  const dailyThemes = {
    0: { focus: 'AI戦略編', keywords: ['AI戦略', 'デジタル変革', '競合優位'] },
    1: { focus: '実践テクニック編', keywords: ['ノウハウ', '実装方法', 'ツール活用'] },
    2: { focus: 'データ分析編', keywords: ['データ分析', 'KPI', '成果測定'] },
    3: { focus: 'トレンド編', keywords: ['最新トレンド', '業界動向', '未来予測'] },
    4: { focus: '事例研究編', keywords: ['成功事例', '実績分析', 'ケーススタディ'] },
    5: { focus: '学習コンテンツ編', keywords: ['基礎理論', '初心者向け', '入門ガイド'] },
    6: { focus: '総合戦略編', keywords: ['統合戦略', '経営判断', '長期計画'] }
  };
  
  const weeklyPlan = [];
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i + 1); // 翌日から開始
    const dayIndex = i;
    const theme = dailyThemes[dayIndex];
    
    weeklyPlan.push({
      day: i + 1,
      dayName: weekDays[i],
      date: date,
      dateStr: Utilities.formatDate(date, 'JST', 'MM/dd').replace(/(\d+)\/(\d+)/, '$1/$2(' + weekDays[i] + ')'),
      theme: theme.focus,
      keywords: theme.keywords,
      // サンプル記事タイトル（実際はAIで生成）
      suggestedTitle: generateSampleTitle(theme.focus, theme.keywords[0]),
      expectedLength: '2500-4000文字',
      audience: '企業の意思決定者・マーケティング責任者'
    });
  }
  
  return weeklyPlan;
}

// サンプルタイトル生成
function generateSampleTitle(theme, keyword) {
  const titleTemplates = [
    `${keyword}で売上3倍を実現する5つの方法`,
    `【${new Date().getFullYear()}年最新】${keyword}完全ガイド`,
    `${keyword}で失敗しないための7つのポイント`,
    `なぜ今${keyword}が注目されるのか？従来手法との違い`,
    `${keyword}導入でROI300%達成した企業の秘訣`
  ];
  
  return titleTemplates[Math.floor(Math.random() * titleTemplates.length)];
}

// 週間ブログ計画メールを作成
function createWeeklyPlanEmail(weeklyPlan, dateStr) {
  let html = `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 700px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #8b5cf6, #ec4899); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">📅 ${dateStr}からの週間ブログ計画</h1>
        <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">翌日から7日間連続投稿</p>
      </div>
      
      <div style="background: #f9fafb; padding: 20px;">
        <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
          お疲れさまでした！<br>
          来週のブログ記事計画（7記事）をご提案します。<br>
          <strong style="color: #8b5cf6;">「承認」と返信すると、翌日から7日間連続で投稿開始！</strong>
        </p>
        
        <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <p style="margin: 0; font-size: 14px; color: #6b7280;">
            💡 オプション: 「修正 特定の日の内容を変更」で部分変更も可能
          </p>
        </div>
        
        <h2 style="color: #374151; font-size: 18px; margin-bottom: 15px;">📅 週間スケジュール</h2>
  `;
  
  // 各日の計画をタイムライン形式で表示
  weeklyPlan.forEach((dayPlan, index) => {
    const isFirst = index === 0;
    const borderColor = isFirst ? '#8b5cf6' : '#e5e7eb';
    const bgColor = isFirst ? '#f3e8ff' : 'white';
    
    html += `
      <div style="background: ${bgColor}; border: 2px solid ${borderColor}; border-radius: 12px; padding: 20px; margin-bottom: 15px; position: relative;">
        ${isFirst ? '<div style="position: absolute; top: -5px; right: 10px; background: #8b5cf6; color: white; padding: 2px 8px; border-radius: 12px; font-size: 10px; font-weight: bold;">明日から開始</div>' : ''}
        
        <div style="display: flex; align-items: center; margin-bottom: 15px;">
          <div style="background: #3b82f6; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px;">
            ${dayPlan.day}
          </div>
          <div>
            <h3 style="margin: 0; font-size: 16px; color: #111827; font-weight: bold;">
              ${dayPlan.dateStr} - ${dayPlan.theme}
            </h3>
            <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 14px;">
              キーワード: ${dayPlan.keywords.join(', ')}
            </p>
          </div>
        </div>
        
        <div style="background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #3b82f6;">
          <h4 style="margin: 0 0 10px 0; color: #374151; font-size: 15px; font-weight: bold;">
            提案タイトル
          </h4>
          <p style="margin: 0 0 10px 0; color: #4b5563; font-size: 14px; line-height: 1.5;">
            ${dayPlan.suggestedTitle}
          </p>
          <div style="display: flex; gap: 15px; font-size: 12px; color: #6b7280;">
            <span>📏 ${dayPlan.expectedLength}</span>
            <span>👥 ${dayPlan.audience}</span>
          </div>
        </div>
      </div>
    `;
  });
  
  html += `
        <div style="background: white; padding: 20px; border-radius: 12px; margin-top: 20px; border: 2px solid #10b981;">
          <h3 style="color: #047857; margin: 0 0 15px 0; font-size: 18px;">📝 返信オプション</h3>
          
          <div style="margin-bottom: 15px;">
            <p style="margin: 0; color: #374151; font-weight: bold;">✅ 「承認」 → 7日間の自動投稿開始</p>
            <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 14px;">翌朝9時から毎日1記事ずつ投稿されます</p>
          </div>
          
          <div style="margin-bottom: 15px;">
            <p style="margin: 0; color: #374151; font-weight: bold;">✏️ 「修正 [日数] [指示]」 → 部分修正</p>
            <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 14px;">例: 修正 3日目 事例をEC業界にして</p>
          </div>
          
          <div style="margin-bottom: 15px;">
            <p style="margin: 0; color: #374151; font-weight: bold;">❌ 「スキップ」 → 今週は投稿しない</p>
            <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 14px;">来週また提案します</p>
          </div>
          
          <div>
            <p style="margin: 0; color: #374151; font-weight: bold;">🔄 「再生成」 → 新しい7日間プランを作成</p>
            <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 14px;">完全に異なる内容で再提案</p>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 15px;">
            <p style="margin: 0; font-size: 14px; color: #92400e;">
              ⚠️ 承認後は翌朝9時から自動的に投稿が開始されます。<br>
              途中停止をご希望の場合はお早めにご連絡ください。
            </p>
          </div>
        </div>
      </div>
      
      <div style="background: #1f2937; color: #9ca3af; padding: 20px; text-align: center; border-radius: 0 0 10px 10px;">
        <p style="margin: 0; font-size: 12px;">
          LeadFive AI Weekly Blog System<br>
          設定変更: <a href="https://script.google.com" style="color: #8b5cf6;">Google Apps Script</a>
        </p>
      </div>
    </div>
  `;
  
  return html;
}

// 週間計画をスプレッドシートに保存
function saveWeeklyPlanToSheet(weeklyPlan) {
  const spreadsheet = SpreadsheetApp.create(`Weekly Blog Plan - ${Utilities.formatDate(new Date(), 'JST', 'yyyy-MM-dd')}`);
  const sheet = spreadsheet.getActiveSheet();
  
  // ヘッダー行を追加
  sheet.appendRow([
    'Day', 'Date', 'Day Name', 'Theme', 'Keywords', 'Suggested Title', 
    'Expected Length', 'Audience', 'Status', 'Created At'
  ]);
  
  const timestamp = new Date();
  
  weeklyPlan.forEach(dayPlan => {
    sheet.appendRow([
      dayPlan.day,
      dayPlan.dateStr,
      dayPlan.dayName,
      dayPlan.theme,
      dayPlan.keywords.join(', '),
      dayPlan.suggestedTitle,
      dayPlan.expectedLength,
      dayPlan.audience,
      'pending',
      timestamp
    ]);
  });
  
  console.log(`週間計画を保存: ${spreadsheet.getUrl()}`);
}

// メール返信を処理（定期的に実行）
function processWeeklyEmailReplies() {
  const threads = GmailApp.search('subject:"週間ブログ計画" is:unread');
  
  threads.forEach(thread => {
    const messages = thread.getMessages();
    const lastMessage = messages[messages.length - 1];
    
    if (lastMessage.getFrom().includes(CONFIG.recipientEmail)) {
      const replyText = lastMessage.getPlainBody().trim().toLowerCase();
      
      // 承認の場合
      if (replyText.includes('承認')) {
        scheduleWeeklyPosts();
        sendConfirmationEmail('approved');
      }
      // 修正の場合
      else if (replyText.includes('修正')) {
        handleModificationRequest(replyText);
      }
      // スキップの場合
      else if (replyText.includes('スキップ')) {
        sendConfirmationEmail('skipped');
      }
      // 再生成の場合
      else if (replyText.includes('再生成')) {
        sendWeeklyBlogProposal(); // 新しい計画を再送信
      }
      
      // メッセージを既読にする
      lastMessage.markRead();
    }
  });
}

// 7日間の投稿スケジュールを設定
function scheduleWeeklyPosts() {
  const weeklyPlan = getLatestWeeklyPlan(); // スプレッドシートから最新プランを取得
  
  weeklyPlan.forEach((dayPlan, index) => {
    const publishDate = new Date();
    publishDate.setDate(publishDate.getDate() + index + 1); // 翌日から開始
    publishDate.setHours(9, 0, 0, 0); // 毎日9時投稿
    
    // GitHub Actions に投稿予約リクエストを送信
    const payload = {
      event_type: 'scheduled-blog-post',
      client_payload: {
        day: dayPlan.day,
        publishDate: publishDate.toISOString(),
        theme: dayPlan.theme,
        keywords: dayPlan.keywords,
        suggestedTitle: dayPlan.suggestedTitle,
        audience: dayPlan.audience
      }
    };
    
    const options = {
      method: 'post',
      headers: {
        'Authorization': 'token ' + CONFIG.githubToken,
        'Accept': 'application/vnd.github.v3+json'
      },
      payload: JSON.stringify(payload)
    };
    
    UrlFetchApp.fetch(
      `https://api.github.com/repos/${CONFIG.githubOwner}/${CONFIG.githubRepo}/dispatches`,
      options
    );
  });
}

// 確認メールを送信
function sendConfirmationEmail(action) {
  let subject = '';
  let message = '';
  
  switch(action) {
    case 'approved':
      subject = '✅ 週間ブログ計画が承認されました';
      message = `
        <h2>7日間の自動投稿を開始します！</h2>
        <p>明日朝9時から毎日1記事ずつ投稿されます。</p>
        <p>投稿状況は GitHub でご確認いただけます。</p>
      `;
      break;
    case 'skipped':
      subject = '⏭️ 今週の投稿をスキップしました';
      message = `
        <h2>今週の投稿をスキップします</h2>
        <p>来週月曜日に新しい計画をお送りします。</p>
      `;
      break;
  }
  
  MailApp.sendEmail({
    to: CONFIG.recipientEmail,
    subject: subject,
    htmlBody: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        ${message}
        <a href="https://github.com/${CONFIG.githubOwner}/${CONFIG.githubRepo}" 
           style="background: #8b5cf6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 15px;">
          GitHubで確認
        </a>
      </div>
    `
  });
}

// 修正リクエストを処理
function handleModificationRequest(requestText) {
  // 簡易版の修正処理
  // 実際の実装では、リクエストを解析して該当日の記事を修正
  
  MailApp.sendEmail({
    to: CONFIG.recipientEmail,
    subject: '🔄 修正リクエストを受け付けました',
    htmlBody: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>修正内容を確認中です</h2>
        <p>リクエスト内容: ${requestText}</p>
        <p>修正版の計画を10分以内にお送りします。</p>
      </div>
    `
  });
}

// 最新の週間計画を取得
function getLatestWeeklyPlan() {
  // スプレッドシートから最新の週間計画を取得
  // 簡易版では固定データを返す
  return generateWeeklyPlan();
}

// トリガー設定用関数
function setupWeeklyTriggers() {
  // 毎週月曜日7時に提案送信
  ScriptApp.newTrigger('sendWeeklyBlogProposal')
    .timeBased()
    .onWeekDay(ScriptApp.WeekDay.MONDAY)
    .atHour(7)
    .create();
  
  // 10分ごとに返信チェック
  ScriptApp.newTrigger('processWeeklyEmailReplies')
    .timeBased()
    .everyMinutes(10)
    .create();
}

// 手動テスト用
function testSendWeeklyProposal() {
  sendWeeklyBlogProposal();
}

// 手動テスト用（返信処理）
function testProcessReplies() {
  processWeeklyEmailReplies();
}