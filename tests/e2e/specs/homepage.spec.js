// E2E tests for homepage
const { test, expect } = require('@playwright/test');

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/LeadFive/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should have working navigation', async ({ page }) => {
    // Check main navigation links
    const navLinks = [
      { text: 'Home', href: '/' },
      { text: 'Blog', href: '/blog' },
      { text: 'Company', href: '/company' },
      { text: 'Contact', href: '/contact' }
    ];

    for (const link of navLinks) {
      const navLink = page.locator(`nav a:has-text("${link.text}")`);
      await expect(navLink).toBeVisible();
      await expect(navLink).toHaveAttribute('href', link.href);
    }
  });

  test('should display hero section', async ({ page }) => {
    const heroSection = page.locator('.hero-section');
    await expect(heroSection).toBeVisible();
    
    // Check hero content
    const heroTitle = heroSection.locator('h1');
    await expect(heroTitle).toBeVisible();
    await expect(heroTitle).toHaveText(/AI.*Psychology.*Marketing/i);
    
    // Check CTA button
    const ctaButton = heroSection.locator('a.btn-primary');
    await expect(ctaButton).toBeVisible();
  });

  test('should display services section', async ({ page }) => {
    const servicesSection = page.locator('#services');
    await expect(servicesSection).toBeVisible();
    
    // Check service cards
    const serviceCards = servicesSection.locator('.service-card');
    await expect(serviceCards).toHaveCount(4); // Expecting 4 services
  });

  test('should have responsive design', async ({ page, viewport }) => {
    // Test mobile menu
    if (viewport.width < 768) {
      const mobileMenuButton = page.locator('.mobile-menu-toggle');
      await expect(mobileMenuButton).toBeVisible();
      
      // Open mobile menu
      await mobileMenuButton.click();
      const mobileNav = page.locator('.mobile-nav');
      await expect(mobileNav).toBeVisible();
    }
  });

  test('should have proper meta tags', async ({ page }) => {
    // Check essential meta tags
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', /.+/);
    
    const viewport = page.locator('meta[name="viewport"]');
    await expect(viewport).toHaveAttribute('content', /width=device-width/);
    
    // Check Open Graph tags
    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveAttribute('content', /.+/);
  });

  test('should load images properly', async ({ page }) => {
    // Wait for images to load
    await page.waitForLoadState('networkidle');
    
    // Check that images are loaded
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const isVisible = await img.isVisible();
      
      if (isVisible) {
        // Check image has loaded (naturalWidth > 0)
        const hasLoaded = await img.evaluate((el) => {
          return el.naturalWidth > 0;
        });
        expect(hasLoaded).toBe(true);
      }
    }
  });

  test('should have working contact form', async ({ page }) => {
    // Navigate to contact section or page
    await page.click('a[href="/contact"]');
    await page.waitForURL('**/contact');
    
    // Fill contact form
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('textarea[name="message"]', 'This is a test message');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Check for success message or redirect
    await expect(page.locator('.success-message')).toBeVisible({ timeout: 10000 });
  });

  test('should have proper footer', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    
    // Check footer links
    const footerLinks = footer.locator('a');
    const linkCount = await footerLinks.count();
    expect(linkCount).toBeGreaterThan(0);
    
    // Check copyright
    const copyright = footer.locator('text=/© \\d{4} LeadFive/');
    await expect(copyright).toBeVisible();
  });

  test('should track page performance', async ({ page }) => {
    // Get performance metrics
    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime,
        firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime
      };
    });
    
    // Assert performance thresholds
    expect(metrics.firstContentfulPaint).toBeLessThan(2000); // Under 2 seconds
    expect(metrics.domContentLoaded).toBeLessThan(3000); // Under 3 seconds
  });
});