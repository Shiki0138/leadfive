// Integration tests for Jekyll build process
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const util = require('util');

const execAsync = util.promisify(exec);

describe('Jekyll Build Integration', () => {
  const siteDir = path.join(__dirname, '../../_site');
  
  beforeAll(async () => {
    // Clean build directory
    if (fs.existsSync(siteDir)) {
      fs.rmSync(siteDir, { recursive: true, force: true });
    }
    
    // Run Jekyll build
    try {
      await execAsync('bundle exec jekyll build --config _config.yml,_config_dev.yml', {
        cwd: path.join(__dirname, '../..')
      });
    } catch (error) {
      console.error('Jekyll build failed:', error);
      throw error;
    }
  }, 30000);

  describe('Build Output Validation', () => {
    it('should generate index.html', () => {
      const indexPath = path.join(siteDir, 'index.html');
      expect(fs.existsSync(indexPath)).toBe(true);
    });

    it('should generate all required pages', () => {
      const requiredPages = [
        'index.html',
        'blog/index.html',
        'company/index.html',
        'contact/index.html',
        'privacy/index.html',
        'feed.xml',
        'sitemap.xml',
        'robots.txt'
      ];

      requiredPages.forEach(page => {
        const pagePath = path.join(siteDir, page);
        expect(fs.existsSync(pagePath)).toBe(true);
      });
    });

    it('should compile SCSS to CSS', () => {
      const cssPath = path.join(siteDir, 'assets/css/main.css');
      expect(fs.existsSync(cssPath)).toBe(true);
      
      const cssContent = fs.readFileSync(cssPath, 'utf8');
      expect(cssContent.length).toBeGreaterThan(1000);
      expect(cssContent).not.toContain('$primary-color');
    });

    it('should copy JavaScript files', () => {
      const jsFiles = [
        'assets/js/main.js',
        'assets/js/blog-automation.js',
        'assets/js/contact.js'
      ];

      jsFiles.forEach(jsFile => {
        const jsPath = path.join(siteDir, jsFile);
        expect(fs.existsSync(jsPath)).toBe(true);
      });
    });

    it('should generate valid HTML', () => {
      const indexPath = path.join(siteDir, 'index.html');
      const html = fs.readFileSync(indexPath, 'utf8');
      
      // Check for required HTML elements
      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('<html');
      expect(html).toContain('<head>');
      expect(html).toContain('<body>');
      expect(html).toContain('</html>');
      
      // Check for meta tags
      expect(html).toContain('<meta charset="utf-8">');
      expect(html).toContain('<meta name="viewport"');
      
      // Check for SEO tags
      expect(html).toContain('<title>');
      expect(html).toContain('<meta name="description"');
    });
  });

  describe('Blog Generation', () => {
    it('should generate blog posts from markdown', () => {
      const blogDir = path.join(siteDir, 'blog');
      expect(fs.existsSync(blogDir)).toBe(true);
      
      // Check if at least one blog post was generated
      const yearDirs = fs.readdirSync(blogDir).filter(item => 
        fs.statSync(path.join(blogDir, item)).isDirectory() && /^\d{4}$/.test(item)
      );
      
      expect(yearDirs.length).toBeGreaterThan(0);
    });

    it('should generate RSS feed', () => {
      const feedPath = path.join(siteDir, 'feed.xml');
      const feedContent = fs.readFileSync(feedPath, 'utf8');
      
      expect(feedContent).toContain('<?xml version="1.0" encoding="utf-8"?>');
      expect(feedContent).toContain('<rss');
      expect(feedContent).toContain('<channel>');
      expect(feedContent).toContain('<title>');
    });
  });

  describe('Asset Processing', () => {
    it('should copy images', () => {
      const imageDir = path.join(siteDir, 'assets/images');
      expect(fs.existsSync(imageDir)).toBe(true);
      
      const hasImages = fs.readdirSync(imageDir).some(file => 
        /\.(jpg|jpeg|png|gif|svg)$/i.test(file)
      );
      expect(hasImages).toBe(true);
    });

    it('should generate sitemap.xml', () => {
      const sitemapPath = path.join(siteDir, 'sitemap.xml');
      const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
      
      expect(sitemapContent).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(sitemapContent).toContain('<urlset');
      expect(sitemapContent).toContain('<url>');
      expect(sitemapContent).toContain('<loc>');
    });
  });

  describe('Performance Optimization', () => {
    it('should not include development files in production build', () => {
      const devFiles = [
        'Gemfile',
        'Gemfile.lock',
        'package.json',
        'package-lock.json',
        '_config.yml',
        'scripts/',
        'tests/'
      ];

      devFiles.forEach(file => {
        const filePath = path.join(siteDir, file);
        expect(fs.existsSync(filePath)).toBe(false);
      });
    });

    it('should generate reasonable file sizes', () => {
      const cssPath = path.join(siteDir, 'assets/css/main.css');
      const cssStats = fs.statSync(cssPath);
      
      // CSS should be less than 100KB
      expect(cssStats.size).toBeLessThan(100 * 1024);
      
      // Check HTML file sizes
      const indexPath = path.join(siteDir, 'index.html');
      const indexStats = fs.statSync(indexPath);
      
      // HTML pages should be less than 200KB
      expect(indexStats.size).toBeLessThan(200 * 1024);
    });
  });
});