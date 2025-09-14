---
render_with_liquid: false
---

# Component Specifications - LeadFive Website

## Core Component Library

### 1. Hero Section with 3D Brain Network

#### Component: `HeroSection`
**Purpose**: Create an impactful first impression with interactive 3D visualization

**Technical Specifications**:
```typescript
interface HeroSectionProps {
  title: string
  subtitle: string
  ctaPrimary: CTAButton
  ctaSecondary: CTAButton
  backgroundAnimation: '3d-brain' | 'particles' | 'gradient'
}

interface CTAButton {
  text: string
  href: string
  variant: 'primary' | 'secondary'
  onClick?: () => void
}
```

**3D Implementation Details**:
- Three.js fiber for React integration
- WebGL shader for neural network effect
- 60 FPS target with fallback to static image
- Mouse interaction for rotation
- Mobile touch gestures support

**Performance Considerations**:
- Lazy load Three.js (200KB+ gzipped)
- Use OffscreenCanvas for rendering
- Implement LOD (Level of Detail) for mobile
- Fallback to CSS animation on low-end devices

### 2. Interactive Desire Octagon

#### Component: `DesireOctagon`
**Purpose**: Visualize 8 fundamental human desires with interactive exploration

**Technical Specifications**:
```typescript
interface DesireOctagonProps {
  desires: Desire[]
  onDesireSelect: (desire: Desire) => void
  animationDelay?: number
  size?: 'small' | 'medium' | 'large'
}

interface Desire {
  id: number
  name: string
  namejp: string
  icon: string
  color: string
  description: string
  marketingApplication: string
  examples: string[]
}
```

**Interaction Design**:
- Hover: Scale 1.1x with shadow
- Click: Expand detail panel with animation
- Mobile: Tap to select, swipe to navigate
- Keyboard: Tab navigation with ARIA labels

**Animation Specifications**:
- Entry: Stagger animation 100ms per item
- Hover: Spring animation (stiffness: 300, damping: 20)
- Selection: Morph to detail view 400ms
- Exit: Fade out 200ms

### 3. AI Chat Interface

#### Component: `AIChat`
**Purpose**: Real-time AI-powered consultation interface

**Technical Specifications**:
```typescript
interface AIChatProps {
  apiEndpoint: string
  welcomeMessage: string
  placeholder: string
  maxMessages?: number
  enableVoice?: boolean
  theme?: ChatTheme
}

interface ChatTheme {
  primaryColor: string
  backgroundColor: string
  textColor: string
  borderRadius: number
}

interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  metadata?: {
    tokens?: number
    model?: string
    error?: boolean
  }
}
```

**Features**:
- Real-time streaming responses
- Message history with pagination
- Typing indicators
- Error handling with retry
- Rate limiting (10 messages/minute)
- Export conversation feature

**AI Integration**:
- OpenAI GPT-4 Turbo for responses
- Context window: 8,000 tokens
- Temperature: 0.7 for balanced creativity
- System prompt for brand voice
- Fallback responses for errors

### 4. Blog Post Card

#### Component: `BlogPostCard`
**Purpose**: Display blog posts with AI-generated summaries

**Technical Specifications**:
```typescript
interface BlogPostCardProps {
  post: BlogPost
  variant: 'compact' | 'featured' | 'list'
  showSummary?: boolean
  onReadMore?: () => void
}

interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  featuredImage: {
    url: string
    alt: string
    width: number
    height: number
  }
  author: Author
  publishedAt: Date
  categories: Category[]
  tags: string[]
  readingTime: number
  aiSummary?: string
}
```

**Responsive Behavior**:
- Desktop: 3-column grid
- Tablet: 2-column grid
- Mobile: Single column stack
- Image lazy loading with blur placeholder

### 5. Performance Monitor

#### Component: `PerformanceMonitor`
**Purpose**: Track and optimize real-time performance

**Technical Specifications**:
```typescript
interface PerformanceMetrics {
  fps: number
  memory: number
  loadTime: number
  interactionDelay: number
  renderTime: number
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics
  private observers: PerformanceObserver[]
  
  startMonitoring(): void
  stopMonitoring(): void
  getMetrics(): PerformanceMetrics
  optimizeForDevice(): void
}
```

**Optimization Triggers**:
- FPS < 30: Reduce animation complexity
- Memory > 100MB: Clear unused resources
- Load time > 3s: Enable aggressive caching
- Interaction delay > 100ms: Defer non-critical updates

## Shared UI Components

### Button Component
```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost' | 'danger'
  size: 'small' | 'medium' | 'large'
  fullWidth?: boolean
  loading?: boolean
  disabled?: boolean
  icon?: React.ReactNode
  children: React.ReactNode
  onClick?: () => void
}
```

### Card Component
```typescript
interface CardProps {
  variant: 'elevated' | 'outlined' | 'filled'
  padding: 'none' | 'small' | 'medium' | 'large'
  interactive?: boolean
  className?: string
  children: React.ReactNode
}
```

### Modal Component
```typescript
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  size: 'small' | 'medium' | 'large' | 'fullscreen'
  closeOnOverlayClick?: boolean
  showCloseButton?: boolean
  children: React.ReactNode
}
```

## Animation Specifications

### Global Animation Settings
```typescript
const animations = {
  // Timing functions
  easing: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    smooth: 'cubic-bezier(0.4, 0, 0.2, 1)'
  },
  
  // Duration presets
  duration: {
    instant: 150,
    fast: 250,
    normal: 400,
    slow: 600
  },
  
  // Spring presets
  spring: {
    default: { stiffness: 300, damping: 30 },
    wobbly: { stiffness: 180, damping: 12 },
    stiff: { stiffness: 400, damping: 40 }
  }
}
```

### Page Transition Specifications
```typescript
const pageTransitions = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.4, ease: 'easeInOut' }
}
```

## Accessibility Requirements

### WCAG 2.1 AA Compliance
- Color contrast ratio: 4.5:1 minimum
- Focus indicators: 2px solid outline
- Skip navigation links
- Semantic HTML structure
- ARIA labels for interactive elements
- Keyboard navigation support
- Screen reader announcements

### Keyboard Navigation Map
```
Tab: Navigate forward
Shift+Tab: Navigate backward
Enter/Space: Activate buttons
Arrow keys: Navigate within components
Escape: Close modals/dropdowns
```

## Responsive Design Breakpoints

```scss
$breakpoints: (
  'mobile': 320px,
  'mobile-lg': 480px,
  'tablet': 768px,
  'tablet-lg': 1024px,
  'desktop': 1280px,
  'desktop-lg': 1440px,
  'desktop-xl': 1920px
);
```

## Component Testing Strategy

### Unit Tests
- Component rendering
- Props validation
- Event handlers
- State management
- Accessibility compliance

### Integration Tests
- API interactions
- Navigation flows
- Form submissions
- Error scenarios
- Performance metrics

### Visual Regression Tests
- Component snapshots
- Responsive layouts
- Animation states
- Theme variations
- Browser compatibility

## Performance Budgets

### Component-Level Budgets
| Component | JS Size | CSS Size | Initial Render |
|-----------|---------|----------|----------------|
| HeroSection | < 50KB | < 10KB | < 100ms |
| DesireOctagon | < 30KB | < 8KB | < 80ms |
| AIChat | < 40KB | < 12KB | < 150ms |
| BlogPostCard | < 20KB | < 5KB | < 50ms |

### Page-Level Budgets
- Total JS: < 200KB (gzipped)
- Total CSS: < 50KB (gzipped)
- Time to Interactive: < 3.5s
- First Contentful Paint: < 1.5s

---

**Document Version**: 1.0  
**Date**: 2025-08-05  
**Status**: Component Specifications