// Vercel Serverless Function for Unsplash Background
export default async function handler(req, res) {
  const { keyword = 'technology abstract' } = req.query;
  
  const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || process.env.UNSPLASH_API_KEY;
  
  if (!UNSPLASH_ACCESS_KEY) {
    return res.status(200).json({
      type: 'default',
      imageUrl: null
    });
  }

  try {
    // 高品質な背景画像を検索
    const searchUrl = `https://api.unsplash.com/search/photos`;
    const response = await fetch(searchUrl + '?' + new URLSearchParams({
      query: keyword,
      per_page: 30,
      orientation: 'landscape',
      content_filter: 'high',
      order_by: 'relevant'
    }), {
      headers: {
        'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
      }
    });

    if (!response.ok) {
      throw new Error('Unsplash API error');
    }

    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      // ランダムに画像を選択
      const randomIndex = Math.floor(Math.random() * Math.min(10, data.results.length));
      const photo = data.results[randomIndex];
      
      // 高解像度画像URL
      const imageUrl = photo.urls.full || photo.urls.regular;
      
      // ダウンロードトラッキング（Unsplashガイドライン）
      if (photo.links.download_location) {
        fetch(photo.links.download_location, {
          headers: {
            'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
          }
        }).catch(() => {});
      }

      return res.status(200).json({
        type: 'image',
        imageUrl: imageUrl,
        photographer: photo.user.name,
        photographerUrl: photo.user.links.html,
        description: photo.description || photo.alt_description
      });
    }

    return res.status(200).json({
      type: 'default',
      imageUrl: null
    });

  } catch (error) {
    console.error('Unsplash API error:', error);
    return res.status(200).json({
      type: 'default',
      imageUrl: null
    });
  }
}