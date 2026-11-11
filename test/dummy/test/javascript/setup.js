// Test setup file
// Automatically loaded by Bun before running tests

import { afterEach, expect } from "bun:test"
import * as matchers from "@testing-library/jest-dom/matchers"
import { resetScrollLockState } from "../../../../app/javascript/ui/utils/scroll-lock-manager.js"
import { resetEscapeLayers } from "../../../../app/javascript/ui/utils/escape-key-manager.js"
import { resetFocusTraps } from "../../../../app/javascript/ui/utils/focus-trap-manager.js"
import { resetInert } from "../../../../app/javascript/ui/utils/inert-manager.js"
import { cleanup } from "./support/render.js"

// jest-dom matchers (toBeVisible, toHaveAccessibleName, toHaveFocus, ...)
expect.extend(matchers)

// Reset shared utility state between tests
afterEach(() => {
  // Stop the Stimulus app a render() started, so it can't connect the next
  // file's controllers a second time
  cleanup()
  resetScrollLockState()
  // Escape layers, focus traps and inert sets are module-level stacks; a test
  // that leaves an overlay open must not leak it into the next test
  resetEscapeLayers()
  resetFocusTraps()
  resetInert()
})

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
