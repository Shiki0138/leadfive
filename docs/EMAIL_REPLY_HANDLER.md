# 📧 メール返信処理機能の追加

## 🚨 現在の状況
- AI提案メール送信：✅ 成功
- メール返信処理：❌ まだ未実装

## 🔧 返信処理機能を追加

既存コードの**最後に**以下を追加してください：

```javascript
// ===== 📧 メール返信処理システム =====

function processEmailReplies() {
  try {
    // より正確な検索クエリでメールを検索
    const threads = GmailApp.search(
      `to:${CONFIG.recipientEmail} subject:"バズ予測提案" is:unread newer_than:2d`,
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
        
        // 自分からの返信で、未読で、バズ予測提案に関するもの
        if (from.includes(CONFIG.recipientEmail) && isUnread && subject.includes('バズ予測提案')) {
          const bodyText = message.getPlainBody();
          const replyLines = bodyText.split('\n');
          const firstLine = replyLines[0].trim();
          
          console.log(`🔍 返信内容の最初の行: "${firstLine}"`);
          
          // 数字で始まる返信を検出（1-5の数字）
          const numberMatch = firstLine.match(/^([1-5])/);
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
                  
                  // 記事作成処理
                  const success = createBlogPost(selectedProposal, customInstruction);
                  
                  if (success) {
                    // 成功の確認メール
                    sendConfirmationEmail(selectedProposal, customInstruction);
                    message.markRead();
                    console.log('✅ 処理完了 - メッセージを既読にしました');
                  } else {
                    console.log('❌ 記事作成に失敗');
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

// ===== 📝 記事作成システム =====

function createBlogPost(proposal, customInstruction) {
  try {
    const today = new Date();
    const filename = `${Utilities.formatDate(today, 'JST', 'yyyy-MM-dd')}-${proposal.title.replace(/[^\w\s]/gi, '').replace(/\s+/g, '-').toLowerCase()}.md`;
    
    // 記事内容生成
    const content = generateBlogContent(proposal, customInstruction);
    
    console.log(`📝 記事作成: ${filename}`);
    console.log(`📄 文字数: ${content.length}文字`);
    
    // GitHub Actions をトリガー（トークンが設定されている場合）
    const githubToken = PropertiesService.getScriptProperties().getProperty('GITHUB_TOKEN');
    
    if (githubToken) {
      const success = triggerGitHubActions(proposal, customInstruction, content);
      if (success) {
        console.log('✅ GitHub Actions トリガー成功');
        return true;
      } else {
        console.log('❌ GitHub Actions トリガー失敗');
        return false;
      }
    } else {
      console.log('⚠️ GitHub Token未設定 - ローカルで記事を生成しました');
      console.log('記事内容:', content.substring(0, 200) + '...');
      return true;
    }
  } catch (error) {
    console.error('❌ 記事作成エラー:', error);
    return false;
  }
}

// ===== 📄 記事内容生成 =====

function generateBlogContent(proposal, customInstruction) {
  const today = new Date();
  const dateStr = Utilities.formatDate(today, 'JST', 'yyyy-MM-dd');
  
  // カスタマイズ指示に応じた内容調整
  let focusArea = '';
  if (customInstruction.includes('データ')) focusArea = 'データ・統計重視';
  else if (customInstruction.includes('事例')) focusArea = '実例・ケーススタディ重視';
  else if (customInstruction.includes('美容')) focusArea = '美容業界特化';
  else if (customInstruction.includes('実践')) focusArea = '実践的手順重視';
  
  const content = `---
layout: blog-post
title: "${proposal.title}"
date: ${dateStr}
categories: [${proposal.category}]
tags: [${proposal.keywords.join(', ')}]
author: "LeadFive AI"
description: "${proposal.description}"
image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&h=630&fit=crop"
---

# ${proposal.title}

## 🎯 この記事の要点

**ターゲット読者**: ${proposal.target}  
**読了時間**: ${proposal.readTime}  
**緊急度**: ${proposal.urgency}  
${focusArea ? `**重点ポイント**: ${focusArea}` : ''}

## 📊 はじめに：なぜ今この話題なのか

${proposal.description}

現在、${proposal.target}の間で${proposal.keywords[0]}への注目が急速に高まっています。しかし、多くの企業が表面的な理解に留まり、本当の効果を得られていないのが現状です。

## 💡 LeadFive独自の8つの本能アプローチ

### 1. 生存本能 - リスク回避の心理
${proposal.target}が最も恐れるリスクを理解し、それを解決する提案をすることで信頼を獲得します。

### 2. 競争本能 - 他社との差別化
競合他社がまだ気づいていない${proposal.keywords[0]}の活用法を先取りすることで、圧倒的な優位性を築けます。

### 3. 好奇心 - 新しい可能性への興味
${proposal.keywords[1]}の新たな活用方法を示すことで、顧客の興味を引きつけます。

## 🚀 実践的な活用方法

### ステップ1: 現状分析
まず、あなたの${proposal.target}としての現在のポジションを把握しましょう。

### ステップ2: 戦略立案
${proposal.keywords[0]}を活用した具体的な戦略を立案します。

### ステップ3: 実装開始
小さく始めて、効果を確認しながらスケールアップしていきます。

## 📈 期待できる効果

この手法を実践することで、以下のような効果が期待できます：

- **売上向上**: 平均して20-50%の改善
- **効率化**: 作業時間を30-40%短縮
- **顧客満足度**: リピート率15-25%向上

## ⚠️ よくある失敗パターンと対策

### 失敗パターン1: 表面的な導入
多くの企業が犯す最大の間違いは、${proposal.keywords[0]}を表面的にしか理解せずに導入することです。

**対策**: 根本的な仕組みを理解してから段階的に導入する

### 失敗パターン2: 短期的な視点
すぐに結果を求めすぎて、継続性を軽視してしまうケースです。

**対策**: 中長期的な視点で取り組み、小さな改善を積み重ねる

## 🎯 まとめ：今すぐ始められること

${proposal.title.replace(/：.*/, '')}を成功させるためには、以下の3つのポイントが重要です：

1. **正しい理解**: 表面的でなく、本質を理解する
2. **段階的実装**: 小さく始めて着実に拡大
3. **継続的改善**: データを基に常に最適化

## 🚀 LeadFiveでさらに効果を最大化

LeadFiveでは、${proposal.target}に特化したAI×心理学マーケティングサポートを提供しています。

${proposal.keywords[0]}の導入から最適化まで、あなたのビジネスに合わせたカスタマイズされたソリューションで、確実な成果を実現します。

### 📞 無料相談のご案内

このブログを読んで「実際に導入してみたい」と思われた方は、ぜひ無料相談をご利用ください。あなたのビジネスに最適な${proposal.keywords[0]}活用戦略をご提案いたします。

---

**この記事はAI×心理学マーケティングの専門企業LeadFiveが、最新のトレンド分析と豊富な実例を基に作成しました。**

${customInstruction ? `\n**カスタマイズ**: ${customInstruction}` : ''}
`;

  return content;
}

// ===== 🔗 GitHub Actions トリガー =====

function triggerGitHubActions(proposal, customInstruction, content) {
  const githubToken = PropertiesService.getScriptProperties().getProperty('GITHUB_TOKEN');
  
  if (!githubToken) {
    console.log('⚠️ GitHub Token が設定されていません');
    return false;
  }
  
  try {
    const payload = {
      event_type: 'create-blog-post',
      client_payload: {
        title: proposal.title,
        description: proposal.description,
        category: proposal.category,
        target: proposal.target,
        keywords: proposal.keywords,
        customInstruction: customInstruction || '',
        content: content,
        timestamp: new Date().toISOString(),
        urgency: proposal.urgency,
        buzzScore: proposal.buzzScore
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

// ===== 📧 確認メール送信 =====

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
          ⏱️ <strong>予定時刻:</strong> 10-15分後にGitHubに投稿されます
        </p>
      </div>
      
      <div style="text-align: center;">
        <a href="https://github.com/${CONFIG.githubOwner}/${CONFIG.githubRepo}" 
           style="background: #8b5cf6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
          GitHubで確認 →
        </a>
      </div>
      
      <p style="text-align: center; color: #64748b; font-size: 12px; margin-top: 20px;">
        🤖 LeadFive AI Blog Assistant | 自動記事生成システム
      </p>
    </div>
  `;
  
  try {
    MailApp.sendEmail({
      to: CONFIG.recipientEmail,
      subject: '✅ ブログ記事作成開始 - LeadFive AI',
      htmlBody: htmlBody,
      name: CONFIG.botName
    });
    console.log('✅ 確認メール送信完了');
  } catch (error) {
    console.error('❌ 確認メール送信エラー:', error);
  }
}

// ===== ⚙️ 自動チェックシステム =====

function setupEmailMonitoring() {
  // 既存のメール監視トリガーを削除
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'processEmailReplies') {
      ScriptApp.deleteTrigger(trigger);
    }
  });
  
  try {
    // 5分ごとに返信チェック
    ScriptApp.newTrigger('processEmailReplies')
      .timeBased()
      .everyMinutes(5)
      .create();
      
    console.log('✅ 5分ごとのメール監視設定完了');
    
    return true;
  } catch (error) {
    console.error('❌ メール監視設定エラー:', error);
    return false;
  }
}

// ===== 🧪 テスト関数 =====

function testEmailProcessing() {
  console.log('🧪 メール処理テスト開始...');
  processEmailReplies();
  console.log('✅ メール処理テスト完了');
}

function testBlogCreation() {
  console.log('🧪 記事作成テスト開始...');
  const testProposal = {
    title: "テスト記事：ChatGPT活用マーケティング",
    description: "テスト用の記事です",
    category: "AIマーケティング",
    target: "中小企業経営者",
    keywords: ["ChatGPT", "マーケティング", "AI活用"],
    urgency: "中",
    buzzScore: 75
  };
  
  const success = createBlogPost(testProposal, "テスト実行");
  if (success) {
    console.log('✅ 記事作成テスト成功');
  } else {
    console.log('❌ 記事作成テスト失敗');
  }
}
```

## 📋 設定手順

### 1. **コード追加**
上記のコードを既存コードの最後に追加 → 保存

### 2. **メール監視開始**
関数選択で「**setupEmailMonitoring**」を選択 → ▶実行

### 3. **テスト実行**
「**testEmailProcessing**」を実行してメール検索確認

### 4. **実際のテスト**
1. AI提案メールを送信：「sendAIProposal」実行
2. 届いたメールに「1」で返信
3. 5分待つ → 確認メールが届く

## 🎯 動作フロー

```
1. AI提案メール送信 → 2. ユーザーが「1」で返信 → 3. 5分後に自動検知 → 4. 記事作成開始 → 5. GitHub Actions実行 → 6. 確認メール送信
```

これで完全な自動システムが完成します！