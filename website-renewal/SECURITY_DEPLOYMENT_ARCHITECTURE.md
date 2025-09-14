# Security & Deployment Architecture

## Security Architecture

### Overview
Comprehensive security strategy implementing defense-in-depth principles across application, infrastructure, and operational layers.

### Application Security

#### 1. Authentication & Authorization
```typescript
// lib/auth/auth-config.ts
export const authConfig = {
  providers: [
    // OAuth providers
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // Email magic links
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    encryption: true,
    secret: process.env.JWT_SECRET,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.permissions = user.permissions
      }
      return token
    },
    async session({ session, token }) {
      session.user.role = token.role
      session.user.permissions = token.permissions
      return session
    }
  }
}
```

#### 2. Input Validation & Sanitization
```typescript
// lib/security/validation.ts
import DOMPurify from 'isomorphic-dompurify'
import { z } from 'zod'

export class SecurityValidator {
  // XSS Prevention
  static sanitizeHTML(input: string): string {
    return DOMPurify.sanitize(input, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
      ALLOWED_ATTR: ['href', 'target', 'rel']
    })
  }
  
  // SQL Injection Prevention (parameterized queries)
  static sanitizeSQLParam(input: string): string {
    return input.replace(/['";\\]/g, '')
  }
  
  // Path Traversal Prevention
  static sanitizePath(path: string): string {
    return path.replace(/\.\./g, '').replace(/^\/+/, '')
  }
  
  // CSRF Token Generation
  static generateCSRFToken(): string {
    return crypto.randomBytes(32).toString('hex')
  }
}

// Middleware for request validation
export function validateRequest(schema: z.ZodSchema) {
  return async (req: Request) => {
    const body = await req.json()
    const result = schema.safeParse(body)
    
    if (!result.success) {
      throw new ValidationError(result.error)
    }
    
    return result.data
  }
}
```

#### 3. API Security
```typescript
// middleware/api-security.ts
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'

// Rate Limiting Configuration
export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP',
  standardHeaders: true,
  legacyHeaders: false,
})

// API-specific rate limits
export const apiLimits = {
  chat: rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // 10 messages per minute
  }),
  contact: rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // 5 submissions per hour
  }),
  generate: rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20, // 20 generations per hour
  })
}

// Security Headers
export const securityHeaders = {
  'X-DNS-Prefetch-Control': 'on',
  'X-Frame-Options': 'SAMEORIGIN',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy': `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: https: blob:;
    font-src 'self';
    connect-src 'self' https://api.openai.com https://blog.leadfive138.com;
    frame-ancestors 'none';
  `.replace(/\s+/g, ' ').trim()
}
```

#### 4. Secrets Management
```typescript
// lib/security/secrets.ts
export class SecretsManager {
  private static secrets = new Map<string, string>()
  
  static async initialize() {
    // Load from environment variables
    const requiredSecrets = [
      'OPENAI_API_KEY',
      'WP_APP_PASSWORD',
      'JWT_SECRET',
      'ENCRYPTION_KEY'
    ]
    
    for (const key of requiredSecrets) {
      const value = process.env[key]
      if (!value) {
        throw new Error(`Missing required secret: ${key}`)
      }
      this.secrets.set(key, value)
    }
  }
  
  static get(key: string): string {
    const secret = this.secrets.get(key)
    if (!secret) {
      throw new Error(`Secret not found: ${key}`)
    }
    return secret
  }
  
  // Encrypt sensitive data at rest
  static async encrypt(data: string): Promise<string> {
    const key = this.get('ENCRYPTION_KEY')
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv)
    
    const encrypted = Buffer.concat([
      cipher.update(data, 'utf8'),
      cipher.final()
    ])
    
    const authTag = cipher.getAuthTag()
    
    return Buffer.concat([iv, authTag, encrypted]).toString('base64')
  }
  
  static async decrypt(encryptedData: string): Promise<string> {
    const key = this.get('ENCRYPTION_KEY')
    const buffer = Buffer.from(encryptedData, 'base64')
    
    const iv = buffer.slice(0, 16)
    const authTag = buffer.slice(16, 32)
    const encrypted = buffer.slice(32)
    
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv)
    decipher.setAuthTag(authTag)
    
    return decipher.update(encrypted) + decipher.final('utf8')
  }
}
```

### Infrastructure Security

#### 1. Network Security
```yaml
# infrastructure/cloudflare-config.yaml
firewall_rules:
  - name: "Block Known Bad IPs"
    expression: "(ip.src in $bad_ips)"
    action: "block"
    
  - name: "Rate Limit by IP"
    expression: "(http.request.uri.path contains \"/api/\")"
    action: "challenge"
    ratelimit:
      threshold: 100
      period: 60
      
  - name: "Geo Blocking"
    expression: "(ip.geoip.country in {\"XX\" \"YY\"})"
    action: "block"

ddos_protection:
  enabled: true
  sensitivity: "high"
  
bot_management:
  enabled: true
  challenge_suspicious: true
  block_definitely_automated: true
```

#### 2. SSL/TLS Configuration
```nginx
# SSL Configuration
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
ssl_prefer_server_ciphers off;
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 10m;
ssl_stapling on;
ssl_stapling_verify on;

# HSTS
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
```

#### 3. Container Security
```dockerfile
# Dockerfile security best practices
FROM node:18-alpine AS base

# Run as non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Remove unnecessary files
RUN rm -rf .git .github .env* *.md

# Build
RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./

USER nextjs

EXPOSE 3000

CMD ["npm", "start"]
```

### Security Monitoring & Incident Response

#### 1. Security Monitoring Setup
```typescript
// lib/security/monitoring.ts
export class SecurityMonitor {
  private static incidents: SecurityIncident[] = []
  
  static async logSecurityEvent(event: SecurityEvent) {
    // Log to security monitoring service
    await fetch(process.env.SECURITY_LOG_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SECURITY_LOG_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        event,
        environment: process.env.NODE_ENV,
        metadata: {
          userAgent: event.userAgent,
          ip: event.ip,
          url: event.url
        }
      })
    })
    
    // Check if incident threshold reached
    if (this.isIncident(event)) {
      await this.createIncident(event)
    }
  }
  
  static async createIncident(event: SecurityEvent) {
    const incident: SecurityIncident = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      severity: this.calculateSeverity(event),
      type: event.type,
      description: event.description,
      status: 'open'
    }
    
    this.incidents.push(incident)
    
    // Alert security team
    await this.alertSecurityTeam(incident)
  }
  
  private static calculateSeverity(event: SecurityEvent): 'low' | 'medium' | 'high' | 'critical' {
    const severityMap = {
      'failed-auth': 'low',
      'rate-limit': 'medium',
      'sql-injection': 'high',
      'xss-attempt': 'high',
      'unauthorized-access': 'critical'
    }
    
    return severityMap[event.type] || 'medium'
  }
}
```

#### 2. Incident Response Plan
```typescript
// lib/security/incident-response.ts
export class IncidentResponse {
  static async handleIncident(incident: SecurityIncident) {
    switch (incident.severity) {
      case 'critical':
        await this.criticalResponse(incident)
        break
      case 'high':
        await this.highResponse(incident)
        break
      case 'medium':
        await this.mediumResponse(incident)
        break
      case 'low':
        await this.lowResponse(incident)
        break
    }
  }
  
  private static async criticalResponse(incident: SecurityIncident) {
    // 1. Immediate containment
    await this.blockSuspiciousIP(incident.sourceIP)
    
    // 2. Alert all stakeholders
    await this.alertStakeholders(incident, ['security-team', 'cto', 'devops'])
    
    // 3. Enable enhanced monitoring
    await this.enableEnhancedMonitoring()
    
    // 4. Create incident report
    await this.createIncidentReport(incident)
  }
}
```

## Deployment Architecture

### Deployment Strategy

#### 1. Multi-Environment Setup
```yaml
# deployment/environments.yaml
environments:
  development:
    url: https://dev.leadfive138.com
    branch: develop
    auto_deploy: true
    
  staging:
    url: https://staging.leadfive138.com
    branch: staging
    auto_deploy: true
    approval_required: false
    
  production:
    url: https://leadfive138.com
    branch: main
    auto_deploy: false
    approval_required: true
    rollback_enabled: true
```

#### 2. CI/CD Pipeline
```yaml
# .github/workflows/deploy.yml
name: Deploy Pipeline

on:
  push:
    branches: [main, staging, develop]
  pull_request:
    branches: [main]

jobs:
  # Security Scanning
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Run Snyk Security Scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
          
      - name: Run SAST Analysis
        uses: github/super-linter@v4
        env:
          DEFAULT_BRANCH: main
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

  # Build & Test
  build:
    needs: security
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm run test:ci
        
      - name: Build application
        run: npm run build
        env:
          NEXT_PUBLIC_WP_URL: ${{ secrets.WP_URL }}
          
      - name: Run E2E tests
        run: npm run test:e2e
        
  # Deploy to Vercel
  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
          
      - name: Purge CDN Cache
        run: |
          curl -X POST "https://api.cloudflare.com/client/v4/zones/${{ secrets.CF_ZONE_ID }}/purge_cache" \
            -H "Authorization: Bearer ${{ secrets.CF_API_TOKEN }}" \
            -H "Content-Type: application/json" \
            --data '{"purge_everything":true}'
            
      - name: Run Smoke Tests
        run: npm run test:smoke
        env:
          PRODUCTION_URL: https://leadfive138.com
```

#### 3. Deployment Configuration
```typescript
// deployment/vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "headers": {
        "cache-control": "no-cache, no-store, must-revalidate"
      }
    },
    {
      "src": "/(.*)",
      "headers": {
        "cache-control": "public, max-age=3600, s-maxage=3600"
      }
    }
  ],
  "env": {
    "NEXT_PUBLIC_WP_URL": "@wp_url",
    "OPENAI_API_KEY": "@openai_api_key",
    "WP_APP_PASSWORD": "@wp_app_password"
  },
  "functions": {
    "app/api/ai/chat/route.ts": {
      "maxDuration": 30
    },
    "app/api/ai/generate/route.ts": {
      "maxDuration": 60
    }
  }
}
```

### Blue-Green Deployment

#### 1. Deployment Process
```typescript
// scripts/blue-green-deploy.ts
export class BlueGreenDeployment {
  async deploy() {
    // 1. Deploy to green environment
    const greenDeployment = await this.deployToGreen()
    
    // 2. Run health checks
    const healthCheck = await this.runHealthChecks(greenDeployment.url)
    
    if (!healthCheck.passed) {
      await this.rollback(greenDeployment)
      throw new Error('Health checks failed')
    }
    
    // 3. Gradual traffic shift
    await this.shiftTraffic([
      { percentage: 10, duration: 300 }, // 10% for 5 minutes
      { percentage: 50, duration: 600 }, // 50% for 10 minutes
      { percentage: 100, duration: 0 }   // 100% permanently
    ])
    
    // 4. Monitor metrics
    await this.monitorDeployment()
    
    // 5. Cleanup old deployment
    await this.cleanupBlueEnvironment()
  }
  
  async rollback(deployment: Deployment) {
    // Immediate rollback process
    await this.shiftTraffic([{ percentage: 0, duration: 0 }])
    await this.notifyTeam('Deployment rolled back', deployment)
  }
}
```

### Database Migration Strategy

#### 1. Migration Scripts
```typescript
// scripts/migrate.ts
export class DatabaseMigration {
  async migrate() {
    const migrations = await this.getPendingMigrations()
    
    for (const migration of migrations) {
      try {
        await this.backup()
        await this.runMigration(migration)
        await this.verify(migration)
        await this.recordMigration(migration)
      } catch (error) {
        await this.rollbackMigration(migration)
        throw error
      }
    }
  }
  
  async backup() {
    // Create database backup before migration
    const timestamp = new Date().toISOString()
    const backupName = `backup-${timestamp}.sql`
    
    await exec(`mysqldump -h ${DB_HOST} -u ${DB_USER} -p${DB_PASS} ${DB_NAME} > ${backupName}`)
    await this.uploadToS3(backupName)
  }
}
```

### Monitoring & Alerting

#### 1. Application Monitoring
```typescript
// lib/monitoring/app-monitor.ts
export class ApplicationMonitor {
  static initializeMonitoring() {
    // Performance monitoring
    if (typeof window !== 'undefined') {
      this.trackWebVitals()
      this.trackUserInteractions()
      this.trackErrors()
    }
    
    // Server monitoring
    if (typeof window === 'undefined') {
      this.trackAPIMetrics()
      this.trackServerResources()
    }
  }
  
  static trackWebVitals() {
    // Core Web Vitals
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.sendMetric({
          name: entry.name,
          value: entry.startTime,
          type: 'web-vital'
        })
      }
    }).observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] })
  }
}
```

#### 2. Infrastructure Monitoring
```yaml
# monitoring/alerts.yaml
alerts:
  - name: "High Error Rate"
    condition: "error_rate > 5%"
    duration: "5m"
    severity: "critical"
    channels: ["slack", "pagerduty"]
    
  - name: "Slow Response Time"
    condition: "response_time_p95 > 3000ms"
    duration: "10m"
    severity: "warning"
    channels: ["slack"]
    
  - name: "Memory Usage High"
    condition: "memory_usage > 85%"
    duration: "5m"
    severity: "warning"
    channels: ["slack", "email"]
    
  - name: "SSL Certificate Expiry"
    condition: "ssl_days_remaining < 30"
    severity: "warning"
    channels: ["email"]
```

### Disaster Recovery

#### 1. Backup Strategy
```yaml
# backup/strategy.yaml
backups:
  database:
    frequency: "daily"
    retention: "30 days"
    locations:
      - "s3://leadfive-backups/database/"
      - "glacier://leadfive-archive/database/"
      
  files:
    frequency: "weekly"
    retention: "90 days"
    locations:
      - "s3://leadfive-backups/files/"
      
  configurations:
    frequency: "on-change"
    retention: "unlimited"
    locations:
      - "git"
      - "s3://leadfive-backups/configs/"
```

#### 2. Recovery Procedures
```typescript
// scripts/disaster-recovery.ts
export class DisasterRecovery {
  async executeRecoveryPlan(incident: Incident) {
    const plan = this.getRecoveryPlan(incident.type)
    
    for (const step of plan.steps) {
      try {
        await this.executeStep(step)
        await this.verifyStep(step)
        await this.logProgress(step)
      } catch (error) {
        await this.escalate(step, error)
      }
    }
  }
  
  getRecoveryPlan(type: string): RecoveryPlan {
    const plans = {
      'data-loss': this.dataLossRecovery,
      'service-outage': this.serviceOutageRecovery,
      'security-breach': this.securityBreachRecovery
    }
    
    return plans[type] || this.genericRecovery
  }
}
```

---

**Document Version**: 1.0  
**Date**: 2025-08-05  
**Status**: Security & Deployment Architecture