---
render_with_liquid: false
---

# Technical Implementation Plan - LeadFive Website

## アーキテクチャ概要

### システム構成図
```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (Vercel)                      │
│                     Next.js 14 App Router                     │
│                  React + TypeScript + Tailwind                │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ├──────────────┬────────────────┐
                          │              │                │
                          ▼              ▼                ▼
┌─────────────────────────────┐ ┌───────────────┐ ┌─────────────┐
│    Headless WordPress       │ │  OpenAI API   │ │ Analytics   │
│    (WP Engine/Kinsta)       │ │   GPT-4 +     │ │  GA4 +      │
│    - Content Management     │ │   DALL-E 3    │ │  Mixpanel   │
│    - REST API / GraphQL     │ │               │ │             │
└─────────────────────────────┘ └───────────────┘ └─────────────┘
```

## 詳細技術スタック

### フロントエンド構成
```typescript
// package.json
{
  "name": "leadfive-website",
  "version": "2.0.0",
  "dependencies": {
    // Core
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.0.0",
    
    // Styling & Animation
    "tailwindcss": "^3.4.0",
    "framer-motion": "^10.0.0",
    "@react-three/fiber": "^8.0.0",
    "@react-three/drei": "^9.0.0",
    "three": "^0.160.0",
    
    // State & Data
    "zustand": "^4.4.0",
    "@tanstack/react-query": "^5.0.0",
    "axios": "^1.6.0",
    
    // AI Integration
    "ai": "^2.2.0", // Vercel AI SDK
    "openai": "^4.0.0",
    
    // UI Components
    "@radix-ui/react-dialog": "^1.0.0",
    "@radix-ui/react-dropdown-menu": "^2.0.0",
    "react-hook-form": "^7.48.0",
    "zod": "^3.22.0",
    
    // Analytics
    "@vercel/analytics": "^1.1.0",
    "mixpanel-browser": "^2.48.0",
    
    // SEO & Performance
    "next-seo": "^6.4.0",
    "next-sitemap": "^4.2.0"
  }
}
```

### プロジェクト構造
```
leadfive-website/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx         # ルートレイアウト
│   │   ├── page.tsx           # トップページ
│   │   ├── api/               # API Routes
│   │   │   ├── ai-chat/       # AIチャット
│   │   │   └── contact/       # お問い合わせ
│   │   └── blog/              # ブログ（別システム）
│   │
│   ├── components/            # コンポーネント
│   │   ├── ui/               # 基本UIコンポーネント
│   │   ├── sections/         # ページセクション
│   │   │   ├── Hero.tsx
│   │   │   ├── DesireOctagon.tsx
│   │   │   ├── AIInnovation.tsx
│   │   │   └── CaseStudies.tsx
│   │   └── three/            # 3Dコンポーネント
│   │
│   ├── lib/                  # ユーティリティ
│   │   ├── ai/              # AI関連
│   │   ├── wordpress/       # WordPress連携
│   │   └── analytics/       # 分析
│   │
│   ├── hooks/               # カスタムフック
│   ├── styles/              # グローバルスタイル
│   └── types/               # TypeScript型定義
│
├── public/                  # 静的ファイル
├── scripts/                 # ビルドスクリプト
└── tests/                   # テスト
```

## コンポーネント実装例

### 1. ヒーローセクション with 3D
```tsx
// components/sections/Hero.tsx
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { motion } from 'framer-motion'
import BrainNetwork from '@/components/three/BrainNetwork'

export default function Hero() {
  return (
    <section className="relative h-screen overflow-hidden bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900">
      {/* 3D Background */}
      <div className="absolute inset-0 opacity-60">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <Suspense fallback={null}>
            <BrainNetwork />
          </Suspense>
        </Canvas>
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex h-full items-center justify-center px-4">
        <div className="max-w-4xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6 text-5xl font-bold text-white md:text-7xl"
          >
            人の本能を科学し、
            <br />
            <span className="bg-gradient-to-r from-pink-400 to-indigo-400 bg-clip-text text-transparent">
              AIで未来を創る
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8 text-xl text-gray-200 md:text-2xl"
          >
            8つの根源的欲求 × 最先端AI = ビジネス革新
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col gap-4 sm:flex-row sm:justify-center"
          >
            <button className="rounded-full bg-white px-8 py-4 text-lg font-semibold text-indigo-900 transition hover:bg-gray-100">
              無料相談を予約する
            </button>
            <button className="rounded-full border-2 border-white px-8 py-4 text-lg font-semibold text-white transition hover:bg-white hover:text-indigo-900">
              AI診断を試す
            </button>
          </motion.div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white"
      >
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </motion.div>
    </section>
  )
}
```

### 2. 8つの欲求インタラクティブ図
```tsx
// components/sections/DesireOctagon.tsx
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const desires = [
  {
    id: 1,
    name: '生存欲求',
    icon: '🛡️',
    color: 'from-red-500 to-red-600',
    description: 'セキュリティとリスク管理への根源的な欲求',
    marketing: '安心・安全を訴求するメッセージング戦略'
  },
  {
    id: 2,
    name: '食欲',
    icon: '🍽️',
    color: 'from-orange-500 to-orange-600',
    description: '満足と充実を求める消費行動の原動力',
    marketing: '五感に訴える体験型マーケティング'
  },
  // ... 他の6つの欲求
]

export default function DesireOctagon() {
  const [selectedDesire, setSelectedDesire] = useState(null)
  
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            人間の8つの根源的欲求
          </h2>
          <p className="text-xl text-gray-600">
            すべてのマーケティングは、これらの欲求から始まる
          </p>
        </motion.div>
        
        <div className="relative max-w-4xl mx-auto">
          {/* Octagon Container */}
          <div className="relative w-full aspect-square">
            {desires.map((desire, index) => {
              const angle = (index * 45 - 90) * (Math.PI / 180)
              const radius = 45 // percentage
              const x = 50 + radius * Math.cos(angle)
              const y = 50 + radius * Math.sin(angle)
              
              return (
                <motion.div
                  key={desire.id}
                  className="absolute w-32 h-32 -translate-x-1/2 -translate-y-1/2"
                  style={% raw %}{{ left: `${x}%`, top: `${y}%` }}{% endraw %}
                  whileHover={% raw %}{{ scale: 1.1 }}{% endraw %}
                  onClick={% raw %}{() => setSelectedDesire(desire)}{% endraw %}
                >
                  <div className={% raw %}{`w-full h-full rounded-full bg-gradient-to-br ${desire.color} flex flex-col items-center justify-center cursor-pointer shadow-lg`}{% endraw %}>
                    <span className="text-3xl mb-1">{% raw %}{desire.icon}{% endraw %}</span>
                    <span className="text-white font-semibold text-sm">{% raw %}{desire.name}{% endraw %}</span>
                  </div>
                </motion.div>
              )
            })}
            
            {/* Center Logo */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-white rounded-full shadow-xl flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  LEAD5
                </div>
                <div className="text-sm text-gray-600">AI Marketing</div>
              </div>
            </div>
          </div>
          
          {/* Detail Panel */}
          <AnimatePresence>
            {selectedDesire && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="mt-12 p-8 bg-white rounded-2xl shadow-xl"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-2xl font-bold flex items-center gap-3">
                    <span className="text-3xl">{selectedDesire.icon}</span>
                    {selectedDesire.name}
                  </h3>
                  <button
                    onClick={() => setSelectedDesire(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p className="text-gray-600 mb-4">{selectedDesire.description}</p>
                <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
                  <h4 className="font-semibold text-indigo-900 mb-2">AIマーケティング応用</h4>
                  <p className="text-gray-700">{selectedDesire.marketing}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
```

### 3. AIチャットボット実装
```tsx
// components/ui/AIChat.tsx
import { useState } from 'react'
import { useChat } from 'ai/react'
import { motion, AnimatePresence } from 'framer-motion'

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false)
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/ai-chat',
    initialMessages: [
      {
        id: '1',
        role: 'assistant',
        content: 'こんにちは！人間の欲求とAIマーケティングについて、何でもお聞きください。'
      }
    ]
  })
  
  return (
    <>
      {/* Chat Button */}
      <motion.button
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full shadow-lg flex items-center justify-center text-white"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </motion.button>
      
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-28 right-8 w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">AI Marketing Assistant</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={handleInputChange}
                  placeholder="質問を入力..."
                  className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50"
                >
                  送信
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
```

### 4. WordPress連携
```typescript
// lib/wordpress/client.ts
import axios from 'axios'

const WP_URL = process.env.NEXT_PUBLIC_WP_URL || 'https://blog.leadfive138.com'
const WP_API = `${WP_URL}/wp-json/wp/v2`

export const wpClient = axios.create({
  baseURL: WP_API,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 記事取得
export async function getPosts(params?: {
  page?: number
  per_page?: number
  categories?: number[]
}) {
  const response = await wpClient.get('/posts', { params })
  return {
    posts: response.data,
    totalPages: parseInt(response.headers['x-wp-totalpages']),
    total: parseInt(response.headers['x-wp-total']),
  }
}

// 特定の記事取得
export async function getPost(slug: string) {
  const response = await wpClient.get('/posts', {
    params: { slug, _embed: true },
  })
  return response.data[0]
}

// カテゴリー取得
export async function getCategories() {
  const response = await wpClient.get('/categories')
  return response.data
}
```

### 5. AI自動記事生成API
```typescript
// app/api/ai-blog/route.ts
import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { wpClient } from '@/lib/wordpress/client'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  try {
    const { topic, category } = await request.json()
    
    // 1. GPT-4で記事生成
    const articleResponse = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: `あなたは人間の根源的欲求とAIを専門とするマーケティングコンサルタントです。
          以下の構成で魅力的なブログ記事を作成してください：
          1. 導入（読者の関心を引く）
          2. 人間の欲求との関連性
          3. AI活用の具体例
          4. 実践的なアドバイス
          5. まとめとCTA`
        },
        {
          role: 'user',
          content: `トピック: ${topic}\n2000-3000字の記事を書いてください。`
        }
      ],
      temperature: 0.7,
    })
    
    const articleContent = articleResponse.choices[0].message.content
    
    // 2. タイトル生成
    const titleResponse = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'user',
          content: `以下の記事に魅力的なタイトルをつけてください（30文字以内）:\n\n${articleContent?.substring(0, 500)}...`
        }
      ],
    })
    
    const title = titleResponse.choices[0].message.content
    
    // 3. DALL-E 3でアイキャッチ画像生成
    const imageResponse = await openai.images.generate({
      model: 'dall-e-3',
      prompt: `Blog header image for "${title}". Modern, minimalist design with purple and indigo gradient. Professional marketing theme with subtle AI elements.`,
      size: '1792x1024',
      quality: 'hd',
    })
    
    const imageUrl = imageResponse.data[0].url
    
    // 4. WordPressに投稿
    const wpPost = await createWordPressPost({
      title: title || 'Untitled',
      content: articleContent || '',
      status: 'draft',
      categories: [category],
      featured_media_url: imageUrl,
    })
    
    return NextResponse.json({
      success: true,
      post: wpPost,
    })
    
  } catch (error) {
    console.error('AI Blog Generation Error:', error)
    return NextResponse.json(
      { error: 'Failed to generate blog post' },
      { status: 500 }
    )
  }
}

async function createWordPressPost(data: any) {
  // WordPress REST API を使った投稿処理
  const response = await fetch(`${process.env.WP_API_URL}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${Buffer.from(
        `${process.env.WP_USERNAME}:${process.env.WP_APP_PASSWORD}`
      ).toString('base64')}`,
    },
    body: JSON.stringify(data),
  })
  
  return response.json()
}
```

## デプロイメント設定

### Vercel設定
```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["hnd1"],
  "env": {
    "NEXT_PUBLIC_WP_URL": "@wp_url",
    "OPENAI_API_KEY": "@openai_api_key",
    "WP_USERNAME": "@wp_username",
    "WP_APP_PASSWORD": "@wp_app_password",
    "MIXPANEL_TOKEN": "@mixpanel_token"
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "SAMEORIGIN"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### GitHub Actions CI/CD
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test
  
  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

## パフォーマンス最適化

### 1. 画像最適化
```tsx
// next.config.js
module.exports = {
  images: {
    domains: ['blog.leadfive138.com', 'oaidalleapiprodscus.blob.core.windows.net'],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizeCss: true,
  },
}
```

### 2. コンポーネントの遅延読み込み
```tsx
// Dynamic imports for heavy components
const BrainNetwork = dynamic(() => import('@/components/three/BrainNetwork'), {
  loading: () => <div className="h-full w-full bg-gray-900" />,
  ssr: false,
})

const AIChat = dynamic(() => import('@/components/ui/AIChat'), {
  ssr: false,
})
```

### 3. API Route キャッシング
```typescript
// app/api/blog/posts/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = searchParams.get('page') || '1'
  
  // Vercel Edge Cache
  const posts = await fetch(`${WP_API}/posts?page=${page}`, {
    next: { revalidate: 3600 }, // 1時間キャッシュ
  })
  
  return NextResponse.json(await posts.json())
}
```

## セキュリティ対策

### 1. 環境変数管理
```bash
# .env.local (Vercelで暗号化)
OPENAI_API_KEY=sk-...
WP_APP_PASSWORD=...
NEXT_PUBLIC_GA_ID=G-...
```

### 2. APIレート制限
```typescript
// lib/rate-limit.ts
import { LRUCache } from 'lru-cache'

const tokenCache = new LRUCache<string, number>({
  max: 500,
  ttl: 1000 * 60 * 60, // 1時間
})

export async function rateLimit(request: Request) {
  const ip = request.headers.get('x-forwarded-for') ?? 'anonymous'
  const tokenCount = tokenCache.get(ip) ?? 0
  
  if (tokenCount > 10) {
    return new Response('Rate limit exceeded', { status: 429 })
  }
  
  tokenCache.set(ip, tokenCount + 1)
  return null
}
```

## 監視とアナリティクス

### 1. Vercel Analytics
```tsx
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### 2. カスタムイベントトラッキング
```typescript
// lib/analytics/mixpanel.ts
import mixpanel from 'mixpanel-browser'

mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN!)

export const trackEvent = (eventName: string, properties?: any) => {
  mixpanel.track(eventName, {
    ...properties,
    timestamp: new Date().toISOString(),
  })
}

// 使用例
trackEvent('CTA_Click', {
  button: 'Free Consultation',
  section: 'Hero',
})
```

---

Document Version: 1.0
Date: 2025年7月30日
Status: 技術実装計画