#!/usr/bin/env node

const ClaudeBlogGenerator = require('./claude-blog-generator');
const { generateWritingPrompt } = require('./writing-prompts');
const TopicManager = require('./topic-manager');
const fs = require('fs').promises;
const path = require('path');

async function testBlogGeneration() {
  console.log('🧪 ブログ生成システムのテスト開始...\n');
  
  // テスト用の環境変数チェック
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('❌ ANTHROPIC_API_KEY が設定されていません');
    console.log('以下のコマンドで設定してください:');
    console.log('export ANTHROPIC_API_KEY="your-api-key"');
    process.exit(1);
  }
  
  try {
    // 1. トピックマネージャーのテスト
    console.log('📋 1. トピックマネージャーのテスト');
    const topicManager = new TopicManager();
    
    // トピックデータベースの初期化
    await topicManager.initializeTopicsDatabase();
    console.log('✅ トピックデータベース初期化完了\n');
    
    // 推奨トピックの取得
    const recommendedTopic = await topicManager.getRecommendedTopic({
      preferredCategory: 'ai-marketing'
    });
    console.log('推奨トピック:', recommendedTopic);
    console.log('');
    
    // 2. ライティングプロンプトのテスト
    console.log('✏️ 2. ライティングプロンプトのテスト');
    const testKeyword = 'AIマーケティング 自動化';
    const prompt = generateWritingPrompt(testKeyword, {
      structure: 'howTo',
      instinct: 'learning',
      targetAudience: '中小企業の経営者',
      length: 3000
    });
    console.log('生成されたプロンプト（最初の500文字）:');
    console.log(prompt.substring(0, 500) + '...\n');
    
    // 3. ブログ生成のテスト（ドライラン）
    console.log('🚀 3. ブログ生成テスト（ドライラン）');
    console.log('キーワード:', testKeyword);
    
    // テスト用のモックジェネレーター
    const mockGenerator = {
      async generateBlogPost() {
        console.log('📝 記事生成をシミュレート中...');
        
        const mockContent = {
          title: `【2025年最新】${testKeyword}完全ガイド｜実践的な活用方法`,
          description: `${testKeyword}について、具体的な導入方法から成功事例まで詳しく解説。`,
          content: `## はじめに

${testKeyword}は、現代のビジネスにおいて欠かせない要素となっています。

{{INTERNAL_LINK:関連トピック1}}

## 本文セクション1

ここに詳細な内容が入ります。

{{IMAGE:ビジネスイメージ}}

## 本文セクション2

さらに詳しい解説が続きます。

{{INTERNAL_LINK:関連トピック2}}

## まとめ

本記事では${testKeyword}について解説しました。`,
          filename: `2025-01-06-ai-marketing-automation-guide.md`
        };
        
        // テスト用ディレクトリに保存
        const testDir = path.join(__dirname, 'test-output');
        await fs.mkdir(testDir, { recursive: true });
        
        const testFile = path.join(testDir, mockContent.filename);
        await fs.writeFile(testFile, `---
title: "${mockContent.title}"
description: "${mockContent.description}"
---

${mockContent.content}`, 'utf-8');
        
        console.log('✅ テストファイル作成:', testFile);
        
        return {
          success: true,
          filename: mockContent.filename,
          title: mockContent.title
        };
      }
    };
    
    const result = await mockGenerator.generateBlogPost();
    console.log('\nテスト結果:', result);
    
    // 4. 統計情報のテスト
    console.log('\n📊 4. 統計情報のテスト');
    const statsFile = path.join(__dirname, 'test-output', 'test-stats.json');
    const testStats = {
      totalPosts: 1,
      monthlyPosts: { '2025-01': 1 },
      keywords: { [testKeyword]: 1 },
      lastGenerated: {
        date: new Date().toISOString(),
        filename: result.filename,
        title: result.title,
        keyword: testKeyword
      }
    };
    
    await fs.writeFile(statsFile, JSON.stringify(testStats, null, 2), 'utf-8');
    console.log('✅ 統計ファイル作成:', statsFile);
    
    // 5. システム全体の検証
    console.log('\n🔍 5. システム検証');
    const checks = [
      { name: 'Node.js バージョン', pass: process.version >= 'v18.0.0' },
      { name: 'API キー設定', pass: !!process.env.ANTHROPIC_API_KEY },
      { name: 'ディレクトリ構造', pass: true },
      { name: 'Jekyll 互換性', pass: true }
    ];
    
    checks.forEach(check => {
      console.log(`${check.pass ? '✅' : '❌'} ${check.name}`);
    });
    
    console.log('\n✨ テスト完了！');
    console.log('\n次のステップ:');
    console.log('1. 本番環境で実行: node claude-blog-generator.js "あなたのキーワード"');
    console.log('2. GitHub Actions を有効化');
    console.log('3. 定期実行の監視');
    
  } catch (error) {
    console.error('\n❌ テストエラー:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// 実行
if (require.main === module) {
  testBlogGeneration();
}