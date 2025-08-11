// Google Apps Script - メールでブログ自動投稿
// Gmail + GitHub Actions 連携

// 設定
const CONFIG = {
  recipientEmail: 'your-email@gmail.com', // あなたのメールアドレス
  githubToken: 'YOUR_GITHUB_TOKEN', // PropertiesService に保存推奨
  githubOwner: 'YOUR_GITHUB_USERNAME',
  githubRepo: 'leadfive-demo',
  anthropicApiKey: 'YOUR_ANTHROPIC_API_KEY' // PropertiesService に保存推奨
};

// 毎週月曜日7時に実行される関数
function sendWeeklyBlogProposals() {
  const proposals = generateProposals();
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
      dateStr: Utilities.formatDate(date, 'JST', 'MM/dd(曜日名)'),
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

// HTMLメールを作成
function createProposalEmail(proposals, dateStr) {
  const urgencyColors = {
    '高': '#ef4444',
    '中': '#f59e0b',
    '低': '#10b981'
  };
  
  let html = `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #8b5cf6, #ec4899); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">📝 ${dateStr}のブログ提案</h1>
      </div>
      
      <div style="background: #f9fafb; padding: 20px;">
        <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
          おはようございます！<br>
          本日のブログ記事候補を5つご提案します。<br>
          <strong style="color: #8b5cf6;">返信で番号（1〜5）を送信するだけで記事が作成されます。</strong>
        </p>
        
        <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
          <p style="margin: 0; font-size: 14px; color: #6b7280;">
            💡 ヒント: "1 カスタム: 事例を3つ追加して" のように返信すると、カスタマイズも可能です
          </p>
        </div>
  `;
  
  // 各提案をカード形式で表示
  proposals.forEach((proposal, index) => {
    html += `
      <div style="background: white; border: 2px solid #e5e7eb; border-radius: 12px; padding: 20px; margin-bottom: 15px;">
        <div style="display: flex; align-items: center; margin-bottom: 10px;">
          <span style="background: ${urgencyColors[proposal.urgency]}; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold;">
            ${proposal.urgency === '高' ? '🔴 急ぎ' : proposal.urgency === '中' ? '🟡 通常' : '🟢 じっくり'}
          </span>
          <span style="margin-left: 10px; color: #6b7280; font-size: 14px;">
            📖 ${proposal.readTime}で読める
          </span>
        </div>
        
        <h2 style="font-size: 18px; color: #111827; margin: 10px 0; font-weight: bold;">
          ${proposal.id}. ${proposal.title}
        </h2>
        
        <p style="color: #6b7280; font-size: 14px; margin: 10px 0;">
          ${proposal.description}
        </p>
        
        <div style="background: #f3f4f6; padding: 12px; border-radius: 8px; margin-top: 15px;">
          <p style="margin: 0; font-size: 13px; color: #4b5563;">
            <strong>👥 想定読者:</strong> ${proposal.audience}<br>
            <strong>🎯 期待効果:</strong> ${proposal.expectedResult}
          </p>
        </div>
      </div>
    `;
  });
  
  html += `
        <div style="text-align: center; margin-top: 30px;">
          <p style="color: #6b7280; font-size: 14px;">
            その他のオプション：<br>
            • "新しい提案" と返信 → 別の5案を生成<br>
            • "スキップ" と返信 → 今日は投稿しない<br>
            • 具体的なトピックを返信 → そのテーマで作成
          </p>
        </div>
      </div>
      
      <div style="background: #1f2937; color: #9ca3af; padding: 20px; text-align: center; border-radius: 0 0 10px 10px;">
        <p style="margin: 0; font-size: 12px;">
          LeadFive AI Blog Assistant<br>
          設定変更: <a href="https://script.google.com" style="color: #8b5cf6;">Google Apps Script</a>
        </p>
      </div>
    </div>
  `;
  
  return html;
}

// 提案をスプレッドシートに保存
function saveProposalsToSheet(proposals) {
  const sheet = SpreadsheetApp.create('Blog Proposals Log').getActiveSheet();
  const timestamp = new Date();
  
  proposals.forEach(proposal => {
    sheet.appendRow([
      timestamp,
      proposal.id,
      proposal.title,
      proposal.description,
      proposal.urgency,
      'pending'
    ]);
  });
}

// メール返信を処理（定期的に実行）
function processEmailReplies() {
  const threads = GmailApp.search('subject:"ブログ提案" is:unread');
  
  threads.forEach(thread => {
    const messages = thread.getMessages();
    const lastMessage = messages[messages.length - 1];
    
    if (lastMessage.getFrom().includes(CONFIG.recipientEmail)) {
      const replyText = lastMessage.getPlainBody().trim();
      
      // 番号で返信された場合
      if (/^[1-5]/.test(replyText)) {
        const proposalNumber = parseInt(replyText.charAt(0));
        const customization = replyText.substring(1).trim();
        
        // GitHub Actions をトリガー
        triggerBlogCreation(proposalNumber, customization);
        
        // 確認メールを送信
        MailApp.sendEmail({
          to: CONFIG.recipientEmail,
          subject: '✅ ブログ記事作成開始',
          htmlBody: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
              <h2>記事作成を開始しました！</h2>
              <p>提案 #${proposalNumber} で記事を作成中です。</p>
              ${customization ? `<p>カスタマイズ: ${customization}</p>` : ''}
              <p>10-15分後に GitHub に投稿されます。</p>
              <a href="https://github.com/${CONFIG.githubOwner}/${CONFIG.githubRepo}" 
                 style="background: #8b5cf6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">
                GitHubで確認
              </a>
            </div>
          `
        });
      }
      
      // メッセージを既読にする
      lastMessage.markRead();
    }
  });
}

// GitHub Actions をトリガー
function triggerBlogCreation(proposalNumber, customization) {
  const proposals = getStoredProposals(); // スプレッドシートから取得
  const selected = proposals[proposalNumber - 1];
  
  const payload = {
    event_type: 'blog-post-from-email',
    client_payload: {
      topic: selected.title,
      description: selected.description,
      audience: selected.audience,
      customization: customization || '',
      timestamp: new Date().toISOString()
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
}

// トリガー設定用関数
function setupTriggers() {
  // 毎朝7時に提案送信
  ScriptApp.newTrigger('sendDailyBlogProposals')
    .timeBased()
    .atHour(7)
    .everyDays(1)
    .create();
  
  // 10分ごとに返信チェック
  ScriptApp.newTrigger('processEmailReplies')
    .timeBased()
    .everyMinutes(10)
    .create();
}

// 手動テスト用
function testSendProposal() {
  sendDailyBlogProposals();
}