import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // SEO and Performance optimizations
  reactStrictMode: true,
  poweredByHeader: false,
  
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'inline',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Compression
  compress: true,
  
  // Headers for security and performance
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      },
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      }
    ]
  },
  
  // Redirects for SEO
  async redirects() {
    return [
      // Redirect www to non-www
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.leadfive.co.jp',
          },
        ],
        destination: 'https://leadfive.co.jp/:path*',
        permanent: true,
      },
      // Redirect trailing slashes
      {
        source: '/:path*/',
        destination: '/:path*',
        permanent: true,
      },
    ]
  },
  
  // Rewrites for clean URLs
  async rewrites() {
    return [
      // Clean service URLs
      {
        source: '/services/:service',
        destination: '/services/[service]',
      },
      // Clean blog URLs
      {
        source: '/blog/:slug',
        destination: '/blog/[slug]',
      },
      // Clean case study URLs
      {
        source: '/case-studies/:study',
        destination: '/case-studies/[study]',
      },
    ]
  },
  
  // Environment variables
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://leadfive.co.jp',
  },
  
  // Webpack optimizations
  webpack: (config, { isServer }) => {
    // Optimize bundle size
    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        default: false,
        vendors: false,
        framework: {
          name: 'framework',
          chunks: 'all',
          test: /[\\/]node_modules[\\/](react|react-dom|next)[\\/]/,
          priority: 40,
          enforce: true,
        },
        lib: {
          test(module: any) {
            return module.size() > 160000 &&
              /node_modules[\\/]/.test(module.identifier())
          },
          name(module: any) {
            const hash = require('crypto').createHash('sha1')
            hash.update(module.identifier())
            return hash.digest('hex').substring(0, 8)
          },
          priority: 30,
          minChunks: 1,
          reuseExistingChunk: true,
        },
        commons: {
          name: 'commons',
          chunks: 'all',
          minChunks: 2,
          priority: 20,
        },
        shared: {
          name(module: any, chunks: any) {
            const hash = require('crypto').createHash('sha1')
            hash.update(chunks.reduce((acc: string, chunk: any) => acc + chunk.name, ''))
            return hash.digest('hex') + (isServer ? '-server' : '')
          },
          priority: 10,
          minChunks: 2,
          reuseExistingChunk: true,
        },
      },
    }
    
    return config
  },
};

export default nextConfig;