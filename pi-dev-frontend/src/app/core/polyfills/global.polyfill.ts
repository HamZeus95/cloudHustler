/**
 * This polyfill adds the global object to the browser environment
 * to support libraries that rely on Node.js global object like SockJS
 */

// Define global as window for browser environments
(window as any).global = window;

// Add other Node.js specific globals that might be used by libraries
(window as any).process = {
  env: { NODE_ENV: 'production' }
};

// Add Buffer if needed - without using require
if (!(window as any).Buffer) {
  (window as any).Buffer = {
    isBuffer: () => false
  };
}