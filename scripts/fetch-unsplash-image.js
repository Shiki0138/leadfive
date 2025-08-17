#!/usr/bin/env node

const axios = require('axios');
const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

/**
 * Unsplash APIから関連画像を取得して保存
 */
async function fetchUnsplashImage(keyword, outputPath) {
  const UNSPLASH_API_KEY = process.env.UNSPLASH_API_KEY;
  
  if (!UNSPLASH_API_KEY) {
    console.error('❌ UNSPLASH_API_KEY が設定されていません');
    return null;
  }
  
  try {
    // キーワードを英語に変換（簡易マッピング）
    const keywordMap = {
      'AI': 'artificial intelligence technology',
      'マーケティング': 'digital marketing',
      '戦略': 'business strategy',
      'データ分析': 'data analytics visualization',
      'デジタル変革': 'digital transformation',
      '自動化': 'automation technology',
      'ツール': 'software tools',
      '成功事例': 'success business',
      'トレンド': 'trends future',
      '基礎': 'fundamentals learning'
    };
    
    // キーワードから英語検索語を生成
    let searchQuery = keyword;
    for (const [jp, en] of Object.entries(keywordMap)) {
      if (keyword.includes(jp)) {
        searchQuery = en;
        break;
      }
    }
    
    // ランダム性を高めるためにページ番号を1〜10からランダムに選択
    const randomPage = Math.floor(Math.random() * 10) + 1;
    
    // タイムスタンプを追加してさらにランダム化
    const timestamp = Date.now();
    
    // Unsplash APIで画像検索
    const searchUrl = `https://api.unsplash.com/search/photos`;
    const response = await axios.get(searchUrl, {
      params: {
        query: searchQuery,
        per_page: 30,
        page: randomPage,
        orientation: 'landscape',
        content_filter: 'high',
        order_by: timestamp % 2 === 0 ? 'relevant' : 'latest' // 時刻に応じて並び順を変更
      },
      headers: {
        'Authorization': `Client-ID ${UNSPLASH_API_KEY}`
      }
    });
    
    if (response.data.results.length === 0) {
      console.log('⚠️ 画像が見つかりません。デフォルト検索を使用します。');
      // フォールバック検索
      const fallbackResponse = await axios.get(searchUrl, {
        params: {
          query: 'technology business',
          per_page: 30,
          page: 1,
          orientation: 'landscape'
        },
        headers: {
          'Authorization': `Client-ID ${UNSPLASH_API_KEY}`
        }
      });
      response.data = fallbackResponse.data;
    }
    
    // ランダムに画像を選択
    const randomIndex = Math.floor(Math.random() * response.data.results.length);
    const photo = response.data.results[randomIndex];
    
    console.log(`📸 選択された画像: ${photo.description || photo.alt_description || 'No description'}`);
    console.log(`👤 撮影者: ${photo.user.name}`);
    console.log(`🔗 Unsplash URL: ${photo.links.html}`);
    
    // 画像をダウンロード
    const imageUrl = photo.urls.regular || photo.urls.full;
    const imageResponse = await axios.get(imageUrl, {
      responseType: 'arraybuffer'
    });
    
    // 画像を処理（サイズ調整、最適化）
    const processedImage = await sharp(Buffer.from(imageResponse.data))
      .resize(1200, 630, { 
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ 
        quality: 85,
        progressive: true 
      })
      .toBuffer();
    
    // ディレクトリ作成
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    
    // 画像を保存
    await fs.writeFile(outputPath, processedImage);
    
    // 画像情報を保存（クレジット表示用）
    const creditInfo = {
      photographer: photo.user.name,
      photographer_url: photo.user.links.html,
      unsplash_url: photo.links.html,
      download_location: photo.links.download_location,
      description: photo.description || photo.alt_description
    };
    
    const creditPath = outputPath.replace(/\.(jpg|jpeg|png)$/, '-credit.json');
    await fs.writeFile(creditPath, JSON.stringify(creditInfo, null, 2));
    
    // Unsplash APIガイドラインに従ってダウンロードを記録
    await axios.get(photo.links.download_location, {
      headers: {
        'Authorization': `Client-ID ${UNSPLASH_API_KEY}`
      }
    });
    
    console.log(`✅ 画像を保存しました: ${outputPath}`);
    return {
      path: outputPath,
      credit: creditInfo
    };
    
  } catch (error) {
    console.error('❌ Unsplash API エラー:', error.message);
    if (error.response) {
      console.error('レスポンス:', error.response.data);
    }
    return null;
  }
}

// コマンドライン実行
if (require.main === module) {
  const keyword = process.argv[2] || 'technology';
  const outputPath = process.argv[3] || path.join(__dirname, '../assets/images/blog', `${new Date().toISOString().split('T')[0]}-unsplash.jpg`);
  
  fetchUnsplashImage(keyword, outputPath)
    .then(result => {
      if (result) {
        console.log('画像情報:', result);
      }
    })
    .catch(console.error);
}

module.exports = { fetchUnsplashImage };