// Neural Network Canvas Animation
function initNeuralNetworkCanvas() {
  const canvas = document.getElementById('neural-network-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  const nodes = [];
  const nodeCount = 50;
  
  // Create nodes
  for (let i = 0; i < nodeCount; i++) {
    nodes.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 3 + 1
    });
  }
  
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update nodes
    nodes.forEach(node => {
      node.x += node.vx;
      node.y += node.vy;
      
      if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
      if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
    });
    
    // Draw connections
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.1)';
    ctx.lineWidth = 1;
    
    nodes.forEach((node1, i) => {
      nodes.slice(i + 1).forEach(node2 => {
        const distance = Math.sqrt(
          Math.pow(node1.x - node2.x, 2) + 
          Math.pow(node1.y - node2.y, 2)
        );
        
        if (distance < 150) {
          ctx.beginPath();
          ctx.moveTo(node1.x, node1.y);
          ctx.lineTo(node2.x, node2.y);
          ctx.globalAlpha = 1 - distance / 150;
          ctx.stroke();
        }
      });
    });
    
    // Draw nodes
    ctx.globalAlpha = 1;
    ctx.fillStyle = 'rgba(139, 92, 246, 0.5)';
    
    nodes.forEach(node => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fill();
    });
    
    requestAnimationFrame(animate);
  }
  
  animate();
  
  // Resize handler
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

// Mobile menu toggle
function initMobileMenu() {
  const toggler = document.querySelector('.navbar-toggler');
  const menu = document.querySelector('.navbar-menu');
  
  if (toggler && menu) {
    toggler.addEventListener('click', () => {
      menu.classList.toggle('active');
      toggler.classList.toggle('active');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.navbar')) {
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

// AI Analysis Modal
function openAIAnalysis() {
  const modal = document.getElementById('ai-analysis-modal');
  if (modal) {
    modal.classList.add('active');
  }
}

function closeAIAnalysis() {
  const modal = document.getElementById('ai-analysis-modal');
  if (modal) {
    modal.classList.remove('active');
  }
}

// Contact form
function openContactForm() {
  // Redirect to contact page or open modal
  window.location.href = '/contact/';
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
  }
}

// Future letter functionality
function showLetter(type) {
  const actionLetter = document.getElementById('action-letter');
  const waitLetter = document.getElementById('wait-letter');
  
  if (type === 'action') {
    actionLetter.style.display = 'block';
    waitLetter.style.display = 'none';
  } else {
    actionLetter.style.display = 'none';
    waitLetter.style.display = 'block';
  }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initNeuralNetworkCanvas();
  initMobileMenu();
  initSmoothScroll();
  initScrollAnimations();
});

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