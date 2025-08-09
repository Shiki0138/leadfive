// Google Apps Script コード
// このコードをGoogle Apps Scriptエディタに貼り付けてください

// メイン関数：POSTリクエストを処理
function doPost(e) {
  try {
    // POSTデータを解析
    const data = JSON.parse(e.postData.contents);
    
    // スプレッドシートに記録
    const result = saveToSpreadsheet(data);
    
    // メール通知を送信
    sendNotificationEmail(data);
    
    // 成功レスポンス
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        message: 'お問い合わせを受信しました'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error:', error);
    
    // エラーレスポンス
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// スプレッドシートに保存
function saveToSpreadsheet(data) {
  // アクティブなスプレッドシートを取得
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName('お問い合わせ');
  
  // シートが存在しない場合は作成
  if (!sheet) {
    sheet = spreadsheet.insertSheet('お問い合わせ');
    
    // ヘッダー行を設定
    const headers = [
      '受信日時',
      'ステータス',
      '会社名',
      'お名前',
      'メールアドレス',
      '電話番号',
      'お問い合わせ種別',
      '興味のあるサービス',
      'メッセージ',
      '送信元URL',
      '対応者',
      '対応日',
      'メモ'
    ];
    
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    
    // ヘッダー行のスタイル設定
    sheet.getRange(1, 1, 1, headers.length)
      .setBackground('#1e3a8a')
      .setFontColor('#ffffff')
      .setFontWeight('bold');
    
    // 列幅の調整
    sheet.setColumnWidth(1, 150); // 受信日時
    sheet.setColumnWidth(2, 100); // ステータス
    sheet.setColumnWidth(3, 200); // 会社名
    sheet.setColumnWidth(4, 150); // お名前
    sheet.setColumnWidth(5, 250); // メールアドレス
    sheet.setColumnWidth(9, 400); // メッセージ
  }
  
  // 新しい行にデータを追加
  const newRow = [
    data.timestamp || new Date().toLocaleString('ja-JP'),
    '未対応',
    data.company || '',
    data.name || '',
    data.email || '',
    data.phone || '',
    data.inquiry_type || '',
    data.interest || '',
    data.message || '',
    data.source_url || '',
    '', // 対応者
    '', // 対応日
    ''  // メモ
  ];
  
  sheet.appendRow(newRow);
  
  // 新しい行の行番号を取得
  const lastRow = sheet.getLastRow();
  
  // ステータスセルに条件付き書式を設定
  const statusCell = sheet.getRange(lastRow, 2);
  statusCell.setBackground('#fee2e2').setFontColor('#991b1b');
  
  return { success: true, row: lastRow };
}

// メール通知を送信
function sendNotificationEmail(data) {
  const recipient = 'leadfive.138@gmail.com';
  const subject = `【LeadFive】新規お問い合わせ: ${data.name}様 (${data.company})`;
  
  // HTMLメール本文
  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Noto Sans JP', sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #1e3a8a; color: white; padding: 20px; border-radius: 10px 10px 0 0; }
    .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 10px 10px; }
    .info-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .info-table th { text-align: left; padding: 10px; background: #e5e7eb; width: 30%; }
    .info-table td { padding: 10px; background: white; }
    .message-box { background: white; padding: 20px; border-left: 4px solid #1e3a8a; margin: 20px 0; }
    .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 12px; }
    .action-button { display: inline-block; background: #1e3a8a; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2 style="margin: 0;">新規お問い合わせを受信しました</h2>
      <p style="margin: 5px 0 0 0;">受信日時: ${data.timestamp}</p>
    </div>
    
    <div class="content">
      <h3 style="color: #1e3a8a; margin-top: 0;">お客様情報</h3>
      <table class="info-table">
        <tr>
          <th>会社名</th>
          <td>${data.company || '未記入'}</td>
        </tr>
        <tr>
          <th>お名前</th>
          <td>${data.name}</td>
        </tr>
        <tr>
          <th>メールアドレス</th>
          <td><a href="mailto:${data.email}">${data.email}</a></td>
        </tr>
        <tr>
          <th>電話番号</th>
          <td>${data.phone || '未記入'}</td>
        </tr>
        <tr>
          <th>お問い合わせ種別</th>
          <td>${data.inquiry_type || '未選択'}</td>
        </tr>
        <tr>
          <th>興味のあるサービス</th>
          <td>${data.interest || 'なし'}</td>
        </tr>
      </table>
      
      <h3 style="color: #1e3a8a;">お問い合わせ内容</h3>
      <div class="message-box">
        ${data.message.replace(/\n/g, '<br>')}
      </div>
      
      <p>
        <a href="${SpreadsheetApp.getActiveSpreadsheet().getUrl()}" class="action-button">
          スプレッドシートで確認
        </a>
      </p>
      
      <div class="footer">
        <p>このメールは自動送信されています。</p>
        <p>送信元: ${data.source_url}</p>
      </div>
    </div>
  </div>
</body>
</html>
`;

  // プレーンテキスト版
  const textBody = `
新規お問い合わせを受信しました

━━━━━━━━━━━━━━━━━━━━━━
■ お客様情報
━━━━━━━━━━━━━━━━━━━━━━
会社名: ${data.company || '未記入'}
お名前: ${data.name}
メール: ${data.email}
電話番号: ${data.phone || '未記入'}
お問い合わせ種別: ${data.inquiry_type || '未選択'}
興味のあるサービス: ${data.interest || 'なし'}

■ お問い合わせ内容
━━━━━━━━━━━━━━━━━━━━━━
${data.message}

━━━━━━━━━━━━━━━━━━━━━━
受信日時: ${data.timestamp}
送信元: ${data.source_url}

スプレッドシート:
${SpreadsheetApp.getActiveSpreadsheet().getUrl()}
`;

  // メール送信
  GmailApp.sendEmail(recipient, subject, textBody, {
    htmlBody: htmlBody,
    name: 'LeadFive お問い合わせシステム',
    replyTo: data.email
  });
}

// テスト関数（手動実行用）
function testDoPost() {
  const testData = {
    postData: {
      contents: JSON.stringify({
        timestamp: new Date().toLocaleString('ja-JP'),
        company: 'テスト株式会社',
        name: 'テスト太郎',
        email: 'test@example.com',
        phone: '03-1234-5678',
        inquiry_type: 'サービスについて',
        interest: 'AI×心理学LP最適化, 顧客心理データ分析',
        message: 'これはテストメッセージです。\n改行も含まれています。',
        source_url: 'https://example.com/contact',
        privacy: 'yes'
      })
    }
  };
  
  const result = doPost(testData);
  console.log(result.getContent());
}

// 初期設定用関数
function initialSetup() {
  // トリガーの設定（必要に応じて）
  // ScriptApp.newTrigger('doPost')
  //   .forSpreadsheet(SpreadsheetApp.getActiveSpreadsheet())
  //   .onFormSubmit()
  //   .create();
  
  console.log('Web App URL を取得してください:');
  console.log('デプロイ → 新しいデプロイ → ウェブアプリ');
  console.log('実行ユーザー: 自分');
  console.log('アクセス権: 全員');
}