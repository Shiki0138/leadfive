// Performance monitoring and error tracking setup
// This script can be included in the Jekyll site for real user monitoring

(function() {
  'use strict';

  // Performance monitoring
  const performanceMonitor = {
    init: function() {
      if ('performance' in window && 'PerformanceObserver' in window) {
        this.observeMetrics();
        this.trackPageLoad();
        this.trackResources();
      }
    },

    observeMetrics: function() {
      // Observe Largest Contentful Paint
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          this.sendMetric('lcp', lastEntry.renderTime || lastEntry.loadTime);
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        console.error('LCP Observer failed:', e);
      }

      // Observe First Input Delay
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach(entry => {
            this.sendMetric('fid', entry.processingStart - entry.startTime);
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
      } catch (e) {
        console.error('FID Observer failed:', e);
      }

      // Observe Cumulative Layout Shift
      try {
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach(entry => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          this.sendMetric('cls', clsValue);
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (e) {
        console.error('CLS Observer failed:', e);
      }
    },

    trackPageLoad: function() {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const timing = performance.timing;
          const metrics = {
            // Navigation timing
            dns: timing.domainLookupEnd - timing.domainLookupStart,
            tcp: timing.connectEnd - timing.connectStart,
            ttfb: timing.responseStart - timing.navigationStart,
            domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
            windowLoad: timing.loadEventEnd - timing.navigationStart,
            
            // Resource timing
            resources: performance.getEntriesByType('resource').length,
            
            // Paint timing
            fp: this.getPaintTiming('first-paint'),
            fcp: this.getPaintTiming('first-contentful-paint'),
            
            // Memory usage (if available)
            memory: this.getMemoryUsage()
          };

          this.sendMetrics('pageLoad', metrics);
        }, 0);
      });
    },

    trackResources: function() {
      window.addEventListener('load', () => {
        const resources = performance.getEntriesByType('resource');
        const resourceMetrics = {
          total: resources.length,
          byType: {},
          slowest: []
        };

        // Group by type
        resources.forEach(resource => {
          const type = this.getResourceType(resource.name);
          if (!resourceMetrics.byType[type]) {
            resourceMetrics.byType[type] = {
              count: 0,
              totalDuration: 0,
              totalSize: 0
            };
          }
          
          resourceMetrics.byType[type].count++;
          resourceMetrics.byType[type].totalDuration += resource.duration;
          
          if (resource.encodedBodySize) {
            resourceMetrics.byType[type].totalSize += resource.encodedBodySize;
          }
        });

        // Find slowest resources
        resourceMetrics.slowest = resources
          .sort((a, b) => b.duration - a.duration)
          .slice(0, 5)
          .map(r => ({
            name: r.name,
            duration: Math.round(r.duration),
            size: r.encodedBodySize || 0
          }));

        this.sendMetrics('resources', resourceMetrics);
      });
    },

    getPaintTiming: function(name) {
      const entries = performance.getEntriesByType('paint');
      const entry = entries.find(e => e.name === name);
      return entry ? Math.round(entry.startTime) : null;
    },

    getMemoryUsage: function() {
      if (performance.memory) {
        return {
          usedJSHeapSize: Math.round(performance.memory.usedJSHeapSize / 1048576),
          totalJSHeapSize: Math.round(performance.memory.totalJSHeapSize / 1048576),
          limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576)
        };
      }
      return null;
    },

    getResourceType: function(url) {
      if (/\.js(\?|$)/i.test(url)) return 'script';
      if (/\.css(\?|$)/i.test(url)) return 'stylesheet';
      if (/\.(jpg|jpeg|png|gif|svg|webp)(\?|$)/i.test(url)) return 'image';
      if (/\.(woff|woff2|ttf|eot)(\?|$)/i.test(url)) return 'font';
      if (/\.(mp4|webm|ogg)(\?|$)/i.test(url)) return 'video';
      return 'other';
    },

    sendMetric: function(name, value) {
      // Send to analytics endpoint
      if (window.ga) {
        ga('send', 'event', 'Performance', name, null, Math.round(value));
      }
      
      // Could also send to custom endpoint
      // this.sendToEndpoint('/api/metrics', { name, value, timestamp: Date.now() });
    },

    sendMetrics: function(category, metrics) {
      console.log(`[Performance] ${category}:`, metrics);
      
      // Send to analytics
      if (window.ga) {
        Object.keys(metrics).forEach(key => {
          if (typeof metrics[key] === 'number') {
            ga('send', 'event', 'Performance', `${category}.${key}`, null, Math.round(metrics[key]));
          }
        });
      }
    }
  };

  // Error tracking
  const errorTracker = {
    init: function() {
      this.trackJavaScriptErrors();
      this.trackResourceErrors();
      this.trackUnhandledRejections();
    },

    trackJavaScriptErrors: function() {
      window.addEventListener('error', (event) => {
        const error = {
          type: 'javascript',
          message: event.message,
          filename: event.filename,
          line: event.lineno,
          column: event.colno,
          stack: event.error ? event.error.stack : 'No stack trace',
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
          url: window.location.href
        };

        this.reportError(error);
      });
    },

    trackResourceErrors: function() {
      window.addEventListener('error', (event) => {
        if (event.target !== window) {
          const error = {
            type: 'resource',
            tagName: event.target.tagName,
            source: event.target.src || event.target.href,
            message: `Failed to load ${event.target.tagName}`,
            timestamp: new Date().toISOString(),
            url: window.location.href
          };

          this.reportError(error);
        }
      }, true);
    },

    trackUnhandledRejections: function() {
      window.addEventListener('unhandledrejection', (event) => {
        const error = {
          type: 'unhandledRejection',
          reason: event.reason,
          promise: event.promise,
          timestamp: new Date().toISOString(),
          url: window.location.href
        };

        this.reportError(error);
      });
    },

    reportError: function(error) {
      console.error('[Error Tracker]', error);
      
      // Send to analytics
      if (window.ga) {
        ga('send', 'exception', {
          exDescription: `${error.type}: ${error.message}`,
          exFatal: false
        });
      }

      // Could send to error tracking service
      // this.sendToEndpoint('/api/errors', error);
    }
  };

  // Initialize monitoring
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      performanceMonitor.init();
      errorTracker.init();
    });
  } else {
    performanceMonitor.init();
    errorTracker.init();
  }

  // Expose for debugging
  window.siteMonitoring = {
    performance: performanceMonitor,
    errors: errorTracker
  };
})();