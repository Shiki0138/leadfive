// Hero Background with Unsplash API Integration
class HeroBackground {
  constructor() {
    this.container = document.querySelector('.hero-background');
    this.canvas = document.getElementById('neural-network-canvas');
    this.backgroundType = 'hybrid'; // 'image', 'video', 'canvas', 'hybrid'
    this.unsplashKeywords = ['technology abstract', 'ai futuristic', 'digital network', 'data visualization', 'cyber space'];
    this.init();
  }

  async init() {
    // LocalStorageから背景データを取得
    const cachedBackground = this.getCachedBackground();
    
    if (cachedBackground && this.isCacheValid(cachedBackground.timestamp)) {
      this.applyBackground(cachedBackground.data);
    } else {
      // 新しい背景を取得
      await this.fetchNewBackground();
    }

    // Canvas animation as overlay
    if (this.backgroundType === 'hybrid' || this.backgroundType === 'canvas') {
      this.initCanvasAnimation();
    }
  }

  async fetchNewBackground() {
    try {
      // GitHub Pages用の静的実装
      if (window.location.hostname.includes('github.io') || window.location.hostname.includes('leadfive138.com')) {
        this.applyStaticBackground();
        return;
      }
      
      const keyword = this.unsplashKeywords[Math.floor(Math.random() * this.unsplashKeywords.length)];
      const response = await fetch(`/api/unsplash-background?keyword=${encodeURIComponent(keyword)}`);
      
      if (response.ok) {
        const data = await response.json();
        this.applyBackground(data);
        this.cacheBackground(data);
      } else {
        // フォールバック: デフォルトの背景
        this.applyDefaultBackground();
      }
    } catch (error) {
      console.error('Background fetch error:', error);
      this.applyDefaultBackground();
    }
  }
  
  applyStaticBackground() {
    // 事前に選定した高品質な背景画像
    const backgroundImages = [
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=2400&h=1600&fit=crop', // 深海デジタル
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=2400&h=1600&fit=crop', // テクノロジー回路
      'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=2400&h=1600&fit=crop', // AI脳
      'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=2400&h=1600&fit=crop', // ニューラルネットワーク
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=2400&h=1600&fit=crop', // サイバーグリッド
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=2400&h=1600&fit=crop', // デジタルマトリックス
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=2400&h=1600&fit=crop'  // 抽象テクノロジー
    ];
    
    // 日付ベースでランダムに選択（毎日異なる画像）
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    const imageIndex = dayOfYear % backgroundImages.length;
    
    this.applyImageBackground(backgroundImages[imageIndex]);
  }

  applyBackground(data) {
    if (data.type === 'video' && data.videoUrl) {
      this.applyVideoBackground(data.videoUrl);
    } else if (data.imageUrl) {
      this.applyImageBackground(data.imageUrl);
    }
  }

  applyImageBackground(imageUrl) {
    const imageElement = document.createElement('div');
    imageElement.className = 'hero-background-image';
    imageElement.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: url('${imageUrl}');
      background-size: cover;
      background-position: center;
      opacity: 0;
      transition: opacity 2s ease-in-out;
      filter: brightness(0.3) blur(2px);
      z-index: 1;
    `;
    
    this.container.appendChild(imageElement);
    
    // フェードイン効果
    setTimeout(() => {
      imageElement.style.opacity = '0.4';
    }, 100);

    // パララックス効果
    this.addParallaxEffect(imageElement);
  }

  applyVideoBackground(videoUrl) {
    const videoElement = document.createElement('video');
    videoElement.className = 'hero-background-video';
    videoElement.autoplay = true;
    videoElement.loop = true;
    videoElement.muted = true;
    videoElement.playsInline = true;
    
    videoElement.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      min-width: 100%;
      min-height: 100%;
      width: auto;
      height: auto;
      transform: translate(-50%, -50%);
      opacity: 0.3;
      filter: brightness(0.5) blur(1px);
      z-index: 1;
    `;
    
    videoElement.src = videoUrl;
    this.container.appendChild(videoElement);
  }

  applyDefaultBackground() {
    // グラデーション背景
    const gradientElement = document.createElement('div');
    gradientElement.className = 'hero-background-gradient';
    gradientElement.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
                  radial-gradient(circle at 80% 80%, rgba(236, 72, 153, 0.1) 0%, transparent 50%),
                  radial-gradient(circle at 40% 20%, rgba(59, 130, 246, 0.05) 0%, transparent 50%);
      opacity: 0.6;
      z-index: 1;
    `;
    
    this.container.appendChild(gradientElement);
  }

  addParallaxEffect(element) {
    let ticking = false;
    
    const updateParallax = () => {
      const scrolled = window.pageYOffset;
      const parallaxSpeed = 0.5;
      const yPos = -(scrolled * parallaxSpeed);
      
      element.style.transform = `translateY(${yPos}px)`;
      ticking = false;
    };
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    });
  }

  initCanvasAnimation() {
    // 既存のニューラルネットワークアニメーションを透明度を下げて表示
    this.canvas.style.opacity = '0.3';
    this.canvas.style.zIndex = '2';
    
    // 既存のアニメーション初期化コードを呼び出す
    if (typeof initNeuralNetwork === 'function') {
      initNeuralNetwork();
    }
  }

  getCachedBackground() {
    try {
      const cached = localStorage.getItem('heroBackground');
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      return null;
    }
  }

  cacheBackground(data) {
    try {
      localStorage.setItem('heroBackground', JSON.stringify({
        data: data,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error('Cache error:', error);
    }
  }

  isCacheValid(timestamp) {
    const oneDay = 24 * 60 * 60 * 1000;
    return (Date.now() - timestamp) < oneDay;
  }

  // 動的な背景エフェクト
  addDynamicEffects() {
    // グロー効果
    const glowElement = document.createElement('div');
    glowElement.className = 'hero-glow-effect';
    glowElement.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      width: 600px;
      height: 600px;
      transform: translate(-50%, -50%);
      background: radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%);
      animation: glow-pulse 4s ease-in-out infinite;
      z-index: 3;
      pointer-events: none;
    `;
    
    this.container.appendChild(glowElement);
  }
}

// ページ読み込み時に初期化
document.addEventListener('DOMContentLoaded', () => {
  new HeroBackground();
});

// CSS アニメーション
const style = document.createElement('style');
style.textContent = `
  @keyframes glow-pulse {
    0%, 100% { 
      opacity: 0.3;
      transform: translate(-50%, -50%) scale(1);
    }
    50% { 
      opacity: 0.6;
      transform: translate(-50%, -50%) scale(1.1);
    }
  }
  
  .hero-background {
    position: relative;
    overflow: hidden;
  }
  
  .hero-background-image,
  .hero-background-video {
    will-change: transform;
  }
`;
document.head.appendChild(style);