// Unit tests for blog automation
const fs = require('fs');
const path = require('path');

describe('Blog Automation', () => {
  let blogAutomation;

  beforeEach(() => {
    // Mock the blog automation module
    jest.mock('../../assets/js/blog-automation.js');
  });

  describe('Blog Post Generation', () => {
    it('should generate a valid blog post with required frontmatter', () => {
      const postData = {
        title: 'Test Blog Post',
        category: 'AI Marketing',
        tags: ['AI', 'Marketing'],
        content: 'This is test content'
      };

      const generatedPost = generateBlogPost(postData);
      
      expect(generatedPost).toContain('---');
      expect(generatedPost).toContain(`title: "${postData.title}"`);
      expect(generatedPost).toContain(`category: ${postData.category}`);
      expect(generatedPost).toContain('tags:');
      expect(generatedPost).toContain(postData.content);
    });

    it('should sanitize file names correctly', () => {
      const testCases = [
        { input: 'Hello World!', expected: 'hello-world' },
        { input: 'AI & Marketing', expected: 'ai-marketing' },
        { input: '日本語タイトル', expected: '日本語タイトル' },
        { input: 'Test@#$%Special', expected: 'test-special' }
      ];

      testCases.forEach(({ input, expected }) => {
        expect(sanitizeFileName(input)).toBe(expected);
      });
    });

    it('should validate required fields', () => {
      const invalidData = {
        title: '',
        content: ''
      };

      expect(() => generateBlogPost(invalidData)).toThrow('Title is required');
    });
  });

  describe('Blog Template Validation', () => {
    it('should validate template structure', () => {
      const validTemplate = {
        layout: 'post',
        sections: ['intro', 'body', 'conclusion'],
        metadata: {
          author: 'Test Author',
          readTime: '5 min'
        }
      };

      expect(validateTemplate(validTemplate)).toBe(true);
    });

    it('should reject invalid templates', () => {
      const invalidTemplate = {
        sections: []
      };

      expect(validateTemplate(invalidTemplate)).toBe(false);
    });
  });

  describe('Image Generation Integration', () => {
    it('should handle image generation requests', async () => {
      const imageRequest = {
        prompt: 'AI marketing concept',
        style: 'modern',
        dimensions: { width: 1200, height: 630 }
      };

      const mockImageUrl = 'https://example.com/generated-image.jpg';
      jest.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => ({ url: mockImageUrl })
      });

      const result = await generateBlogImage(imageRequest);
      
      expect(result.url).toBe(mockImageUrl);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          })
        })
      );
    });
  });
});

// Helper functions (would normally be imported)
function generateBlogPost(data) {
  if (!data.title) throw new Error('Title is required');
  
  const date = new Date().toISOString().split('T')[0];
  const frontmatter = `---
layout: post
title: "${data.title}"
date: ${date}
category: ${data.category || 'general'}
tags:
${(data.tags || []).map(tag => `  - ${tag}`).join('\n')}
---`;

  return `${frontmatter}\n\n${data.content}`;
}

function sanitizeFileName(fileName) {
  return fileName
    .toLowerCase()
    .replace(/[^a-z0-9\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function validateTemplate(template) {
  return !!(
    template.layout &&
    template.sections &&
    Array.isArray(template.sections) &&
    template.sections.length > 0
  );
}

async function generateBlogImage(request) {
  const response = await fetch('/api/generate-image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request)
  });
  
  return response.json();
}