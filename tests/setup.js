// Test setup file
require('dotenv').config({ path: '.env.test' });

// Mock console methods to avoid cluttering test output
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JEKYLL_ENV = 'test';

// Global test utilities
global.testUtils = {
  // Utility to create mock request objects
  createMockRequest: (overrides = {}) => ({
    method: 'GET',
    url: '/',
    headers: {},
    body: {},
    params: {},
    query: {},
    ...overrides
  }),

  // Utility to create mock response objects
  createMockResponse: () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    res.set = jest.fn().mockReturnValue(res);
    return res;
  },

  // Utility to wait for async operations
  waitFor: (condition, timeout = 5000) => {
    return new Promise((resolve, reject) => {
      const interval = 100;
      let elapsed = 0;
      
      const check = () => {
        if (condition()) {
          resolve();
        } else if (elapsed >= timeout) {
          reject(new Error('Timeout waiting for condition'));
        } else {
          elapsed += interval;
          setTimeout(check, interval);
        }
      };
      
      check();
    });
  }
};

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
});