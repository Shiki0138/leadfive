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

// 毎朝7時に実行される関数
function sendDailyBlogProposals() {
  const proposals = generateProposals();
  const today = new Date();
  const dateStr = Utilities.formatDate(today, 'JST', 'MM月dd日');
  
  // HTMLメールを作成
  const htmlBody = createProposalEmail(proposals, dateStr);
  
  // メール送信
  MailApp.sendEmail({
    to: CONFIG.recipientEmail,
    subject: `【LeadFive】${dateStr}のブログ提案 - 返信で選択`,
    htmlBody: htmlBody,
    name: 'LeadFive AIアシスタント'
  });
  
  // 提案をスプレッドシートに保存（後で参照用）
  saveProposalsToSheet(proposals);
}

// AI提案を生成
function generateProposals() {
  const dayOfWeek = new Date().getDay();
  const dayNames = ['日', '月', '火', '水', '木', '金', '土'];
  
  // 曜日別のテーマ
  const themes = {
    1: { focus: '週始めの戦略', keywords: ['計画', '目標', '戦略'] },
    2: { focus: '実践テクニック', keywords: ['How-to', '手法', '実装'] },
    3: { focus: 'データ分析', keywords: ['分析', '数値', 'KPI'] },
    4: { focus: 'トレンド', keywords: ['最新', 'トレンド', '動向'] },
    5: { focus: '成果共有', keywords: ['事例', '成果', '実績'] },
    6: { focus: '学習コンテンツ', keywords: ['入門', '基礎', '理論'] },
    0: { focus: '戦略思考', keywords: ['戦略', '未来', 'ビジョン'] }
  };
  
  const theme = themes[dayOfWeek];
  
  // Claude API を呼び出して提案生成（簡易版）
  // 実際の実装では UrlFetchApp で API を呼び出す
  return [
    {
      id: 1,
      title: "ChatGPT活用で売上3倍を実現する5つのステップ",
      description: "中小企業が実践できる具体的なAI活用法",
      audience: "中小企業の経営者・マーケター",
      urgency: "高",
      readTime: "7分",
      expectedResult: "AIツールの導入計画が立てられる"
    },
    {
      id: 2,
      title: "8つの本能を刺激するランディングページ設計術",
      description: "心理学的アプローチでCVR267%改善の実例",
      audience: "Webマーケター・デザイナー",
      urgency: "中",
      readTime: "10分",
      expectedResult: "LP改善の具体的な方法がわかる"
    },
    {
      id: 3,
      title: "競合に差をつけるAI×心理学マーケティング",
      description: "LeadFive独自のフレームワークを初公開",
      audience: "マーケティング責任者",
      urgency: "高",
      readTime: "12分",
      expectedResult: "差別化戦略が立案できる"
    },
    {
      id: 4,
      title: "顧客インサイトをAIで可視化する方法",
      description: "アンケートでは見えない本音を掴む",
      audience: "カスタマーサクセス・営業",
      urgency: "中",
      readTime: "8分",
      expectedResult: "顧客理解が深まる"
    },
    {
      id: 5,
      title: "【保存版】AIツール選定チェックリスト",
      description: "失敗しないための27のチェックポイント",
      audience: "AI導入検討中の企業",
      urgency: "低",
      readTime: "5分",
      expectedResult: "最適なツールを選べる"
    }
  ];
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