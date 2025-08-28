#!/usr/bin/env node

const axios = require('axios');
const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

/**
 * Unsplash APIから関連画像を取得して保存
 */
async function fetchUnsplashImage(keyword, outputPath, options = {}) {
  const UNSPLASH_API_KEY = process.env.UNSPLASH_API_KEY;
  
  if (!UNSPLASH_API_KEY) {
    console.error('❌ UNSPLASH_API_KEY が設定されていません');
    return null;
  }
  
  try {
    // キーワードを英語に変換（拡張マッピング）
    const keywordMap = {
      'AI': ['artificial intelligence', 'AI technology', 'machine learning', 'deep learning', 'neural network'],
      'マーケティング': ['digital marketing', 'marketing strategy', 'social media', 'content marketing', 'branding'],
      '戦略': ['business strategy', 'strategic planning', 'business plan', 'growth strategy', 'innovation'],
      'データ分析': ['data analytics', 'data visualization', 'business intelligence', 'data science', 'analytics dashboard'],
      'デジタル変革': ['digital transformation', 'digitalization', 'digital innovation', 'tech transformation', 'digital disruption'],
      '自動化': ['automation', 'robotic process', 'workflow automation', 'AI automation', 'digital automation'],
      'ツール': ['software tools', 'digital tools', 'productivity apps', 'business software', 'tech stack'],
      '成功事例': ['success story', 'case study', 'business success', 'achievement', 'milestone'],
      'トレンド': ['trends', 'future trends', 'emerging technology', 'innovation trends', 'tech trends'],
      '基礎': ['fundamentals', 'basics', 'foundation', 'introduction', 'beginner guide'],
      '整骨院': ['physiotherapy', 'physical therapy', 'rehabilitation', 'health clinic', 'medical practice'],
      '美容': ['beauty salon', 'cosmetics', 'beauty treatment', 'spa', 'wellness'],
      '飲食店': ['restaurant', 'cafe', 'dining', 'food service', 'hospitality'],
      '集客': ['customer acquisition', 'lead generation', 'marketing campaign', 'customer engagement', 'growth hacking'],
      '効率化': ['efficiency', 'productivity', 'optimization', 'streamline', 'process improvement']
    };
    
    // 視覚的なスタイルバリエーション
    const styleVariations = [
      'modern office', 'minimal workspace', 'technology abstract', 'business meeting',
      'creative workspace', 'digital art', 'futuristic concept', 'professional team',
      'innovation lab', 'startup office', 'corporate environment', 'tech conference',
      'data visualization', 'workflow diagram', 'business graphics', 'digital interface'
    ];
    
    // キーワードから英語検索語を生成（複数の可能性から選択）
    let searchQueries = [];
    let baseQuery = 'business technology'; // デフォルト
    
    // マッチするキーワードをすべて収集
    for (const [jp, enArray] of Object.entries(keywordMap)) {
      if (keyword.includes(jp)) {
        searchQueries.push(...enArray);
      }
    }
    
    // 検索クエリをランダムに選択、またはスタイルバリエーションと組み合わせ
    if (searchQueries.length > 0) {
      const randomQuery = searchQueries[Math.floor(Math.random() * searchQueries.length)];
      const randomStyle = styleVariations[Math.floor(Math.random() * styleVariations.length)];
      
      // 時々スタイルを追加（50%の確率）
      if (Math.random() > 0.5) {
        searchQuery = `${randomQuery} ${randomStyle}`;
      } else {
        searchQuery = randomQuery;
      }
    } else {
      // マッチしない場合は汎用的なビジネス画像
      const randomStyle = styleVariations[Math.floor(Math.random() * styleVariations.length)];
      searchQuery = randomStyle;
    }
    
    // ランダム性を高めるためにページ番号を1〜20からランダムに選択
    const randomPage = Math.floor(Math.random() * 20) + 1;
    
    // タイムスタンプと日付を組み合わせてさらにランダム化
    const timestamp = Date.now();
    const dateHash = new Date().getDate() + new Date().getMonth();
    
    // Unsplash APIで画像検索
    const searchUrl = `https://api.unsplash.com/search/photos`;
    
    // 色のバリエーションを追加（時々特定の色を指定）
    const colorOptions = ['black_and_white', 'black', 'white', 'yellow', 'orange', 'red', 'purple', 'magenta', 'green', 'teal', 'blue'];
    const useColor = Math.random() > 0.7; // 30%の確率で色指定
    
    const searchParams = {
      query: searchQuery,
      per_page: 30,
      page: randomPage,
      orientation: 'landscape',
      content_filter: 'high',
      order_by: (timestamp + dateHash) % 3 === 0 ? 'relevant' : (timestamp + dateHash) % 3 === 1 ? 'latest' : 'popular'
    };
    
    // 時々色を指定してバリエーションを増やす
    if (useColor) {
      searchParams.color = colorOptions[Math.floor(Math.random() * colorOptions.length)];
    }
    
    const response = await axios.get(searchUrl, {
      params: searchParams,
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
    
    // より良いランダム選択（完全ランダム）
    const photos = response.data.results;
    
    // 画像を品質でフィルタリング（いいね数が多いもの）
    const qualityPhotos = photos.filter(p => p.likes > 10).length > 5 
      ? photos.filter(p => p.likes > 10) 
      : photos;
    
    // 直近使用の除外リスト
    const excludeSet = new Set(options.excludePhotoIds || []);

    // 除外を考慮して選択
    let candidatePool = qualityPhotos.filter(p => !excludeSet.has(p.id));
    if (candidatePool.length === 0) {
      candidatePool = qualityPhotos; // すべて除外される場合はプール全体から
    }
    const randomIndex = Math.floor(Math.random() * candidatePool.length);
    const photo = candidatePool[randomIndex];
    
    console.log(`🔍 検索クエリ: ${searchQuery}`);
    console.log(`📸 選択された画像: ${photo.description || photo.alt_description || 'No description'}`);
    console.log(`👤 撮影者: ${photo.user.name}`);
    console.log(`💙 いいね数: ${photo.likes}`);
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
      description: photo.description || photo.alt_description,
      photo_id: photo.id,
      search_query: searchQuery,
      selected_at: new Date().toISOString()
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
