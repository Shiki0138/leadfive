/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://leadfive.co.jp',
  generateRobotsTxt: false, // We already have a custom robots.txt
  generateIndexSitemap: true,
  changefreq: 'weekly',
  priority: 0.7,
  sitemapSize: 5000,
  exclude: [
    '/admin',
    '/admin/*',
    '/api/*',
    '/_next/*',
    '/404',
    '/500',
    '/private/*',
    '/thank-you',
    '/contact/success',
  ],
  additionalPaths: async (config) => {
    // Add dynamic paths here if needed
    const result = []
    
    // Add blog posts
    const blogPosts = [
      '/blog/ai-marketing-psychology',
      '/blog/ai-copywriting-8-instincts',
      '/blog/customer-psychology-data-analysis',
      '/blog/ai-chatgpt-marketing-automation',
      '/blog/ai-psychology-marketing-revolution',
    ]
    
    blogPosts.forEach(post => {
      result.push({
        loc: post,
        changefreq: 'monthly',
        priority: 0.6,
        lastmod: new Date().toISOString(),
      })
    })
    
    // Add service pages
    const services = [
      '/services/ai-marketing',
      '/services/ai-automation',
      '/services/consulting',
      '/services/customer-analysis',
      '/services/integrated-marketing',
      '/services/lp-optimization',
    ]
    
    services.forEach(service => {
      result.push({
        loc: service,
        changefreq: 'monthly',
        priority: 0.8,
        lastmod: new Date().toISOString(),
      })
    })
    
    // Add case studies
    const caseStudies = [
      '/case-studies/beauty-salon',
      '/case-studies/ecommerce-growth',
      '/case-studies/saas-conversion',
    ]
    
    caseStudies.forEach(study => {
      result.push({
        loc: study,
        changefreq: 'monthly',
        priority: 0.7,
        lastmod: new Date().toISOString(),
      })
    })
    
    return result
  },
  robotsTxtOptions: {
    additionalSitemaps: [
      'https://leadfive.co.jp/sitemap-0.xml',
      'https://leadfive.co.jp/sitemap-index.xml',
    ],
  },
}