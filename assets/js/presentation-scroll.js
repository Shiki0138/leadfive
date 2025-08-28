/**
 * プレゼンテーション風スクロール制御JavaScript
 * フルスクリーンセクション間のスムーススクロールとアニメーション
 */

class PresentationScroll {
  constructor() {
    this.sections = [];
    this.currentSection = 0;
    this.isScrolling = false;
    this.touchStartY = 0;
    this.touchEndY = 0;
    
    this.init();
  }

  init() {
    this.setupSections();
    this.createSectionNavigation();
    this.bindEvents();
    this.startIntersectionObserver();
    this.preloadVideo();
    
    // 初期状態で最初のセクションをアクティブに
    setTimeout(() => {
      this.updateActiveSection(0);
    }, 100);
  }

  setupSections() {
    // 全セクションを取得してフルスクリーンクラスを追加
    const sectionSelectors = [
      '.hero-section',
      '.problem-section',
      '.philosophy-section',
      '.services-section',
      '.case-studies-section',
      '.why-now-section',
      '.belief-section',
      '.final-cta-section',
      '.access-section'
    ];

    sectionSelectors.forEach((selector, index) => {
      const section = document.querySelector(selector);
      if (section) {
        section.classList.add('fullscreen-section');
        section.dataset.sectionIndex = index;
        this.sections.push(section);
      }
    });

    console.log(`Initialized ${this.sections.length} presentation sections`);
  }

  createSectionNavigation() {
    // セクションナビゲーションドットを作成
    const nav = document.createElement('div');
    nav.className = 'section-nav';
    nav.setAttribute('aria-label', 'Section Navigation');

    this.sections.forEach((section, index) => {
      const dot = document.createElement('button');
      dot.className = 'section-nav-dot';
      dot.dataset.sectionIndex = index;
      dot.setAttribute('aria-label', `Go to section ${index + 1}`);
      
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        this.scrollToSection(index);
      });

      nav.appendChild(dot);
    });

    document.body.appendChild(nav);
    this.navDots = nav.querySelectorAll('.section-nav-dot');
  }

  bindEvents() {
    // ホイールスクロールイベント
    document.addEventListener('wheel', this.handleWheel.bind(this), { passive: false });
    
    // キーボードナビゲーション
    document.addEventListener('keydown', this.handleKeyboard.bind(this));
    
    // タッチイベント（モバイル）
    document.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
    document.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });
    
    // リサイズイベント
    window.addEventListener('resize', this.handleResize.bind(this));
    
    // ブラウザの戻る/進むボタン対応
    window.addEventListener('popstate', this.handlePopState.bind(this));
  }

  handleWheel(e) {
    e.preventDefault();
    
    if (this.isScrolling) return;
    
    const delta = e.deltaY;
    const threshold = 50;
    
    if (Math.abs(delta) < threshold) return;
    
    if (delta > 0 && this.currentSection < this.sections.length - 1) {
      // 下へスクロール
      this.scrollToSection(this.currentSection + 1);
    } else if (delta < 0 && this.currentSection > 0) {
      // 上へスクロール
      this.scrollToSection(this.currentSection - 1);
    }
  }

  handleKeyboard(e) {
    if (this.isScrolling) return;
    
    switch(e.key) {
      case 'ArrowDown':
      case ' ':
        e.preventDefault();
        if (this.currentSection < this.sections.length - 1) {
          this.scrollToSection(this.currentSection + 1);
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (this.currentSection > 0) {
          this.scrollToSection(this.currentSection - 1);
        }
        break;
      case 'Home':
        e.preventDefault();
        this.scrollToSection(0);
        break;
      case 'End':
        e.preventDefault();
        this.scrollToSection(this.sections.length - 1);
        break;
    }
  }

  handleTouchStart(e) {
    this.touchStartY = e.touches[0].clientY;
  }

  handleTouchEnd(e) {
    if (this.isScrolling) return;
    
    this.touchEndY = e.changedTouches[0].clientY;
    const diff = this.touchStartY - this.touchEndY;
    const threshold = 50;
    
    if (Math.abs(diff) < threshold) return;
    
    if (diff > 0 && this.currentSection < this.sections.length - 1) {
      // 上へスワイプ（次のセクション）
      this.scrollToSection(this.currentSection + 1);
    } else if (diff < 0 && this.currentSection > 0) {
      // 下へスワイプ（前のセクション）
      this.scrollToSection(this.currentSection - 1);
    }
  }

  handleResize() {
    // リサイズ時に現在のセクションに再調整
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => {
      this.scrollToSection(this.currentSection, false);
    }, 250);
  }

  handlePopState() {
    // ブラウザの戻る/進むボタンでの履歴変更に対応
    const hash = window.location.hash;
    if (hash) {
      const sectionId = hash.substring(1);
      const section = document.getElementById(sectionId);
      if (section) {
        const index = this.sections.indexOf(section);
        if (index !== -1) {
          this.scrollToSection(index, false);
        }
      }
    }
  }

  scrollToSection(index, updateHistory = true) {
    if (index < 0 || index >= this.sections.length || this.isScrolling) return;
    
    this.isScrolling = true;
    const targetSection = this.sections[index];
    
    // スムーススクロール実行
    targetSection.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
    
    // アニメーションとナビゲーション更新
    this.updateActiveSection(index);
    
    // 履歴更新
    if (updateHistory && targetSection.id) {
      history.pushState(null, '', `#${targetSection.id}`);
    }
    
    // スクロール完了後の処理
    setTimeout(() => {
      this.isScrolling = false;
      this.triggerSectionAnimations(targetSection);
    }, 1000);
    
    this.currentSection = index;
  }

  updateActiveSection(index) {
    // ナビゲーションドットの更新
    this.navDots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
    
    // セクションのアクティブ状態更新
    this.sections.forEach((section, i) => {
      section.classList.toggle('active', i === index);
      if (i === index) {
        section.classList.add('visible');
      }
    });
  }

  triggerSectionAnimations(section) {
    // セクション内の要素にアニメーションクラスを追加
    const animatedElements = section.querySelectorAll('.service-card, .case-study-card, .instinct-card, .problem-card, .belief-card');
    
    animatedElements.forEach((element, index) => {
      setTimeout(() => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        requestAnimationFrame(() => {
          element.style.opacity = '1';
          element.style.transform = 'translateY(0)';
        });
      }, index * 100);
    });
  }

  startIntersectionObserver() {
    // Intersection Observerでセクションの表示状態を監視
    const options = {
      root: null,
      rootMargin: '-20% 0px -20% 0px',
      threshold: 0.3
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = parseInt(entry.target.dataset.sectionIndex);
          if (!this.isScrolling && index !== this.currentSection) {
            this.updateActiveSection(index);
            this.currentSection = index;
          }
          entry.target.classList.add('visible');
        }
      });
    }, options);

    this.sections.forEach(section => {
      this.observer.observe(section);
    });
  }

  preloadVideo() {
    // 動画の事前読み込み
    const video = document.querySelector('.video-background video');
    if (video) {
      video.addEventListener('loadeddata', () => {
        console.log('Background video loaded successfully');
      });
      
      video.addEventListener('error', (e) => {
        console.error('Background video failed to load:', e);
        // 動画読み込み失敗時の代替処理
        document.querySelector('.video-background')?.remove();
      });
    }
  }

  // 公開メソッド: 外部から特定セクションへジャンプ
  goToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
      const index = this.sections.indexOf(section);
      if (index !== -1) {
        this.scrollToSection(index);
      }
    }
  }

  // 公開メソッド: 次のセクションへ
  nextSection() {
    if (this.currentSection < this.sections.length - 1) {
      this.scrollToSection(this.currentSection + 1);
    }
  }

  // 公開メソッド: 前のセクションへ
  previousSection() {
    if (this.currentSection > 0) {
      this.scrollToSection(this.currentSection - 1);
    }
  }
}

// グローバル関数として公開
window.scrollToSection = function(sectionId) {
  if (window.presentationScroll) {
    window.presentationScroll.goToSection(sectionId);
  }
};

// DOM読み込み完了後に初期化
document.addEventListener('DOMContentLoaded', () => {
  // プレゼンテーション機能を初期化
  window.presentationScroll = new PresentationScroll();
  
  // 動画背景を追加
  addVideoBackground();
  
  console.log('Presentation scroll system initialized');
});

function addVideoBackground() {
  // 動画背景要素を作成
  const videoContainer = document.createElement('div');
  videoContainer.className = 'video-background';
  
  const video = document.createElement('video');
  video.autoplay = true;
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.preload = 'auto';
  
  // 動画ソースを追加
  const source = document.createElement('source');
  source.src = '/assets/videos/hero-background.mp4';
  source.type = 'video/mp4';
  
  video.appendChild(source);
  
  // 動画読み込みエラー時の処理
  video.onerror = () => {
    console.warn('Background video not found, using fallback');
    videoContainer.remove();
  };
  
  videoContainer.appendChild(video);
  
  // オーバーレイを作成
  const overlay = document.createElement('div');
  overlay.className = 'video-overlay';
  
  // bodyの最初に挿入
  document.body.insertBefore(overlay, document.body.firstChild);
  document.body.insertBefore(videoContainer, document.body.firstChild);
  
  // 動画の自動再生を確実にする
  video.addEventListener('loadedmetadata', () => {
    video.play().catch(e => {
      console.warn('Video autoplay failed:', e);
    });
  });
}