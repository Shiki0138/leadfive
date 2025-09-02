/**
 * GSAP Animation System for LeadFive Website
 * 最先端のアニメーションでユーザー体験を劇的に向上
 */

// GSAPプラグインの登録
gsap.registerPlugin(ScrollTrigger, TextPlugin, MotionPathPlugin);

class GSAPAnimationSystem {
  constructor() {
    this.timeline = gsap.timeline();
    this.heroTimeline = gsap.timeline({ paused: true });
    this.init();
  }

  init() {
    // ページ読み込み完了後にアニメーション開始
    window.addEventListener('load', () => {
      this.setupHeroAnimations();
      this.setupScrollAnimations();
      this.setupTextAnimations();
      this.setupParallaxEffects();
      this.setupMorphAnimations();
      this.setupInteractiveElements();
      this.setupVideoEnhancements();
    });

    // リサイズ時の調整
    window.addEventListener('resize', () => {
      ScrollTrigger.refresh();
    });
  }

  // 1. ヒーローセクションの壮大な入場アニメーション
  setupHeroAnimations() {
    const hero = document.querySelector('.hero-section');
    if (!hero) return;

    // タイムライン形式で複数のアニメーションを連動
    const tl = gsap.timeline({
      defaults: { ease: "power3.out" }
    });

    // 背景の動画を徐々に表示
    tl.from('.video-background video', {
      scale: 1.3,
      opacity: 0,
      duration: 2.5,
      ease: "power2.inOut"
    })
    
    // タイトルを一文字ずつ出現
    .from('.hero-title', {
      opacity: 0,
      y: 100,
      duration: 1.2,
      ease: "back.out(1.7)"
    }, "-=1.8")
    
    // グラデーションテキストに波打つ効果
    .to('.gradient-text', {
      backgroundPosition: "200% center",
      duration: 3,
      ease: "none",
      repeat: -1
    }, "-=1")
    
    // サブタイトルをフェードイン
    .from('.hero-subtitle', {
      opacity: 0,
      y: 30,
      duration: 1,
      stagger: 0.1
    }, "-=0.8")
    
    // CTAボタンを弾むように表示
    .from('.hero-cta .btn', {
      scale: 0,
      rotation: 180,
      duration: 0.8,
      ease: "elastic.out(1, 0.5)",
      stagger: 0.2
    }, "-=0.5")
    
    // 成功プレビューを滑らかにスライドイン
    .from('.success-preview', {
      xPercent: 100,
      opacity: 0,
      duration: 1,
      ease: "power4.out"
    }, "-=0.3")
    
    // メトリクス数値をカウントアップ
    .add(() => {
      this.animateMetrics();
    }, "-=0.5");

    // キャンバスのニューラルネットワークも動的に
    this.enhanceNeuralNetwork();
  }

  // 2. スクロールトリガーアニメーション
  setupScrollAnimations() {
    // 各セクションに異なるアニメーション効果
    const sections = [
      { selector: '.problem-section', animation: 'slideUp' },
      { selector: '.philosophy-section', animation: 'fadeScale' },
      { selector: '.services-section', animation: 'stagger3D' },
      { selector: '.case-studies-section', animation: 'flipIn' },
      { selector: '.why-now-section', animation: 'rotateIn' },
      { selector: '.belief-section', animation: 'expandIn' },
      { selector: '.final-cta-section', animation: 'bounceIn' }
    ];

    sections.forEach(({ selector, animation }) => {
      const element = document.querySelector(selector);
      if (!element) return;

      this.createScrollAnimation(element, animation);
    });
  }

  createScrollAnimation(element, type) {
    const animations = {
      slideUp: {
        from: { y: 100, opacity: 0 },
        to: { y: 0, opacity: 1, duration: 1.2 }
      },
      fadeScale: {
        from: { scale: 0.8, opacity: 0 },
        to: { scale: 1, opacity: 1, duration: 1.5 }
      },
      stagger3D: {
        from: { z: -200, rotationY: 45, opacity: 0 },
        to: { z: 0, rotationY: 0, opacity: 1, duration: 1, stagger: 0.2 }
      },
      flipIn: {
        from: { rotationX: 90, opacity: 0 },
        to: { rotationX: 0, opacity: 1, duration: 1.3 }
      },
      rotateIn: {
        from: { rotation: 360, scale: 0, opacity: 0 },
        to: { rotation: 0, scale: 1, opacity: 1, duration: 1.5 }
      },
      expandIn: {
        from: { scaleX: 0, transformOrigin: "center" },
        to: { scaleX: 1, duration: 1.2, ease: "power4.out" }
      },
      bounceIn: {
        from: { y: -100, opacity: 0 },
        to: { y: 0, opacity: 1, duration: 1, ease: "bounce.out" }
      }
    };

    const config = animations[type];
    if (!config) return;

    ScrollTrigger.create({
      trigger: element,
      start: "top 80%",
      onEnter: () => {
        if (type === 'stagger3D') {
          gsap.fromTo(element.querySelectorAll('.service-card'), config.from, config.to);
        } else {
          gsap.fromTo(element, config.from, config.to);
        }
      },
      once: true
    });
  }

  // 3. テキストリビールアニメーション
  setupTextAnimations() {
    // セクションタイトルを単語ごとに表示
    gsap.utils.toArray('.section-title').forEach(title => {
      const words = title.textContent.split(' ');
      title.innerHTML = words.map(word => 
        `<span class="word-wrap"><span class="word">${word}</span></span>`
      ).join(' ');

      ScrollTrigger.create({
        trigger: title,
        start: "top 80%",
        onEnter: () => {
          gsap.from(title.querySelectorAll('.word'), {
            y: 100,
            opacity: 0,
            rotationX: -90,
            duration: 1,
            stagger: 0.1,
            ease: "power3.out"
          });
        },
        once: true
      });
    });

    // タイプライター効果
    this.setupTypewriterEffect();
  }

  setupTypewriterEffect() {
    const typewriterElements = document.querySelectorAll('.typewriter');
    typewriterElements.forEach(el => {
      const text = el.textContent;
      el.textContent = '';
      
      ScrollTrigger.create({
        trigger: el,
        start: "top 80%",
        onEnter: () => {
          gsap.to(el, {
            text: text,
            duration: text.length * 0.05,
            ease: "none"
          });
        },
        once: true
      });
    });
  }

  // 4. パララックス効果
  setupParallaxEffects() {
    // 背景要素のパララックス
    gsap.utils.toArray('.parallax-bg').forEach(bg => {
      gsap.to(bg, {
        yPercent: -50,
        ease: "none",
        scrollTrigger: {
          trigger: bg.parentElement,
          scrub: true
        }
      });
    });

    // カード要素の深度パララックス
    gsap.utils.toArray('.glass-card').forEach((card, i) => {
      gsap.to(card, {
        y: () => -50 * (i % 3),
        ease: "none",
        scrollTrigger: {
          trigger: card,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
    });

    // マウス追従パララックス
    this.setupMouseParallax();
  }

  setupMouseParallax() {
    const heroContentEl = document.querySelector('.hero-content');
    const instinctCards = document.querySelectorAll('.instinct-card');
    if (!heroContentEl && instinctCards.length === 0) return;

    document.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;

      if (heroContentEl) {
        gsap.to(heroContentEl, {
          x: x * 20,
          y: y * 20,
          duration: 1,
          ease: "power2.out"
        });
      }

      if (instinctCards.length) {
        gsap.to(instinctCards, {
          x: (i) => x * 10 * (i % 2 ? 1 : -1),
          y: (i) => y * 10 * (i % 2 ? -1 : 1),
          duration: 1.5,
          ease: "power2.out"
        });
      }
    });
  }

  // 5. モーフィングアニメーション
  setupMorphAnimations() {
    // サービスカードのホバーモーフィング
    document.querySelectorAll('.service-card').forEach(card => {
      const tl = gsap.timeline({ paused: true });
      
      tl.to(card, {
        scale: 1.05,
        boxShadow: "0 20px 40px rgba(139, 92, 246, 0.3)",
        duration: 0.3
      })
      .to(card.querySelector('.service-icon'), {
        scale: 1.2,
        rotation: 360,
        duration: 0.6,
        ease: "back.out(1.7)"
      }, 0)
      .to(card.querySelector('h3'), {
        letterSpacing: "0.05em",
        duration: 0.3
      }, 0);

      card.addEventListener('mouseenter', () => tl.play());
      card.addEventListener('mouseleave', () => tl.reverse());
    });

    // 図形のモーフィング
    this.setupShapeMorphing();
  }

  setupShapeMorphing() {
    // Before/After の変形アニメーション
    gsap.utils.toArray('.before-after').forEach(container => {
      ScrollTrigger.create({
        trigger: container,
        start: "top 70%",
        onEnter: () => {
          gsap.from(container.querySelector('.before'), {
            xPercent: -100,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
          });
          
          gsap.from(container.querySelector('.after'), {
            xPercent: 100,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
          });
          
          gsap.from(container.querySelector('.transformation'), {
            scale: 0,
            rotation: 720,
            duration: 1.5,
            ease: "elastic.out(1, 0.5)"
          });
        },
        once: true
      });
    });
  }

  // 6. インタラクティブ要素
  setupInteractiveElements() {
    // ボタンの磁気効果
    document.querySelectorAll('.btn').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        gsap.to(btn, {
          x: x * 0.3,
          y: y * 0.3,
          duration: 0.3
        });
      });
      
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
          x: 0,
          y: 0,
          duration: 0.3
        });
      });

      // クリック時の波紋効果
      btn.addEventListener('click', (e) => {
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        btn.appendChild(ripple);
        
        gsap.fromTo(ripple, {
          scale: 0,
          opacity: 1
        }, {
          scale: 4,
          opacity: 0,
          duration: 0.6,
          onComplete: () => ripple.remove()
        });
      });
    });

    // 未来の手紙の切り替えアニメーション
    this.setupLetterAnimation();
  }

  setupLetterAnimation() {
    window.showLetter = (type) => {
      const actionLetter = document.getElementById('action-letter');
      const waitLetter = document.getElementById('wait-letter');
      
      if (type === 'action') {
        gsap.to(waitLetter, { opacity: 0, display: 'none', duration: 0.3 });
        gsap.fromTo(actionLetter, 
          { opacity: 0, display: 'block', scale: 0.8, rotationY: -180 },
          { opacity: 1, scale: 1, rotationY: 0, duration: 0.8, ease: "back.out(1.7)" }
        );
      } else {
        gsap.to(actionLetter, { opacity: 0, display: 'none', duration: 0.3 });
        gsap.fromTo(waitLetter, 
          { opacity: 0, display: 'block', scale: 0.8, rotationY: 180 },
          { opacity: 1, scale: 1, rotationY: 0, duration: 0.8, ease: "back.out(1.7)" }
        );
      }
    };
  }

  // 7. 動画背景の改善
  setupVideoEnhancements() {
    const video = document.querySelector('.video-background video');
    if (!video) return;

    // スクロール位置に応じて動画の再生速度を変更
    ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        video.playbackRate = 0.5 + self.progress * 1.5;
      }
    });

    // ヒーローセクション表示時は動画を強調
    ScrollTrigger.create({
      trigger: '.hero-section',
      start: "top 50%",
      end: "bottom 50%",
      onEnter: () => gsap.to(video, { opacity: 0.8, duration: 1 }),
      onLeave: () => gsap.to(video, { opacity: 0.3, duration: 1 }),
      onEnterBack: () => gsap.to(video, { opacity: 0.8, duration: 1 }),
      onLeaveBack: () => gsap.to(video, { opacity: 0.3, duration: 1 })
    });
  }

  // メトリクスのカウントアップ
  animateMetrics() {
    gsap.utils.toArray('.metric .value').forEach(el => {
      const endValue = el.textContent;
      const num = parseFloat(endValue);
      const suffix = endValue.replace(/[0-9.]/g, '');
      
      gsap.from(el, {
        textContent: 0,
        duration: 2,
        ease: "power2.out",
        snap: { textContent: suffix.includes('.') ? 0.1 : 1 },
        onUpdate: function() {
          el.textContent = this.targets()[0].textContent + suffix;
        }
      });
    });
  }

  // ニューラルネットワークの強化
  enhanceNeuralNetwork() {
    const canvas = document.querySelector('#neural-network-canvas');
    if (!canvas) return;

    // GSAPでキャンバスの描画をアニメーション化
    gsap.to(canvas, {
      opacity: 0.4,
      duration: 3,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut"
    });
  }
}

// システムの初期化
document.addEventListener('DOMContentLoaded', () => {
  window.gsapAnimations = new GSAPAnimationSystem();
  console.log('GSAP Animation System initialized');
});

// スタイル追加
const gsapAnimStyleEl = document.createElement('style');
gsapAnimStyleEl.textContent = `
  /* Word wrap for text animations */
  .word-wrap {
    display: inline-block;
    overflow: hidden;
  }
  
  .word {
    display: inline-block;
    transform-origin: bottom;
  }
  
  /* Ripple effect */
  .ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.6);
    transform: translate(-50%, -50%);
    pointer-events: none;
  }
  
  /* Button style for ripple */
  .btn {
    position: relative;
    overflow: hidden;
  }
  
  /* 3D perspective for cards */
  .services-grid {
    perspective: 1000px;
  }
  
  .service-card {
    transform-style: preserve-3d;
  }
`;
document.head.appendChild(gsapAnimStyleEl);
