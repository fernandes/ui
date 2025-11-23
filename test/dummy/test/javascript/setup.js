// Test setup file
// Automatically loaded by Bun before running tests

import { GlobalRegistrator } from '@happy-dom/global-registrator';

// Register happy-dom globals (document, window, etc.)
GlobalRegistrator.register();

// Mock Element.setPointerCapture and releasePointerCapture for happy-dom
Element.prototype.setPointerCapture = Element.prototype.setPointerCapture || function() {}
Element.prototype.releasePointerCapture = Element.prototype.releasePointerCapture || function() {}

// Helper to mock element dimensions
global.mockElementDimensions = (element, { width, height }) => {
  if (width !== undefined) {
    Object.defineProperty(element, 'offsetWidth', {
      configurable: true,
      get: () => width
    })
    Object.defineProperty(element, 'clientWidth', {
      configurable: true,
      get: () => width
    })
  }
  if (height !== undefined) {
    Object.defineProperty(element, 'offsetHeight', {
      configurable: true,
      get: () => height
    })
    Object.defineProperty(element, 'clientHeight', {
      configurable: true,
      get: () => height
    })
  }
}

// Global test utilities
global.createMockElement = (tag, attributes = {}) => {
  const element = document.createElement(tag)
  Object.entries(attributes).forEach(([key, value]) => {
    if (key === 'class') {
      element.className = value
    } else if (key.startsWith('data-')) {
      element.setAttribute(key, value)
    } else {
      element[key] = value
    }
  })
  return element
}
