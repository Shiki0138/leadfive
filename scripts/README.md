# Blog Automation Scripts

## Directory Structure

```
scripts/
├── blog-automation/      # Core blog automation tools
│   ├── claude-blog-generator.js
│   ├── mock-blog-generator.js
│   ├── multi-ai-generator.js
│   ├── test-generator.js
│   ├── topic-manager.js
│   └── writing-prompts.js
├── blog-creators/        # Various blog creation scripts
│   ├── advanced-blog-creator.js
│   ├── beauty-salon-chatgpt-blog-creator.js
│   ├── claude-powered-blog-creator.js
│   ├── claude-realtime-blog-creator.js
│   ├── claude-research-blog-creator.js
│   ├── enhanced-keyword-blog-creator.js
│   ├── high-quality-blog-creator.js
│   ├── keyword-based-blog-creator.js
│   └── serp-blog-creator.js
├── demos/               # Demo scripts
│   ├── demo-advanced-blog.js
│   ├── demo-beauty-salon-chatgpt.js
│   ├── demo-blog-post.js
│   ├── demo-claude-blog.js
│   └── demo-serp-blog.js
└── Other utility scripts...
```

## Main Blog Creator

The primary blog creation tool is:
```bash
node claude-code-realtime-blog-creator.js
```

This script features:
- Real-time search integration
- Keyword analysis and correction
- Competitor analysis
- SEO optimization
- Multi-language support

## Quick Start

1. Set up your `.env` file with API keys
2. Run the main blog creator:
   ```bash
   node claude-code-realtime-blog-creator.js
   ```

## Other Scripts

- `blog-automation/`: Core automation tools for scheduled posting
- `blog-creators/`: Alternative blog creation scripts for different use cases
- `demos/`: Example implementations and test scripts