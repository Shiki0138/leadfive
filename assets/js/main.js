// Neural Network Canvas Animation with Performance Optimization
function initNeuralNetworkCanvas() {
  const canvas = document.getElementById('neural-network-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const container = canvas.parentElement;
  
  // Responsive canvas sizing
  function resizeCanvas() {
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    // Recreate nodes on resize
    createNodes();
  }
  
  const nodes = [];
  let nodeCount = 40; // Reduced for better performance
  
  // Dynamic node count based on screen size
  function createNodes() {
    nodes.length = 0;
    nodeCount = window.innerWidth < 768 ? 20 : 40; // Fewer nodes on mobile
    
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.3
      });
    }
  }
  
  // Performance optimization with throttling
  let animationId;
  let lastTime = 0;
  const fps = 30; // Target FPS for better performance
  const fpsInterval = 1000 / fps;
  
  function animate(currentTime) {
    animationId = requestAnimationFrame(animate);
    
    // Throttle animation frame rate
    if (currentTime - lastTime < fpsInterval) return;
    lastTime = currentTime;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update nodes with boundary checking
    nodes.forEach(node => {
      node.x += node.vx;
      node.y += node.vy;
      
      // Bounce off edges
      if (node.x <= 0 || node.x >= canvas.width) {
        node.vx *= -1;
        node.x = Math.max(0, Math.min(canvas.width, node.x));
      }
      if (node.y <= 0 || node.y >= canvas.height) {
        node.vy *= -1;
        node.y = Math.max(0, Math.min(canvas.height, node.y));
      }
    });
    
    // Draw connections with distance optimization
    const maxDistance = window.innerWidth < 768 ? 80 : 120;
    
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const node1 = nodes[i];
        const node2 = nodes[j];
        const dx = node1.x - node2.x;
        const dy = node1.y - node2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < maxDistance) {
          const opacity = (1 - distance / maxDistance) * 0.15;
          ctx.beginPath();
          ctx.moveTo(node1.x, node1.y);
          ctx.lineTo(node2.x, node2.y);
          ctx.strokeStyle = `rgba(139, 92, 246, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    
    // Draw nodes
    nodes.forEach(node => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(139, 92, 246, ${node.opacity})`;
      ctx.fill();
    });
  }
  
  // Initialize canvas and start animation
  resizeCanvas();
  animate(0);
  
  // Throttled resize handler
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resizeCanvas, 100);
  });
  
  // Pause animation when tab is not visible (performance optimization)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    } else {
      if (!animationId) {
        animate(0);
      }
    }
  });
}

// Mobile menu toggle with improved functionality
function initMobileMenu() {
  const toggler = document.querySelector('.navbar-toggler');
  const menu = document.querySelector('.navbar-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  
  if (toggler && menu) {
    toggler.addEventListener('click', (e) => {
      e.stopPropagation();
      menu.classList.toggle('active');
      toggler.classList.toggle('active');
    });
    
    // Close menu when clicking nav links
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('active');
        toggler.classList.remove('active');
      });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!menu.contains(e.target) && !toggler.contains(e.target)) {
        menu.classList.remove('active');
        toggler.classList.remove('active');
      }
    });
  }
}

// Smooth scroll for anchor links
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offset = 80; // Header height
        const targetPosition = target.offsetTop - offset;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// Scroll-based animations
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Observe elements
  document.querySelectorAll('.glass-card, .section-title, .belief-card, .service-card').forEach(el => {
    observer.observe(el);
  });
}

// AI Analysis Modal with fixed functionality
function openAIAnalysis() {
  const modal = document.getElementById('ai-analysis-modal');
  if (modal) {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Add fade-in animation
    setTimeout(() => {
      modal.classList.add('active');
    }, 10);
  }
}

function closeAIAnalysis() {
  const modal = document.getElementById('ai-analysis-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    
    setTimeout(() => {
      modal.style.display = 'none';
    }, 300);
  }
}

// Make functions globally accessible
window.openAIAnalysis = openAIAnalysis;
window.closeAIAnalysis = closeAIAnalysis;

// Contact form modal
function openContactForm() {
  const modal = document.getElementById('contact-modal');
  if (modal) {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Add fade-in animation
    setTimeout(() => {
      modal.classList.add('active');
    }, 10);
  }
}

// Close contact modal
function closeContactModal() {
  const modal = document.getElementById('contact-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    
    setTimeout(() => {
      modal.style.display = 'none';
    }, 300);
  }
}

// Scroll to section
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    const offset = 80;
    const targetPosition = section.offsetTop - offset;
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
    
    // Close mobile menu if open
    const menu = document.querySelector('.navbar-menu');
    const toggler = document.querySelector('.navbar-toggler');
    if (menu && toggler) {
      menu.classList.remove('active');
      toggler.classList.remove('active');
    }
  }
}

// Make functions globally accessible
window.openContactForm = openContactForm;
window.closeContactModal = closeContactModal;
window.scrollToSection = scrollToSection;
window.showLetter = showLetter;

// Future letter functionality with smooth transitions
function showLetter(type) {
  const actionLetter = document.getElementById('action-letter');
  const waitLetter = document.getElementById('wait-letter');
  const buttons = document.querySelectorAll('.choice-btn');
  
  // Update button states
  buttons.forEach(btn => {
    btn.classList.remove('active');
    if (btn.onclick && btn.onclick.toString().includes(type)) {
      btn.classList.add('active');
    }
  });
  
  // Hide all letters first
  [actionLetter, waitLetter].forEach(letter => {
    if (letter) {
      letter.style.opacity = '0';
      letter.style.transform = 'translateY(20px)';
      setTimeout(() => {
        letter.style.display = 'none';
      }, 300);
    }
  });
  
  // Show selected letter after transition
  setTimeout(() => {
    const targetLetter = type === 'action' ? actionLetter : waitLetter;
    if (targetLetter) {
      targetLetter.style.display = 'block';
      // Trigger reflow
      targetLetter.offsetHeight;
      targetLetter.style.opacity = '1';
      targetLetter.style.transform = 'translateY(0)';
    }
  }, 350);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Force scroll to top on page load/refresh
  window.scrollTo(0, 0);
  
  // Also handle history scrollRestoration
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  
  initNeuralNetworkCanvas();
  initMobileMenu();
  initSmoothScroll();
  initScrollAnimations();
  initHeaderScrollEffect();
  initModalFunctionality();
  initLetterInteraction();
});

// Force scroll to top before page unload (for refresh)
window.addEventListener('beforeunload', () => {
  window.scrollTo(0, 0);
});

// Header scroll effect for better UX
function initHeaderScrollEffect() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  
  let lastScrollY = window.scrollY;
  
  const scrollHandler = () => {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > 100) {
      header.style.background = 'rgba(10, 10, 10, 0.95)';
      header.style.backdropFilter = 'blur(15px)';
    } else {
      header.style.background = 'rgba(10, 10, 10, 0.8)';
      header.style.backdropFilter = 'blur(10px)';
    }
    
    // Hide/show header on scroll
    if (currentScrollY > 200) {
      if (currentScrollY > lastScrollY && currentScrollY > 300) {
        header.style.transform = 'translateY(-100%)';
      } else {
        header.style.transform = 'translateY(0)';
      }
    }
    
    lastScrollY = currentScrollY;
  };
  
  // Throttle scroll events
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        scrollHandler();
        ticking = false;
      });
      ticking = true;
    }
  });
}

// Enhanced modal functionality
function initModalFunctionality() {
  const modal = document.getElementById('ai-analysis-modal');
  if (!modal) return;
  
  // Close modal on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeAIAnalysis();
    }
  });
  
  // Close modal on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'block') {
      closeAIAnalysis();
    }
  });
  
  // Handle form submission
  const form = modal.querySelector('.ai-analysis-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Get form data
      const formData = {
        businessType: form.querySelector('#business-type').value,
        monthlyRevenue: form.querySelector('#monthly-revenue').value,
        mainChallenge: form.querySelector('#main-challenge').value,
        email: form.querySelector('#email').value
      };
      
      // AI分析結果を生成（分岐ロジックで実装）
      const analysisResult = generateAIAnalysis(formData);
      
      // Show analysis result
      const modalContent = modal.querySelector('.modal-content');
      modalContent.innerHTML = `
        <span class="close" onclick="closeAIAnalysis()">&times;</span>
        <h2>AI分析結果</h2>
        <div style="margin: 2rem 0;">
          <h3 style="color: #8b5cf6; margin-bottom: 1rem;">${analysisResult.title}</h3>
          <div style="background: rgba(139, 92, 246, 0.1); padding: 1.5rem; border-radius: 10px; margin-bottom: 1.5rem;">
            <p style="margin-bottom: 1rem;"><strong>現状分析：</strong></p>
            <p style="color: #d1d5db; line-height: 1.8;">${analysisResult.analysis}</p>
          </div>
          <div style="background: rgba(59, 130, 246, 0.1); padding: 1.5rem; border-radius: 10px; margin-bottom: 1.5rem;">
            <p style="margin-bottom: 1rem;"><strong>推奨アプローチ：</strong></p>
            <p style="color: #d1d5db; line-height: 1.8;">${analysisResult.recommendation}</p>
          </div>
          <div style="background: rgba(16, 185, 129, 0.1); padding: 1.5rem; border-radius: 10px;">
            <p style="margin-bottom: 1rem;"><strong>期待できる成果：</strong></p>
            <p style="color: #d1d5db; line-height: 1.8;">${analysisResult.expectedResults}</p>
          </div>
        </div>
        <p style="text-align: center; color: #9ca3af; margin-bottom: 1.5rem;">
          より詳細な分析と戦略のご提案をご希望の場合は、<br>
          お気軽にお問い合わせください。
        </p>
        <button class="btn btn-primary btn-large" onclick="window.location.href='/contact/'" style="width: 100%;">
          お問い合わせへ
        </button>
      `;
    });
  }
}

// Initialize letter interaction with proper event handling
function initLetterInteraction() {
  const choiceButtons = document.querySelectorAll('.choice-btn');
  
  choiceButtons.forEach(button => {
    button.addEventListener('click', function() {
      const onclick = this.getAttribute('onclick');
      if (onclick) {
        const match = onclick.match(/showLetter\('([^']+)'\)/);
        if (match) {
          showLetter(match[1]);
        }
      }
    });
  });
  
  // Show first letter by default
  setTimeout(() => {
    showLetter('action');
  }, 500);
}

// Performance monitoring and optimization
function initPerformanceOptimization() {
  // Lazy load images
  const images = document.querySelectorAll('img[data-src]');
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        observer.unobserve(img);
      }
    });
  });
  
  images.forEach(img => imageObserver.observe(img));
  
  // Preload critical resources
  const criticalLinks = [
    'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;600;700;900&display=swap'
  ];
  
  criticalLinks.forEach(href => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = href;
    document.head.appendChild(link);
  });
}

// Touch and gesture support for mobile
function initTouchSupport() {
  let touchStartX = 0;
  let touchStartY = 0;
  
  document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });
  
  document.addEventListener('touchend', (e) => {
    if (!touchStartX || !touchStartY) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;
    
    // Swipe detection for future use
    if (Math.abs(diffX) > Math.abs(diffY)) {
      if (Math.abs(diffX) > 50) {
        if (diffX > 0) {
          // Swipe left
        } else {
          // Swipe right
        }
      }
    }
    
    touchStartX = 0;
    touchStartY = 0;
  }, { passive: true });
}

// AI分析結果生成関数（分岐ロジック）
function generateAIAnalysis(formData) {
  const { businessType, monthlyRevenue, mainChallenge } = formData;
  
  // 業種別の分析
  const industryAnalysis = {
    'ec': {
      title: 'ECサイトの成長戦略',
      focus: '購買心理とAIレコメンド'
    },
    'retail': {
      title: '実店舗のデジタル変革',
      focus: 'O2O戦略と顧客体験'
    },
    'service': {
      title: 'サービス業のLTV向上',
      focus: '顧客満足度とリピート率'
    },
    'btob': {
      title: 'BtoBマーケティングの高度化',
      focus: 'リード質と商談率'
    },
    'beauty': {
      title: '美容サロンのブランディング',
      focus: 'SNS活用と口コミ戦略'
    },
    'consulting': {
      title: 'コンサルティングの差別化',
      focus: '専門性と信頼性'
    },
    'other': {
      title: 'ビジネス成長戦略',
      focus: '業界特性に合わせた最適化'
    }
  };
  
  // 課題別の分析
  const challengeAnalysis = {
    'traffic': {
      problem: '集客チャネルの偏りと広告依存',
      solution: 'AIを活用したオーガニック流入強化',
      result: '広告費削減と質の高いトラフィック獲得'
    },
    'conversion': {
      problem: '訪問者の購買意欲を十分に引き出せていない',
      solution: '8つの本能に基づくLP最適化',
      result: 'CVR 2.5倍以上の向上実績'
    },
    'retention': {
      problem: '顧客のニーズ変化への対応不足',
      solution: 'AIを使ったパーソナライゼーション',
      result: 'リピート率向上とLTV最大化'
    },
    'cost': {
      problem: '競合激化による広告単価の高騰',
      solution: 'AIを活用した効率的なターゲティング',
      result: 'CAC 40%削減とROI改善'
    },
    'analysis': {
      problem: 'データはあるが活用できていない',
      solution: 'AI分析ツールと自動レポート',
      result: '意思決定のスピード化と精度向上'
    },
    'automation': {
      problem: '手作業が多く生産性が低い',
      solution: 'AIを活用した業務自動化',
      result: '作業時間 70%削減とコア業務への集中'
    }
  };
  
  // 売上規模別の分析
  const revenueAnalysis = {
    'under-100': {
      stage: 'スタートアップフェーズ',
      priority: '基盤構築と仕組み化'
    },
    '100-500': {
      stage: '成長初期フェーズ',
      priority: '効率化とスケール準備'
    },
    '500-1000': {
      stage: '急成長フェーズ',
      priority: 'システム化と自動化'
    },
    '1000-5000': {
      stage: '拡大フェーズ',
      priority: '差別化とブランディング'
    },
    'over-5000': {
      stage: '成熟フェーズ',
      priority: '最適化と新規事業'
    }
  };
  
  const industry = industryAnalysis[businessType] || industryAnalysis['other'];
  const challenge = challengeAnalysis[mainChallenge];
  const revenue = revenueAnalysis[monthlyRevenue];
  
  return {
    title: industry.title,
    analysis: `${revenue.stage}にあるあなたのビジネスは、${challenge.problem}という課題に直面しています。この段階では${revenue.priority}が重要ですが、多くの企業がここでつまずいています。`,
    recommendation: `${industry.focus}に特化した${challenge.solution}を実施することをお勧めします。AI×心理学のアプローチにより、競合が真似できない独自の強みを構築できます。`,
    expectedResults: `${challenge.result}が期待できます。実際に弊社が支援した同業界の企業では、6ヶ月で売上2.2倍を達成した事例もあります。`
  };
}

// Service card hover effects
document.addEventListener('DOMContentLoaded', () => {
  const serviceCards = document.querySelectorAll('.service-card');
  
  serviceCards.forEach((card, index) => {
    // Set CSS variables for gradient colors
    const colors = [
      { from: '#8b5cf6', to: '#7c3aed' }, // purple
      { from: '#3b82f6', to: '#2563eb' }, // blue
      { from: '#ec4899', to: '#db2777' }, // pink
      { from: '#06b6d4', to: '#0891b2' }  // cyan
    ];
    
    card.style.setProperty('--service-color-from', colors[index % colors.length].from);
    card.style.setProperty('--service-color-to', colors[index % colors.length].to);
  });
});

// Contact form modal
function openContactForm() {
  const modal = document.getElementById('contact-modal');
  if (modal) {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Add fade-in animation
    setTimeout(() => {
      modal.classList.add('active');
    }, 10);
    
    // Close mobile menu if open
    const menu = document.querySelector('.navbar-menu');
    const toggler = document.querySelector('.navbar-toggler');
    if (menu && toggler) {
      menu.classList.remove('active');
      toggler.classList.remove('active');
    }
  }
}

function closeContactModal() {
  const modal = document.getElementById('contact-modal');
  if (modal) {
    modal.classList.remove('active');
    setTimeout(() => {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }, 300);
  }
}