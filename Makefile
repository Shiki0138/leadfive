# Makefile for LeadFive Jekyll Website

.PHONY: help install dev build test deploy clean

# Default target
help:
	@echo "LeadFive Website Development Commands:"
	@echo "  make install      - Install all dependencies"
	@echo "  make dev         - Start development server"
	@echo "  make build       - Build site for production"
	@echo "  make test        - Run all tests"
	@echo "  make deploy      - Deploy to staging"
	@echo "  make deploy-prod - Deploy to production"
	@echo "  make clean       - Clean build artifacts"
	@echo "  make update      - Update all dependencies"
	@echo "  make security    - Run security checks"
	@echo "  make performance - Run performance tests"

# Install dependencies
install:
	@echo "Installing Ruby dependencies..."
	bundle install
	@echo "Installing Node dependencies..."
	npm ci
	@echo "Installing Playwright browsers..."
	npx playwright install

# Development server
dev:
	@echo "Starting development server..."
	npm run dev

# Build for production
build:
	@echo "Building for production..."
	npm run build:production

# Run all tests
test:
	@echo "Running unit tests..."
	npm run test:unit
	@echo "Running integration tests..."
	npm run test:integration
	@echo "Running E2E tests..."
	npm run test:e2e

# Quick test (unit tests only)
test-quick:
	npm run test:unit

# Deploy to staging
deploy:
	@echo "Deploying to staging..."
	npm run deploy:staging

# Deploy to production
deploy-prod:
	@echo "⚠️  WARNING: Deploying to PRODUCTION!"
	@echo "Press Ctrl+C to cancel, or Enter to continue..."
	@read confirm
	npm run deploy:production

# Clean build artifacts
clean:
	@echo "Cleaning build artifacts..."
	rm -rf _site
	rm -rf .jekyll-cache
	rm -rf coverage
	rm -rf test-results
	rm -rf node_modules/.cache

# Update dependencies
update:
	@echo "Updating Ruby dependencies..."
	bundle update
	@echo "Updating Node dependencies..."
	npm update
	@echo "Auditing dependencies..."
	npm audit fix

# Security checks
security:
	@echo "Running security checks..."
	npm run security:check

# Performance tests
performance:
	@echo "Running performance tests..."
	npm run performance:test

# Full CI pipeline locally
ci:
	@echo "Running full CI pipeline..."
	make clean
	make install
	make security
	make test
	make build
	make performance

# Watch tests
test-watch:
	npm run test:watch

# Coverage report
coverage:
	npm run test:coverage
	@echo "Coverage report generated in ./coverage/index.html"

# Lint code
lint:
	npm run lint

# Fix linting issues
lint-fix:
	npm run lint:fix

# Start monitoring
monitor:
	npm run monitor:start

# Generate images
images:
	npm run generate-images

# Full setup from scratch
setup: install
	@echo "Creating necessary directories..."
	mkdir -p tests/unit tests/integration tests/e2e/specs
	mkdir -p docs scripts .github/workflows
	@echo "Setup complete! Run 'make dev' to start development."