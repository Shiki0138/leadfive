# DevOps Guide for LeadFive Website

## Overview

This guide covers the complete DevOps setup for the LeadFive Jekyll website, including CI/CD, testing, deployment, monitoring, and performance optimization.

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Development Setup](#development-setup)
3. [Testing Strategy](#testing-strategy)
4. [CI/CD Pipeline](#cicd-pipeline)
5. [Deployment](#deployment)
6. [Monitoring & Analytics](#monitoring--analytics)
7. [Performance Optimization](#performance-optimization)
8. [Security](#security)
9. [Troubleshooting](#troubleshooting)

## Tech Stack

- **Static Site Generator**: Jekyll 4.x
- **Hosting**: GitHub Pages / Netlify
- **CI/CD**: GitHub Actions
- **Testing**: Jest (unit/integration), Playwright (E2E)
- **Performance**: Lighthouse CI
- **Monitoring**: Custom JavaScript monitoring
- **CDN**: Cloudflare (optional)

## Development Setup

### Prerequisites

1. Ruby 3.0+ and Bundler
2. Node.js 18+ and npm
3. Git

### Local Development

```bash
# Clone repository
git clone https://github.com/Shiki0138/leadfive.git
cd leadfive

# Install dependencies
bundle install
npm install

# Start development server
npm run dev
# Visit http://localhost:4000
```

### Available Scripts

```bash
# Development
npm run dev              # Start Jekyll with live reload
npm run build            # Build for development
npm run build:production # Build for production

# Testing
npm test                 # Run all tests
npm run test:unit        # Run unit tests
npm run test:integration # Run integration tests
npm run test:e2e         # Run E2E tests
npm run test:coverage    # Generate coverage report

# Code Quality
npm run lint             # Check code style
npm run lint:fix         # Fix code style issues
npm run security:check   # Security audit

# Deployment
npm run deploy           # Deploy to staging (default)
npm run deploy:staging   # Deploy to staging
npm run deploy:production # Deploy to production

# Performance
npm run performance:test # Run Lighthouse tests
```

## Testing Strategy

### 1. Unit Tests (Jest)

Located in `tests/unit/`, these test individual JavaScript functions:

```javascript
// Example: tests/unit/blog-automation.test.js
npm run test:unit
```

Coverage threshold: 80% for all metrics.

### 2. Integration Tests (Jest)

Located in `tests/integration/`, these test Jekyll build process:

```javascript
// Example: tests/integration/jekyll-build.test.js
npm run test:integration
```

### 3. E2E Tests (Playwright)

Located in `tests/e2e/specs/`, these test user workflows:

```javascript
// Example: tests/e2e/specs/homepage.spec.js
npm run test:e2e

# Run with UI mode for debugging
npm run test:e2e:ui

# Run in headed mode
npm run test:e2e:headed
```

### 4. Performance Tests (Lighthouse)

Performance budgets defined in `lighthouse-budget.json`:

```bash
npm run performance:test
```

Key metrics:
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Total Blocking Time: < 300ms
- Cumulative Layout Shift: < 0.1

## CI/CD Pipeline

### GitHub Actions Workflow

The pipeline (`.github/workflows/ci-cd.yml`) runs on every push and PR:

1. **Lint & Test Stage**
   - Ruby and Node.js setup
   - Dependency installation
   - HTML validation
   - JavaScript linting
   - Security checks

2. **Build Stage**
   - Jekyll build with production config
   - Sitemap generation
   - Artifact upload

3. **Deploy Stage**
   - Staging: Deploy to `gh-pages-staging` branch
   - Production: Deploy to `gh-pages` branch

4. **Performance Test Stage**
   - Lighthouse CI tests
   - Performance budget validation

### Branch Strategy

- `main`: Production branch
- `develop`: Staging branch
- `feature/*`: Feature branches

## Deployment

### Manual Deployment

```bash
# Deploy to staging
./scripts/deploy.sh --staging

# Deploy to production
./scripts/deploy.sh --production

# Skip tests during deployment
./scripts/deploy.sh --staging --skip-tests
```

### Automatic Deployment

- **Staging**: Automatically deploys `develop` branch
- **Production**: Automatically deploys `main` branch after approval

### Deployment Checklist

1. ✅ All tests passing
2. ✅ Security audit clean
3. ✅ Performance budgets met
4. ✅ No uncommitted changes
5. ✅ On correct branch
6. ✅ Dependencies up to date

## Monitoring & Analytics

### Real User Monitoring (RUM)

The site includes custom monitoring (`scripts/monitor.js`) that tracks:

- Page load performance
- Core Web Vitals (LCP, FID, CLS)
- JavaScript errors
- Resource loading issues

### Key Metrics Tracked

1. **Performance Metrics**
   - DNS lookup time
   - TCP connection time
   - Time to First Byte (TTFB)
   - DOM Content Loaded
   - Window Load
   - First Paint / First Contentful Paint

2. **Resource Metrics**
   - Total resources loaded
   - Resources by type (JS, CSS, images, fonts)
   - Slowest resources

3. **Error Tracking**
   - JavaScript errors with stack traces
   - Failed resource loads
   - Unhandled promise rejections

### Integration with Analytics

Metrics are sent to Google Analytics as events:

```javascript
ga('send', 'event', 'Performance', 'lcp', null, 1523);
```

## Performance Optimization

### Build-time Optimizations

1. **Asset Optimization**
   - CSS minification with csso
   - JavaScript minification with terser
   - Image optimization with optipng

2. **Jekyll Optimizations**
   - Incremental builds in development
   - Asset fingerprinting for cache busting
   - HTML minification

### Runtime Optimizations

1. **Caching Strategy**
   - Static assets: 1 year cache
   - CSS/JS: 24 hour cache with revalidation
   - HTML: No cache

2. **CDN Configuration**
   - Cloudflare integration (optional)
   - Automatic cache purging on deploy

3. **Security Headers**
   - Content Security Policy
   - X-Frame-Options
   - X-Content-Type-Options
   - Referrer Policy

### Performance Budget

Defined in `lighthouse-budget.json`:

- **JavaScript**: < 200KB
- **CSS**: < 100KB
- **Images**: < 500KB per image
- **Total page weight**: < 1.5MB
- **Time to Interactive**: < 3s

## Security

### Security Headers

Configured in `_headers` and `netlify.toml`:

```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Content-Security-Policy: [policy]
```

### Dependency Security

```bash
# Check for vulnerabilities
npm run security:check

# Update dependencies
npm update
bundle update
```

### SSL/TLS

- Automatic HTTPS via GitHub Pages/Netlify
- HSTS header enabled
- TLS 1.2+ only

## Troubleshooting

### Common Issues

1. **Jekyll Build Fails**
   ```bash
   # Clean and rebuild
   bundle exec jekyll clean
   bundle exec jekyll build --trace
   ```

2. **Test Failures**
   ```bash
   # Run specific test file
   jest tests/unit/specific-test.js --verbose
   
   # Debug E2E tests
   npm run test:e2e:ui
   ```

3. **Deployment Issues**
   ```bash
   # Check deployment logs
   ./scripts/deploy.sh --staging --verbose
   
   # Verify git status
   git status
   git log --oneline -5
   ```

4. **Performance Issues**
   ```bash
   # Generate performance report
   npm run performance:test
   
   # Check bundle sizes
   bundle exec jekyll build --profile
   ```

### Debug Mode

Enable debug logging:

```bash
# Jekyll debug
JEKYLL_LOG_LEVEL=debug bundle exec jekyll serve

# Node debug
DEBUG=* npm run dev
```

### Support Contacts

- **DevOps Issues**: mail@lead-v.com
- **Emergency**: +81-XXX-XXXX (24/7 on-call)
- **Documentation**: This guide and inline code comments

## Continuous Improvement

1. **Weekly Reviews**
   - Performance metrics analysis
   - Error rate monitoring
   - Deployment success rate

2. **Monthly Updates**
   - Dependency updates
   - Security patches
   - Performance optimization

3. **Quarterly Audits**
   - Full security audit
   - Performance benchmark
   - Infrastructure review

---

**Last Updated**: January 2025
**Version**: 1.0.0