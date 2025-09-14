module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jquery: true
  },
  extends: [
    'standard'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    // Allow console for debugging
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    
    // Semicolons
    'semi': ['error', 'always'],
    
    // Spacing
    'space-before-function-paren': ['error', {
      anonymous: 'always',
      named: 'never',
      asyncArrow: 'always'
    }],
    
    // Allow unused vars that start with _
    'no-unused-vars': ['error', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_'
    }],
    
    // Line length
    'max-len': ['warn', { 
      code: 120,
      ignoreUrls: true,
      ignoreStrings: true,
      ignoreTemplateLiterals: true
    }]
  },
  globals: {
    // Global variables used in the Jekyll site
    ga: 'readonly',
    gtag: 'readonly',
    performance: 'readonly',
    PerformanceObserver: 'readonly'
  },
  ignorePatterns: [
    '_site/**',
    'node_modules/**',
    'vendor/**',
    '*.min.js'
  ]
};