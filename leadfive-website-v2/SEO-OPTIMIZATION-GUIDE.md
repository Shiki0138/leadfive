# SEO Optimization Guide for LeadFive Website

## 🎯 SEO Implementation Overview

This guide documents all SEO optimizations implemented in the LeadFive website v2.

## 📋 SEO Checklist

### ✅ Meta Tags & Head Optimization
- [x] Dynamic meta titles with template system
- [x] Meta descriptions for all pages
- [x] Keywords meta tags
- [x] Canonical URLs
- [x] Open Graph tags (Facebook, LinkedIn)
- [x] Twitter Card tags
- [x] Viewport meta tag for mobile
- [x] Theme color meta tag
- [x] Favicon and app icons
- [x] Manifest.json for PWA

### ✅ Structured Data (JSON-LD)
- [x] Organization schema on layout
- [x] WebSite schema with search action
- [x] BreadcrumbList schema
- [x] Article schema for blog posts
- [x] Service schema for service pages
- [x] FAQ schema support

### ✅ Technical SEO
- [x] XML Sitemap generation (next-sitemap)
- [x] Robots.txt with sitemap reference
- [x] 404 error page
- [x] Error boundary for 500 errors
- [x] Loading states for better UX
- [x] Service Worker for offline support
- [x] Web Vitals monitoring

### ✅ Performance Optimization
- [x] Image optimization with Next.js Image
- [x] Lazy loading for images
- [x] WebP and AVIF format support
- [x] Responsive images with srcset
- [x] Critical CSS inlining
- [x] Bundle size optimization
- [x] Cache headers for static assets
- [x] Compression enabled
- [x] Prefetch and preconnect hints

### ✅ URL Structure & Navigation
- [x] SEO-friendly URL patterns
- [x] Trailing slash redirects
- [x] WWW to non-WWW redirect
- [x] Clean URL rewrites
- [x] Breadcrumb navigation
- [x] Internal linking optimization

### ✅ Security Headers
- [x] X-Frame-Options
- [x] X-Content-Type-Options
- [x] X-XSS-Protection
- [x] Referrer-Policy
- [x] Permissions-Policy
- [x] Content Security Policy

### ✅ Mobile Optimization
- [x] Responsive design
- [x] Mobile-friendly navigation
- [x] Touch-friendly buttons
- [x] Optimized fonts for mobile
- [x] PWA capabilities

### ✅ Content Optimization
- [x] Proper heading hierarchy (H1-H6)
- [x] Alt text for images
- [x] Descriptive link text
- [x] Content hierarchy optimization
- [x] Keyword optimization in content

### ✅ Analytics & Monitoring
- [x] Google Analytics integration
- [x] Web Vitals tracking
- [x] SEO monitoring component (dev mode)
- [x] Performance monitoring
- [x] Error tracking

## 🚀 Implementation Details

### 1. Meta Tags Implementation

Located in `app/layout.tsx`, the main metadata configuration includes:

```typescript
export const metadata: Metadata = {
  metadataBase: new URL("https://leadfive.co.jp"),
  title: {
    default: "AI×心理学で売上を科学する | LeadFive",
    template: "%s | LeadFive",
  },
  description: "...",
  keywords: [...],
  openGraph: {...},
  twitter: {...},
  robots: {...},
}
```

### 2. Structured Data

JSON-LD structured data is implemented using Script components:

```typescript
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  // ... organization details
}
```

### 3. Image Optimization

Using Next.js Image component with:
- Automatic format selection (WebP/AVIF)
- Responsive sizing
- Lazy loading
- Blur placeholders

### 4. Performance Features

- Service Worker for offline support
- Web Vitals monitoring
- Bundle splitting and optimization
- Cache strategies for static assets

### 5. SEO Utilities

Located in `lib/seo.ts`:
- `generateSEO()` - Generate page-specific metadata
- `generateJsonLd()` - Create structured data

## 📊 SEO Monitoring

### Development Tools

1. **SEO Monitor Component** (`components/SEOMonitor.tsx`)
   - Real-time SEO metrics
   - Heading structure analysis
   - Image optimization check
   - Link analysis
   - Performance metrics

2. **Web Vitals Tracking** (`components/WebVitals.tsx`)
   - Core Web Vitals monitoring
   - Performance metrics tracking
   - Analytics integration

## 🔧 Configuration Files

### next-sitemap.config.js
- Automatic sitemap generation
- Dynamic path configuration
- Priority and frequency settings

### next.config.ts
- Image optimization settings
- Security headers
- URL rewrites and redirects
- Webpack optimization

### robots.txt
- Crawler directives
- Sitemap references
- Crawl delay settings

## 📝 Best Practices Implemented

1. **Title Tags**: 30-60 characters, unique for each page
2. **Meta Descriptions**: 120-160 characters, compelling CTAs
3. **URLs**: Clean, descriptive, keyword-rich
4. **Images**: Optimized, with alt text, lazy loaded
5. **Content**: Structured with proper headings, keyword-optimized
6. **Mobile**: Fully responsive, PWA-ready
7. **Speed**: Optimized bundles, caching, compression

## 🛠️ Maintenance Tasks

### Regular Tasks
- [ ] Update sitemap after adding new pages
- [ ] Monitor Core Web Vitals scores
- [ ] Check for broken links
- [ ] Update meta descriptions for better CTR
- [ ] Review and update keywords
- [ ] Analyze search console data

### Deployment Checklist
- [ ] Build and test sitemap generation
- [ ] Verify robots.txt is accessible
- [ ] Check all meta tags are rendering
- [ ] Test structured data with Google's tool
- [ ] Verify analytics tracking
- [ ] Test page speed scores

## 📚 Resources

- [Google Search Console](https://search.google.com/search-console)
- [Schema.org Validator](https://validator.schema.org/)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)
- [Rich Results Test](https://search.google.com/test/rich-results)

## 🎯 Target Metrics

- **Core Web Vitals**: All green scores
- **PageSpeed Score**: 90+ on mobile and desktop
- **SEO Score**: 95+ on Lighthouse
- **Mobile Usability**: 100% mobile-friendly
- **Structured Data**: No errors in testing tools