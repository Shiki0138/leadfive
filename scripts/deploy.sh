#!/bin/bash

# Deployment script for LeadFive website
# Supports multiple deployment targets

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Default values
ENVIRONMENT="staging"
BRANCH="develop"
BUILD_CONFIG="_config.yml,_config_dev.yml"

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --production)
            ENVIRONMENT="production"
            BRANCH="main"
            BUILD_CONFIG="_config.yml,_config_production.yml"
            shift
            ;;
        --staging)
            ENVIRONMENT="staging"
            BRANCH="develop"
            BUILD_CONFIG="_config.yml,_config_dev.yml"
            shift
            ;;
        --help)
            echo "Usage: $0 [--production|--staging] [--skip-tests] [--skip-build]"
            echo "Options:"
            echo "  --production    Deploy to production environment"
            echo "  --staging       Deploy to staging environment (default)"
            echo "  --skip-tests    Skip running tests"
            echo "  --skip-build    Skip building the site"
            exit 0
            ;;
        --skip-tests)
            SKIP_TESTS=true
            shift
            ;;
        --skip-build)
            SKIP_BUILD=true
            shift
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

echo -e "${YELLOW}Deploying to ${ENVIRONMENT} environment...${NC}"

# Check if we're on the correct branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "$BRANCH" ]; then
    echo -e "${RED}Error: You must be on the ${BRANCH} branch to deploy to ${ENVIRONMENT}${NC}"
    exit 1
fi

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo -e "${RED}Error: You have uncommitted changes. Please commit or stash them first.${NC}"
    exit 1
fi

# Pull latest changes
echo -e "${YELLOW}Pulling latest changes...${NC}"
git pull origin $BRANCH

# Install dependencies
echo -e "${YELLOW}Installing dependencies...${NC}"
bundle install
npm ci

# Run tests unless skipped
if [ "$SKIP_TESTS" != true ]; then
    echo -e "${YELLOW}Running tests...${NC}"
    
    # Run Jekyll HTML proofer
    bundle exec jekyll build --config $BUILD_CONFIG
    bundle exec htmlproofer ./_site \
        --disable-external \
        --allow-hash-href \
        --ignore-urls "#" \
        --ignore-files "./_site/assets/js/blog-automation.js" || true
    
    # Run JavaScript tests
    npm test || true
    
    # Run security audit
    bundle exec bundle-audit check || true
    npm audit --audit-level=moderate || true
fi

# Build the site unless skipped
if [ "$SKIP_BUILD" != true ]; then
    echo -e "${YELLOW}Building Jekyll site...${NC}"
    JEKYLL_ENV=$ENVIRONMENT bundle exec jekyll build --config $BUILD_CONFIG
    
    # Optimize assets
    echo -e "${YELLOW}Optimizing assets...${NC}"
    
    # Minify CSS (if installed)
    if command -v csso &> /dev/null; then
        find _site/assets/css -name "*.css" -exec csso {} -o {} \;
    fi
    
    # Minify JavaScript (if installed)
    if command -v terser &> /dev/null; then
        find _site/assets/js -name "*.js" -exec terser {} -o {} -c -m \;
    fi
    
    # Optimize images (if installed)
    if command -v optipng &> /dev/null; then
        find _site/assets/images -name "*.png" -exec optipng -o2 {} \;
    fi
fi

# Deploy based on environment
if [ "$ENVIRONMENT" == "production" ]; then
    echo -e "${YELLOW}Deploying to production...${NC}"
    
    # Create a production tag
    VERSION="v$(date +%Y.%m.%d-%H%M%S)"
    git tag -a $VERSION -m "Production deployment $VERSION"
    git push origin $VERSION
    
    # Deploy to GitHub Pages
    if [ -d "_site" ]; then
        cd _site
        git init
        git add -A
        git commit -m "Deploy to GitHub Pages - $VERSION"
        git push -f git@github.com:Shiki0138/leadfive.git main:gh-pages
        cd ..
    fi
    
    echo -e "${GREEN}Production deployment complete! Version: $VERSION${NC}"
    
elif [ "$ENVIRONMENT" == "staging" ]; then
    echo -e "${YELLOW}Deploying to staging...${NC}"
    
    # Deploy to staging branch
    if [ -d "_site" ]; then
        cd _site
        git init
        git add -A
        git commit -m "Deploy to staging - $(date +%Y-%m-%d_%H-%M-%S)"
        git push -f git@github.com:Shiki0138/leadfive.git main:gh-pages-staging
        cd ..
    fi
    
    echo -e "${GREEN}Staging deployment complete!${NC}"
fi

# Post-deployment tasks
echo -e "${YELLOW}Running post-deployment tasks...${NC}"

# Clear CDN cache (if applicable)
# curl -X POST "https://api.cloudflare.com/client/v4/zones/YOUR_ZONE_ID/purge_cache" \
#      -H "Authorization: Bearer YOUR_API_TOKEN" \
#      -H "Content-Type: application/json" \
#      --data '{"purge_everything":true}'

# Send deployment notification
if [ "$ENVIRONMENT" == "production" ]; then
    echo "Production deployment completed at $(date)" | mail -s "LeadFive Production Deployment" team@leadfive.com || true
fi

# Run smoke tests
echo -e "${YELLOW}Running smoke tests...${NC}"
if [ "$ENVIRONMENT" == "production" ]; then
    SITE_URL="https://leadfive.com"
else
    SITE_URL="https://staging.leadfive.com"
fi

# Check if site is accessible
if curl -s -o /dev/null -w "%{http_code}" $SITE_URL | grep -q "200"; then
    echo -e "${GREEN}Site is accessible at $SITE_URL${NC}"
else
    echo -e "${RED}Warning: Site may not be accessible at $SITE_URL${NC}"
fi

echo -e "${GREEN}Deployment complete!${NC}"