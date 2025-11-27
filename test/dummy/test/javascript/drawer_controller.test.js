import { describe, test, expect, beforeEach, afterEach } from "bun:test"
import { screen, waitFor } from "@testing-library/dom"
import { Application } from "@hotwired/stimulus"

// Import the drawer controller from the engine
import DrawerController from "../../../../app/javascript/ui/controllers/drawer_controller.js"

describe("DrawerController - Vaul Implementation", () => {
  let application
  let container

  beforeEach(() => {
    // Setup Stimulus application
    application = Application.start()
    application.register("ui--drawer", DrawerController)

    // Create container
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  afterEach(() => {
    application.stop()
    document.body.innerHTML = ""
  })

  describe("Snap Points - Core Vaul Behavior", () => {
    test("drawer ALWAYS opens at FIRST snap point, not fully open", async () => {
      // Mock window.innerHeight for viewport-based calculations
      const originalInnerHeight = window.innerHeight
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 600
      })

      // This is critical Vaul behavior: drawer opens at snapPoints[0]
      container.innerHTML = `
        <div data-controller="ui--drawer"
             data-ui--drawer-open-value="true"
             data-ui--drawer-snap-points-value='[0.5, 1]'>
          <div data-ui--drawer-target="container" data-state="closed">
            <div data-ui--drawer-target="overlay"></div>
            <div data-ui--drawer-target="content" style="height: 600px">
              Drawer content
            </div>
          </div>
        </div>
      `

      // Mock content dimensions
      const content = container.querySelector('[data-ui--drawer-target="content"]')
      mockElementDimensions(content, { height: 600 })

      // Wait for Stimulus to connect the controller
      await new Promise(resolve => setTimeout(resolve, 10))

      const controller = application.getControllerForElementAndIdentifier(
        container.querySelector('[data-controller="ui--drawer"]'),
        "ui--drawer"
      )

      // Should be at first snap point (index 0)
      expect(controller.activeSnapPointValue).toBe(0)

      // Transform should position at first snap point (300px for 50% of 600px viewport)
      const transform = content.style.transform
      expect(transform).toContain("translate3d")
      expect(transform).toContain("300px") // viewport 600 - (0.5 * 600) = 300

      // Restore
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: originalInnerHeight
      })
    })

    test("getSnapPointY converts snap points to Y positions correctly", async () => {
      const originalInnerHeight = window.innerHeight
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 600
      })

      container.innerHTML = `
        <div data-controller="ui--drawer"
             data-ui--drawer-snap-points-value='[0.5, 1]'
             data-ui--drawer-direction-value="bottom">
          <div data-ui--drawer-target="content" style="height: 600px"></div>
        </div>
      `

      const content = container.querySelector('[data-ui--drawer-target="content"]')
      mockElementDimensions(content, { height: 600 })

      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--drawer"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--drawer")

      // For bottom drawer, Y = viewport - pixels
      // Snap 0.5 (50%): 300px visible → Y = 600 - 300 = 300px
      expect(controller.getSnapPointY(0)).toBe(300)

      // Snap 1.0 (100%): uses MOBILE_THRESHOLD = 80px
      expect(controller.getSnapPointY(1)).toBe(80)

      // Restore
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: originalInnerHeight
      })
    })

    test("supports pixel-based snap points", async () => {
      const originalInnerHeight = window.innerHeight
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 768
      })

      container.innerHTML = `
        <div data-controller="ui--drawer"
             data-ui--drawer-snap-points-value='["148px", "355px"]'>
          <div data-ui--drawer-target="content" style="height: 600px"></div>
        </div>
      `

      const content = container.querySelector('[data-ui--drawer-target="content"]')
      mockElementDimensions(content, { height: 600 })

      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--drawer"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--drawer")

      // "148px" → Y = viewport 768 - 148 = 620px
      expect(controller.getSnapPointY(0)).toBe(620)

      // "355px" → Y = viewport 768 - 355 = 413px
      expect(controller.getSnapPointY(1)).toBe(413)

      // Restore
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: originalInnerHeight
      })
    })

    test("handles snap points larger than drawer size gracefully", async () => {
      const originalInnerHeight = window.innerHeight
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 768
      })

      container.innerHTML = `
        <div data-controller="ui--drawer"
             data-ui--drawer-snap-points-value='["800px", 1]'>
          <div data-ui--drawer-target="content" style="height: 600px"></div>
        </div>
      `

      const content = container.querySelector('[data-ui--drawer-target="content"]')
      mockElementDimensions(content, { height: 600 })

      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--drawer"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--drawer")

      // "800px" > viewport 768px → 768 - 800 = -32px
      const snapY = controller.getSnapPointY(0)
      expect(snapY).toBe(-32) // Negative, but that's expected

      // Restore
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: originalInnerHeight
      })
    })
  })

  describe("findClosestSnapPointIndex - Y Position Based", () => {
    test("finds closest snap point based on Y position, not offsets", async () => {
      container.innerHTML = `
        <div data-controller="ui--drawer"
             data-ui--drawer-snap-points-value='[0.25, 0.5, 0.75, 1]'>
          <div data-ui--drawer-target="content" style="height: 800px"></div>
        </div>
      `

      const content = container.querySelector('[data-ui--drawer-target="content"]')
      mockElementDimensions(content, { height: 800 })

      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--drawer"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--drawer")

      // Snap points: [0.25, 0.5, 0.75, 1]
      // Y positions: [600, 400, 200, 0] for 800px drawer

      // At Y=50 (clearly closest to 0) → should choose index 3 (fully open)
      expect(controller.findClosestSnapPointIndex(50)).toBe(3)

      // At Y=210 (clearly closest to 200) → should choose index 2 (75%)
      expect(controller.findClosestSnapPointIndex(210)).toBe(2)

      // At Y=420 (clearly closest to 400) → should choose index 1 (50%)
      expect(controller.findClosestSnapPointIndex(420)).toBe(1)

      // At Y=590 (clearly closest to 600) → should choose index 0 (25%)
      expect(controller.findClosestSnapPointIndex(590)).toBe(0)
    })
  })

  describe("Transform During Drag - Pure Delta", () => {
    test("updateTransform uses pure delta, not offset calculations", async () => {
      container.innerHTML = `
        <div data-controller="ui--drawer"
             data-ui--drawer-direction-value="bottom">
          <div data-ui--drawer-target="content"></div>
        </div>
      `

      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--drawer"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--drawer")

      // During drag, should apply delta directly (Vaul approach)
      controller.updateTransform(150)

      const content = container.querySelector('[data-ui--drawer-target="content"]')
      expect(content.style.transform).toBe("translate3d(0, 150px, 0)")

      // Negative delta (dragging up)
      controller.updateTransform(-50)
      expect(content.style.transform).toBe("translate3d(0, -50px, 0)")
    })

    test("getTransformForDirection generates correct translate3d", async () => {
      container.innerHTML = `
        <div data-controller="ui--drawer" data-ui--drawer-direction-value="bottom">
          <div data-ui--drawer-target="content"></div>
        </div>
      `

      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--drawer"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--drawer")

      // Bottom drawer
      expect(controller.getTransformForDirection(100)).toBe("translate3d(0, 100px, 0)")
      expect(controller.getTransformForDirection(-50)).toBe("translate3d(0, -50px, 0)")
    })
  })

  describe("snapTo - Animates to Snap Point Y Position", () => {
    test("snaps to correct Y position and updates activeSnapPoint", async () => {
      const originalInnerHeight = window.innerHeight
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 600
      })

      container.innerHTML = `
        <div data-controller="ui--drawer"
             data-ui--drawer-snap-points-value='[0.5, 1]'>
          <div data-ui--drawer-target="content" style="height: 600px"></div>
        </div>
      `

      const content = container.querySelector('[data-ui--drawer-target="content"]')
      mockElementDimensions(content, { height: 600 })

      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--drawer"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--drawer")

      // Snap to index 1 (fully open, Y=80 due to MOBILE_THRESHOLD)
      controller.snapTo(1, false) // No animation for test

      expect(controller.activeSnapPointValue).toBe(1)
      expect(content.style.transform).toContain("translate3d(0, 80px, 0)")

      // Snap to index 0 (50%, Y=300)
      controller.snapTo(0, false)

      expect(controller.activeSnapPointValue).toBe(0)
      expect(content.style.transform).toContain("translate3d(0, 300px, 0)")

      // Restore
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: originalInnerHeight
      })
    })

    test("applies CSS transition when animated=true", async () => {
      container.innerHTML = `
        <div data-controller="ui--drawer"
             data-ui--drawer-snap-points-value='[0.5, 1]'>
          <div data-ui--drawer-target="content" style="height: 600px"></div>
        </div>
      `

      const content = container.querySelector('[data-ui--drawer-target="content"]')
      mockElementDimensions(content, { height: 600 })

      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--drawer"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--drawer")

      // Snap with animation
      controller.snapTo(1, true)

      // Should apply transition (controller uses 0.65s, not 0.5s)
      expect(content.style.transition).toContain("transform")
      expect(content.style.transition).toContain("0.65s")
      expect(content.style.transition).toContain("cubic-bezier")
    })
  })

  describe("State Management", () => {
    test("sets data-state=open on all targets when showing", async () => {
      container.innerHTML = `
        <div data-controller="ui--drawer"
             data-ui--drawer-open-value="true">
          <div data-ui--drawer-target="container">
            <div data-ui--drawer-target="overlay"></div>
            <div data-ui--drawer-target="content"></div>
          </div>
        </div>
      `

      await waitFor(() => {
        const containerEl = container.querySelector('[data-ui--drawer-target="container"]')
        expect(containerEl.getAttribute("data-state")).toBe("open")
      })

      const overlayEl = container.querySelector('[data-ui--drawer-target="overlay"]')
      const contentEl = container.querySelector('[data-ui--drawer-target="content"]')

      expect(overlayEl.getAttribute("data-state")).toBe("open")
      expect(contentEl.getAttribute("data-state")).toBe("open")
    })
  })

  describe("Direction Support", () => {
    test("calculates Y positions correctly for bottom direction", async () => {
      const originalInnerHeight = window.innerHeight
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 600
      })

      container.innerHTML = `
        <div data-controller="ui--drawer"
             data-ui--drawer-snap-points-value='[0.5]'
             data-ui--drawer-direction-value="bottom">
          <div data-ui--drawer-target="content" style="height: 600px"></div>
        </div>
      `

      const content = container.querySelector('[data-ui--drawer-target="content"]')
      mockElementDimensions(content, { height: 600 })

      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--drawer"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--drawer")

      // Bottom: Y = viewport - pixels
      expect(controller.getSnapPointY(0)).toBe(300)

      // Restore
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: originalInnerHeight
      })
    })

    test("calculates Y positions correctly for top direction", async () => {
      const originalInnerHeight = window.innerHeight
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 600
      })

      container.innerHTML = `
        <div data-controller="ui--drawer"
             data-ui--drawer-snap-points-value='[0.5]'
             data-ui--drawer-direction-value="top">
          <div data-ui--drawer-target="content" style="height: 600px"></div>
        </div>
      `

      const content = container.querySelector('[data-ui--drawer-target="content"]')
      mockElementDimensions(content, { height: 600 })

      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--drawer"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--drawer")

      // Top: Y = pixels
      expect(controller.getSnapPointY(0)).toBe(300)

      // Restore
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: originalInnerHeight
      })
    })
  })

  describe("Resize Handling", () => {
    test("maintains snap point position on resize", async () => {
      const originalInnerHeight = window.innerHeight
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 600
      })

      container.innerHTML = `
        <div data-controller="ui--drawer"
             data-ui--drawer-open-value="true"
             data-ui--drawer-snap-points-value='[0.5, 1]'>
          <div data-ui--drawer-target="content" style="height: 600px"></div>
        </div>
      `

      const content = container.querySelector('[data-ui--drawer-target="content"]')
      mockElementDimensions(content, { height: 600 })

      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--drawer"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--drawer")

      // Should be at first snap point (index 0)
      expect(controller.activeSnapPointValue).toBe(0)

      // Simulate resize by changing viewport height
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 800
      })
      mockElementDimensions(content, { height: 800 })
      controller.handleResize()

      // Should still be at snap point 0, but with new Y position
      expect(controller.activeSnapPointValue).toBe(0)

      // New Y for 0.5 on 800px viewport: 800 - 400 = 400px
      expect(content.style.transform).toContain("translate3d(0, 400px, 0)")

      // Restore
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: originalInnerHeight
      })
    })
  })

  describe("Mobile Focus Trap Behavior", () => {
    test("does NOT focus inputs on mobile to prevent keyboard popup", async () => {
      container.innerHTML = `
        <div data-controller="ui--drawer"
             data-ui--drawer-open-value="false">
          <div data-ui--drawer-target="container">
            <div data-ui--drawer-target="content">
              <input type="text" id="test-input" />
              <button id="test-button">Click</button>
            </div>
          </div>
        </div>
      `

      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--drawer"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--drawer")
      const input = container.querySelector('#test-input')
      const button = container.querySelector('#test-button')

      // Mock mobile environment
      const originalUserAgent = navigator.userAgent
      Object.defineProperty(navigator, 'userAgent', {
        get: () => 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15',
        configurable: true
      })

      // Open drawer
      controller.show()

      await new Promise(resolve => setTimeout(resolve, 10))

      // On mobile, should focus button instead of input
      expect(document.activeElement).not.toBe(input)
      expect(document.activeElement).toBe(button)

      // Restore
      Object.defineProperty(navigator, 'userAgent', {
        get: () => originalUserAgent,
        configurable: true
      })
    })

    test("DOES focus first element (including inputs) on desktop", async () => {
      container.innerHTML = `
        <div data-controller="ui--drawer"
             data-ui--drawer-open-value="false">
          <div data-ui--drawer-target="container">
            <div data-ui--drawer-target="content">
              <input type="text" id="test-input" />
              <button id="test-button">Click</button>
            </div>
          </div>
        </div>
      `

      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--drawer"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--drawer")
      const input = container.querySelector('#test-input')

      // Ensure desktop environment (default)
      // Open drawer
      controller.show()

      await new Promise(resolve => setTimeout(resolve, 10))

      // On desktop, should focus first element (input)
      expect(document.activeElement).toBe(input)
    })
  })

  describe("Velocity-Based Snap Point Skipping", () => {
    test("high velocity UP skips to NEXT snap point (more open)", async () => {
      container.innerHTML = `
        <div data-controller="ui--drawer"
             data-ui--drawer-open-value="true"
             data-ui--drawer-snap-points-value='[0.25, 0.5, 0.75, 1]'>
          <div data-ui--drawer-target="content" style="height: 800px"></div>
        </div>
      `

      const content = container.querySelector('[data-ui--drawer-target="content"]')
      mockElementDimensions(content, { height: 800 })

      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--drawer"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--drawer")

      // Start at snap point 1 (50% = index 1)
      controller.activeSnapPointValue = 1
      controller.snapTo(1, false)

      // Simulate high velocity upward drag (opening direction)
      // For the controller:
      //   - Positive velocity = closing direction (lower index)
      //   - Negative velocity = opening direction (higher index)
      // So for opening (going to next snap point), use negative velocity
      const mockRelease = {
        delta: -50,  // Small distance (doesn't matter for high velocity snap)
        velocity: -0.5  // Negative velocity = opening direction (above VELOCITY_THRESHOLD of 0.4)
      }

      // Should skip to index 2 (75%), not stay at 50%
      controller.handleSnapPointRelease(mockRelease.delta, mockRelease.velocity)

      // Should be at next snap point (index 2)
      expect(controller.activeSnapPointValue).toBe(2)
    })

    test("high velocity DOWN skips to PREVIOUS snap point (more closed)", async () => {
      container.innerHTML = `
        <div data-controller="ui--drawer"
             data-ui--drawer-open-value="true"
             data-ui--drawer-snap-points-value='[0.25, 0.5, 0.75, 1]'>
          <div data-ui--drawer-target="content" style="height: 800px"></div>
        </div>
      `

      const content = container.querySelector('[data-ui--drawer-target="content"]')
      mockElementDimensions(content, { height: 800 })

      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--drawer"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--drawer")

      // Start at snap point 2 (75% = index 2)
      controller.activeSnapPointValue = 2
      controller.snapTo(2, false)

      // Simulate high velocity downward drag (closing direction)
      // Velocity > 0.4, direction is closing (positive delta for bottom drawer)
      const mockRelease = {
        delta: 50,  // Small distance but high velocity
        velocity: 0.5  // Above VELOCITY_THRESHOLD (0.4)
      }

      // Should skip to index 1 (50%), not stay at 75%
      controller.handleSnapPointRelease(mockRelease.delta, mockRelease.velocity)

      // Should be at previous snap point (index 1)
      expect(controller.activeSnapPointValue).toBe(1)
    })

    test("low velocity snaps to CLOSEST point, not next/previous", async () => {
      container.innerHTML = `
        <div data-controller="ui--drawer"
             data-ui--drawer-open-value="true"
             data-ui--drawer-snap-points-value='[0.25, 0.5, 0.75, 1]'>
          <div data-ui--drawer-target="content" style="height: 800px"></div>
        </div>
      `

      const content = container.querySelector('[data-ui--drawer-target="content"]')
      mockElementDimensions(content, { height: 800 })

      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--drawer"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--drawer")

      // Start at snap point 1 (50%)
      controller.activeSnapPointValue = 1

      // Simulate slow drag to Y=250 (close to snap point 2 at Y=200)
      // Low velocity, should find closest
      const mockRelease = {
        delta: 250,  // Closer to index 2 (Y=200) than index 1 (Y=400)
        velocity: 0.1  // Below VELOCITY_THRESHOLD (0.4)
      }

      controller.handleSnapPointRelease(mockRelease.delta, mockRelease.velocity)

      // Should snap to closest point (index 2), not next from current
      expect(controller.activeSnapPointValue).toBe(2)
    })
  })

  describe("Overlay Fade with fadeFromIndex", () => {
    test("overlay starts with opacity 0 when opening at first snap BEFORE fadeFromIndex", async () => {
      container.innerHTML = `
        <div data-controller="ui--drawer"
             data-ui--drawer-open-value="false"
             data-ui--drawer-snap-points-value='[0.25, 0.5, 1]'
             data-ui--drawer-fade-from-index-value="1">
          <div data-ui--drawer-target="overlay"></div>
          <div data-ui--drawer-target="content" style="height: 800px"></div>
        </div>
      `

      const content = container.querySelector('[data-ui--drawer-target="content"]')
      const overlay = container.querySelector('[data-ui--drawer-target="overlay"]')
      mockElementDimensions(content, { height: 800 })

      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--drawer"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--drawer")

      // Open drawer - should start at snap point 0 (BEFORE fadeFromIndex)
      controller.show()

      await new Promise(resolve => setTimeout(resolve, 10))

      // Overlay should be transparent (opacity 0) since we're at index 0, which is before fadeFromIndex (1)
      expect(overlay.style.opacity).toBe("0")
      expect(controller.activeSnapPointValue).toBe(0)
    })

    test("overlay is HIDDEN before fadeFromIndex, VISIBLE at and after", async () => {
      container.innerHTML = `
        <div data-controller="ui--drawer"
             data-ui--drawer-open-value="true"
             data-ui--drawer-snap-points-value='[0.25, 0.5, 1]'
             data-ui--drawer-fade-from-index-value="1">
          <div data-ui--drawer-target="overlay"></div>
          <div data-ui--drawer-target="content" style="height: 800px"></div>
        </div>
      `

      const content = container.querySelector('[data-ui--drawer-target="content"]')
      const overlay = container.querySelector('[data-ui--drawer-target="overlay"]')
      mockElementDimensions(content, { height: 800 })

      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--drawer"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--drawer")

      // Snap points: [0.25, 0.5, 1]
      // Y positions: [600, 400, 0]
      // fadeFromIndex: 1 (Y=400), fadeEndIndex: 2 (Y=0)

      // At snap point 0 (25% open, Y=600) - BEFORE fadeFromIndex
      controller.updateOverlayOpacity(600)
      expect(overlay.style.opacity).toBe("0")  // NO overlay

      // At snap point 1 (50% open, Y=400) - AT fadeFromIndex (start of fade)
      controller.updateOverlayOpacity(400)
      expect(overlay.style.opacity).toBe("0")  // Fade starting (still 0)

      // At snap point 2 (100% open, Y=0) - AT fadeFromIndex + 1 (end of fade)
      controller.updateOverlayOpacity(0)
      expect(overlay.style.opacity).toBe("1")  // Fully visible
    })

    test("overlay appears gradually BETWEEN fadeFromIndex and fadeFromIndex+1", async () => {
      container.innerHTML = `
        <div data-controller="ui--drawer"
             data-ui--drawer-open-value="true"
             data-ui--drawer-snap-points-value='[0.25, 0.5, 1]'
             data-ui--drawer-fade-from-index-value="1">
          <div data-ui--drawer-target="overlay"></div>
          <div data-ui--drawer-target="content" style="height: 800px"></div>
        </div>
      `

      const content = container.querySelector('[data-ui--drawer-target="content"]')
      const overlay = container.querySelector('[data-ui--drawer-target="overlay"]')
      mockElementDimensions(content, { height: 800 })

      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--drawer"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--drawer")

      // Snap points: [0.25, 0.5, 1]
      // Y positions: [600, 400, 0]
      // fadeFromIndex: 1 (Y=400), fadeEndIndex: 2 (Y=0)

      // At Y=500 (before fadeFromIndex)
      controller.updateOverlayOpacity(500)
      expect(overlay.style.opacity).toBe("0")  // Still hidden

      // At fadeFromIndex (Y=400) - start of fade
      controller.updateOverlayOpacity(400)
      expect(overlay.style.opacity).toBe("0")  // Fade starting

      // At Y=200 (halfway between fadeFromIndex (400) and fadeEndIndex (0))
      controller.updateOverlayOpacity(200)
      const opacity200 = parseFloat(overlay.style.opacity)
      expect(opacity200).toBeGreaterThan(0)  // Overlay appearing
      expect(opacity200).toBeLessThan(1)     // But not fully visible yet

      // At fadeFromIndex+1 (Y=0) - fully visible
      controller.updateOverlayOpacity(0)
      expect(overlay.style.opacity).toBe("1")
    })

    test("fadeFromIndex defaults to 0 if not specified (overlay visible from first snap)", async () => {
      const originalInnerHeight = window.innerHeight
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 600
      })

      container.innerHTML = `
        <div data-controller="ui--drawer"
             data-ui--drawer-open-value="true"
             data-ui--drawer-snap-points-value='[0.5, 1]'>
          <div data-ui--drawer-target="overlay"></div>
          <div data-ui--drawer-target="content" style="height: 600px"></div>
        </div>
      `

      const content = container.querySelector('[data-ui--drawer-target="content"]')
      const overlay = container.querySelector('[data-ui--drawer-target="overlay"]')
      mockElementDimensions(content, { height: 600 })

      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--drawer"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--drawer")

      // Default fadeFromIndex should be 0
      // Y positions: [300, 80] (using viewport 600px and MOBILE_THRESHOLD)
      // fadeFromIndex: 0 (Y=300), fadeEndIndex: 1 (Y=80)

      // At Y=300 (first snap point, fadeFromIndex) - fade starting
      controller.updateOverlayOpacity(300)
      expect(overlay.style.opacity).toBe("0")  // Fade starting

      // At Y=190 (between snap 0 and snap 1) - fade in progress
      controller.updateOverlayOpacity(190)
      const opacity190 = parseFloat(overlay.style.opacity)
      expect(opacity190).toBeGreaterThan(0)  // Overlay appearing
      expect(opacity190).toBeLessThan(1)     // But not fully visible yet

      // At Y=80 (last snap point, fadeEndIndex) - fully visible
      controller.updateOverlayOpacity(80)
      expect(overlay.style.opacity).toBe("1")

      // Restore
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: originalInnerHeight
      })
    })

    test("overlay maintains opacity=1 after fade completes (fadeFromIndex=0)", async () => {
      const originalInnerHeight = window.innerHeight
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 800
      })

      container.innerHTML = `
        <div data-controller="ui--drawer"
             data-ui--drawer-open-value="true"
             data-ui--drawer-snap-points-value='[0.25, 0.5, 1]'
             data-ui--drawer-fade-from-index-value="0">
          <div data-ui--drawer-target="overlay"></div>
          <div data-ui--drawer-target="content" style="height: 800px"></div>
        </div>
      `

      const content = container.querySelector('[data-ui--drawer-target="content"]')
      const overlay = container.querySelector('[data-ui--drawer-target="overlay"]')
      mockElementDimensions(content, { height: 800 })

      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--drawer"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--drawer")

      // Snap points: [0.25, 0.5, 1]
      // Y positions: [600, 400, 80] (using viewport 800px and MOBILE_THRESHOLD)
      // fadeFromIndex: 0 (Y=600), fadeEndIndex: 1 (Y=400)

      // At snap 0 (Y=600) - start of fade
      controller.updateOverlayOpacity(600)
      expect(overlay.style.opacity).toBe("0")

      // Between snap 0 and snap 1 (Y=500) - fading in
      controller.updateOverlayOpacity(500)
      const opacity500 = parseFloat(overlay.style.opacity)
      expect(opacity500).toBeGreaterThan(0)
      expect(opacity500).toBeLessThan(1)

      // At snap 1 (Y=400) - fade complete
      controller.updateOverlayOpacity(400)
      expect(overlay.style.opacity).toBe("1")

      // Between snap 1 and snap 2 (Y=200) - should MAINTAIN opacity=1
      controller.updateOverlayOpacity(200)
      expect(overlay.style.opacity).toBe("1")

      // At snap 2 (Y=80) - should still be opacity=1
      controller.updateOverlayOpacity(80)
      expect(overlay.style.opacity).toBe("1")

      // Restore
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: originalInnerHeight
      })
    })

    test("overlay maintains opacity=1 DURING drag from snap 1 to snap 2 (fadeFromIndex=0)", async () => {
      const originalInnerHeight = window.innerHeight
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 800
      })

      container.innerHTML = `
        <div data-controller="ui--drawer"
             data-ui--drawer-open-value="true"
             data-ui--drawer-snap-points-value='[0.25, 0.5, 1]'
             data-ui--drawer-fade-from-index-value="0">
          <div data-ui--drawer-target="overlay"></div>
          <div data-ui--drawer-target="content" style="height: 800px"></div>
        </div>
      `

      const content = container.querySelector('[data-ui--drawer-target="content"]')
      const overlay = container.querySelector('[data-ui--drawer-target="overlay"]')
      mockElementDimensions(content, { height: 800 })

      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--drawer"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--drawer")

      // Snap points: [0.25, 0.5, 1]
      // Y positions: [600, 400, 80] (using viewport 800px and MOBILE_THRESHOLD)
      // fadeFromIndex: 0 (Y=600), fadeEndIndex: 1 (Y=400)

      // Simulate being at snap 1 (Y=400) and starting to drag UP toward snap 2 (Y=80)
      controller.dragStartY = 400  // Currently at snap 1
      controller.activeSnapPointValue = 1

      // Start drag (delta = 0, still at snap 1)
      controller.updateTransform(0)
      expect(overlay.style.opacity).toBe("1")  // Should be 1 at snap 1

      // Drag halfway to snap 2 (delta = -200, finalDelta = 400 + (-200) = 200)
      controller.updateTransform(-200)
      expect(overlay.style.opacity).toBe("1")  // Should MAINTAIN 1 during drag

      // Drag almost to snap 2 (delta = -320, finalDelta = 400 + (-320) = 80)
      controller.updateTransform(-320)
      expect(overlay.style.opacity).toBe("1")  // Should still be 1

      // Drag to snap 2 (delta = -320, finalDelta = 400 + (-320) = 80)
      controller.updateTransform(-320)
      expect(overlay.style.opacity).toBe("1")  // Should be 1 at snap 2

      // Restore
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: originalInnerHeight
      })
    })
  })

  describe("Transition Management During Drag", () => {
    test("NO transition during drag for responsive feel", async () => {
      container.innerHTML = `
        <div data-controller="ui--drawer"
             data-ui--drawer-open-value="true">
          <div data-ui--drawer-target="content"></div>
        </div>
      `

      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--drawer"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--drawer")
      const content = container.querySelector('[data-ui--drawer-target="content"]')

      // Simulate drag start - startDrag() is what sets transition to "none"
      // In the real flow, handlePointerMove calls startDrag() when threshold is exceeded
      controller.startDrag()

      // During drag, updateTransform should NOT have transition
      controller.updateTransform(100)

      // Transition should be "none" during drag for responsive feel
      expect(content.style.transition).toBe("none")
    })

    test("smooth transition applied on snap release", async () => {
      container.innerHTML = `
        <div data-controller="ui--drawer"
             data-ui--drawer-snap-points-value='[0.5, 1]'>
          <div data-ui--drawer-target="content" style="height: 600px"></div>
        </div>
      `

      const content = container.querySelector('[data-ui--drawer-target="content"]')
      mockElementDimensions(content, { height: 600 })

      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--drawer"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--drawer")

      // Snap to a point with animation
      controller.snapTo(1, true)

      // Should have transition applied (controller uses 0.65s, not 0.5s)
      expect(content.style.transition).toContain("transform")
      expect(content.style.transition).toContain("0.65s")
      expect(content.style.transition).toContain("cubic-bezier")
    })
  })

  describe("Drag Behavior with Snap Points (Critical)", () => {
    test("drawer follows mouse 1:1 during drag WITHIN snap point bounds", async () => {
      container.innerHTML = `
        <div data-controller="ui--drawer"
             data-ui--drawer-open-value="true"
             data-ui--drawer-snap-points-value='[0.5, 1]'>
          <div data-ui--drawer-target="content" style="height: 600px"></div>
        </div>
      `

      const content = container.querySelector('[data-ui--drawer-target="content"]')
      mockElementDimensions(content, { height: 600 })

      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--drawer"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--drawer")

      // Drawer starts at snap 0 (50%): Y = 300
      expect(controller.activeSnapPointValue).toBe(0)

      // Simulate starting drag from snap point 0
      controller.dragStartY = 300

      // Drag 50px upward (opening more)
      const delta = -50
      const expectedFinalDelta = 300 + (-50) // = 250

      // During drag, drawer should be at exactly Y=250
      controller.updateTransform(delta)

      // Extract Y value from transform
      const transform = content.style.transform
      expect(transform).toContain('250px')
    })

    test("drawer does NOT snap during drag, only on drop", async () => {
      container.innerHTML = `
        <div data-controller="ui--drawer"
             data-ui--drawer-open-value="true"
             data-ui--drawer-snap-points-value='[0.25, 0.5, 0.75, 1]'>
          <div data-ui--drawer-target="content" style="height: 800px"></div>
        </div>
      `

      const content = container.querySelector('[data-ui--drawer-target="content"]')
      mockElementDimensions(content, { height: 800 })

      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--drawer"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--drawer")

      // Start at snap 0 (25%): Y = 600
      controller.activeSnapPointValue = 0
      controller.dragStartY = 600

      // Drag to position between snap 1 (Y=400) and snap 2 (Y=200)
      // Let's drag to Y=300 (halfway between 400 and 200)
      const delta = -300  // 600 + (-300) = 300

      // During drag - should be at EXACT position (no snapping)
      controller.updateTransform(delta)
      const transform = content.style.transform
      expect(transform).toContain('300px') // Exact position, NOT snapped to 400 or 200

      // Active snap point should still be 0 (doesn't change during drag)
      expect(controller.activeSnapPointValue).toBe(0)
    })

    test("on drop, drawer snaps to closest point with smooth transition", async () => {
      const originalInnerHeight = window.innerHeight
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 800
      })

      container.innerHTML = `
        <div data-controller="ui--drawer"
             data-ui--drawer-open-value="true"
             data-ui--drawer-snap-points-value='[0.25, 0.5, 0.75, 1]'>
          <div data-ui--drawer-target="content" style="height: 800px"></div>
        </div>
      `

      const content = container.querySelector('[data-ui--drawer-target="content"]')
      mockElementDimensions(content, { height: 800 })

      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--drawer"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--drawer")

      // Start at snap 1 (Y=400 for 0.5 on 800px viewport)
      controller.activeSnapPointValue = 1
      controller.dragStartY = 400

      // Drag to Y=250 (closer to snap 2 at Y=200 than snap 1 at Y=400)
      // Using negative delta (opening direction) to avoid closing
      const delta = -150  // 400 + (-150) = 250

      // Simulate drop (low velocity)
      controller.handleSnapPointRelease(250, 0.1)

      // Should snap to index 2 (closest)
      expect(controller.activeSnapPointValue).toBe(2)

      // Should have transition set for smooth animation
      expect(content.style.transition).toContain('transform')

      // Restore
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: originalInnerHeight
      })
    })

    test("drag calculation is consistent: dragStartY + delta = finalDelta", async () => {
      container.innerHTML = `
        <div data-controller="ui--drawer"
             data-ui--drawer-open-value="true"
             data-ui--drawer-snap-points-value='[0.5, 1]'>
          <div data-ui--drawer-target="content" style="height: 600px"></div>
        </div>
      `

      const content = container.querySelector('[data-ui--drawer-target="content"]')
      mockElementDimensions(content, { height: 600 })

      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--drawer"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--drawer")

      // Test multiple drag positions
      const testCases = [
        { dragStartY: 300, delta: -50, expected: 250 },
        { dragStartY: 300, delta: -100, expected: 200 },
        { dragStartY: 300, delta: 50, expected: 350 },
        { dragStartY: 0, delta: 100, expected: 100 },
      ]

      testCases.forEach(({ dragStartY, delta, expected }) => {
        controller.dragStartY = dragStartY
        controller.updateTransform(delta)

        const transform = content.style.transform
        expect(transform).toContain(`${expected}px`)
      })
    })
  })

  describe("Drag Behavior WITHOUT Snap Points", () => {
    test("drawer follows mouse normally when dragging to close", async () => {
      container.innerHTML = `
        <div data-controller="ui--drawer"
             data-ui--drawer-open-value="true">
          <div data-ui--drawer-target="content" style="height: 600px"></div>
        </div>
      `

      const content = container.querySelector('[data-ui--drawer-target="content"]')
      mockElementDimensions(content, { height: 600 })

      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--drawer"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--drawer")

      // No snap points - drawer is fully open at delta = 0
      // Drag down to close (positive delta)
      const delta = 100  // Closing 100px

      controller.updateTransform(delta)

      const transform = content.style.transform
      expect(transform).toContain('100px')  // Should move exactly 100px
    })

    test("drawer resists when trying to open beyond fully open (negative delta)", async () => {
      container.innerHTML = `
        <div data-controller="ui--drawer"
             data-ui--drawer-open-value="true">
          <div data-ui--drawer-target="content" style="height: 600px"></div>
        </div>
      `

      const content = container.querySelector('[data-ui--drawer-target="content"]')
      mockElementDimensions(content, { height: 600 })

      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--drawer"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--drawer")

      // Drawer is fully open (delta = 0)
      // Try to drag UP more (negative delta) - should resist
      const delta = -100  // Trying to open 100px more

      // Apply damping (this is normally called by handlePointerMove)
      const dampedDelta = controller.applyDamping(delta)

      // Then apply the damped delta to transform
      controller.updateTransform(dampedDelta)

      const transform = content.style.transform
      // Should NOT move full -100px, should have resistance
      // Expecting around -10px (10% of -100px due to resistance)
      const match = transform.match(/-?\d+\.?\d*px/)
      const actualDelta = parseFloat(match[0])

      expect(actualDelta).toBeGreaterThan(-15)  // Should be less than -15px (strong resistance)
      expect(actualDelta).toBeLessThan(0)       // But still negative (some movement allowed)
    })

    test("drawer does NOT close when continuing to drag up beyond limit", async () => {
      container.innerHTML = `
        <div data-controller="ui--drawer"
             data-ui--drawer-open-value="true">
          <div data-ui--drawer-target="content" style="height: 600px"></div>
        </div>
      `

      const content = container.querySelector('[data-ui--drawer-target="content"]')
      mockElementDimensions(content, { height: 600 })

      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--drawer"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--drawer")

      // Try to drag very far up (way beyond fully open)
      const delta = -500  // Extreme negative delta

      // Apply damping (this is normally called by handlePointerMove)
      const dampedDelta = controller.applyDamping(delta)

      // Then apply the damped delta to transform
      controller.updateTransform(dampedDelta)

      const transform = content.style.transform
      const match = transform.match(/-?\d+\.?\d*px/)
      const actualDelta = parseFloat(match[0])

      // Should still be negative (not flip to positive/closing)
      expect(actualDelta).toBeLessThan(0)
      // But should not be close to -500 (should have strong resistance)
      // With 10% resistance: -500 * 0.1 = -50px expected
      expect(actualDelta).toBeGreaterThan(-75)
    })
  })

  describe("snapToSequentialPoint Behavior", () => {
    test("with snapToSequentialPoint=true, ignores velocity and snaps to closest", async () => {
      container.innerHTML = `
        <div data-controller="ui--drawer"
             data-ui--drawer-open-value="true"
             data-ui--drawer-snap-points-value='[0.25, 0.5, 0.75, 1]'
             data-ui--drawer-snap-to-sequential-point-value="true">
          <div data-ui--drawer-target="content" style="height: 800px"></div>
        </div>
      `

      const content = container.querySelector('[data-ui--drawer-target="content"]')
      mockElementDimensions(content, { height: 800 })

      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--drawer"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--drawer")

      // Start at snap point 1 (50%)
      controller.activeSnapPointValue = 1

      // High velocity but should be IGNORED due to snapToSequentialPoint
      const mockRelease = {
        delta: 250,  // Closer to Y=200 (index 2)
        velocity: 0.8  // Very high velocity, normally would skip
      }

      controller.handleSnapPointRelease(mockRelease.delta, mockRelease.velocity)

      // Should snap to closest (index 2), NOT skip based on velocity
      expect(controller.activeSnapPointValue).toBe(2)
    })
  })

  describe("Open Animation", () => {
    test("animates drawer from off-screen when opening (bottom drawer with snap points)", async () => {
      const originalInnerHeight = window.innerHeight
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 800
      })

      container.innerHTML = `
        <div data-controller="ui--drawer"
             data-ui--drawer-open-value="false"
             data-ui--drawer-snap-points-value='[0.25, 0.5, 1]'
             data-ui--drawer-direction-value="bottom">
          <div data-ui--drawer-target="container">
            <div data-ui--drawer-target="content"></div>
          </div>
        </div>
      `

      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--drawer"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--drawer")

      // Mark as already opened before (so it animates on next open)
      controller.hasBeenOpened = true

      // Open the drawer
      controller.open()

      await new Promise(resolve => setTimeout(resolve, 10))

      // Should have transition
      const content = container.querySelector('[data-ui--drawer-target="content"]')
      expect(content.style.transition).toContain("transform")

      // Restore
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: originalInnerHeight
      })
    })

    test("animates drawer from off-screen when opening (bottom drawer without snap points)", async () => {
      const originalInnerHeight = window.innerHeight
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 800
      })

      container.innerHTML = `
        <div data-controller="ui--drawer"
             data-ui--drawer-open-value="false"
             data-ui--drawer-direction-value="bottom">
          <div data-ui--drawer-target="container">
            <div data-ui--drawer-target="content"></div>
          </div>
        </div>
      `

      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--drawer"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--drawer")

      // Mark as already opened before
      controller.hasBeenOpened = true

      // Open the drawer
      controller.open()

      await new Promise(resolve => setTimeout(resolve, 10))

      // Should animate to Y=0 (fully open)
      const content = container.querySelector('[data-ui--drawer-target="content"]')
      expect(content.style.transform).toBe("translate3d(0, 0, 0)")
      expect(content.style.transition).toContain("transform")

      // Restore
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: originalInnerHeight
      })
    })
  })

  describe("Close Animation", () => {
    test("animates drawer off-screen when closing (bottom drawer)", async () => {
      const originalInnerHeight = window.innerHeight
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 800
      })

      container.innerHTML = `
        <div data-controller="ui--drawer"
             data-ui--drawer-open-value="true"
             data-ui--drawer-direction-value="bottom">
          <div data-ui--drawer-target="content"></div>
        </div>
      `

      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--drawer"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--drawer")
      const content = container.querySelector('[data-ui--drawer-target="content"]')

      // Close the drawer
      controller.close()

      // Should animate to closed position (viewportHeight = 800px for bottom drawer)
      expect(content.style.transform).toBe("translate3d(0, 800px, 0)")

      // Should have transition
      expect(content.style.transition).toContain("transform")

      // Restore
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: originalInnerHeight
      })
    })

    test("animates drawer off-screen when closing (top drawer)", async () => {
      const originalInnerHeight = window.innerHeight
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 800
      })

      container.innerHTML = `
        <div data-controller="ui--drawer"
             data-ui--drawer-open-value="true"
             data-ui--drawer-direction-value="top">
          <div data-ui--drawer-target="content"></div>
        </div>
      `

      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--drawer"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--drawer")
      const content = container.querySelector('[data-ui--drawer-target="content"]')

      // Close the drawer
      controller.close()

      // Should animate to closed position (negative for top drawer)
      expect(content.style.transform).toBe("translate3d(0, -800px, 0)")

      // Should have transition
      expect(content.style.transition).toContain("transform")

      // Restore
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: originalInnerHeight
      })
    })
  })

  describe("Close from First Snap Point", () => {
    test("closes drawer when dragging BEYOND first snap point", async () => {
      const originalInnerHeight = window.innerHeight
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 800
      })

      container.innerHTML = `
        <div data-controller="ui--drawer"
             data-ui--drawer-open-value="true"
             data-ui--drawer-snap-points-value='[0.25, 0.5, 1]'>
          <div data-ui--drawer-target="container" data-state="open">
            <div data-ui--drawer-target="content" style="height: 800px"></div>
          </div>
        </div>
      `

      const content = container.querySelector('[data-ui--drawer-target="content"]')
      mockElementDimensions(content, { height: 800 })

      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--drawer"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--drawer")

      // Should be at first snap point (index 0, Y=600 for 0.25 on 800px viewport)
      expect(controller.activeSnapPointValue).toBe(0)

      // Simulate dragging down BEYOND first snap point (Y > 600)
      const delta = 650 // Current Y position after dragging (beyond first snap at Y=600)
      const velocity = 0.2 // Low velocity

      // Call handleSnapPointRelease directly
      controller.handleSnapPointRelease(delta, velocity)

      // Should animate to closed position (drawer still open during animation)
      await new Promise(resolve => setTimeout(resolve, 10))
      expect(controller.openValue).toBe(true) // Still open during animation

      // After animation completes, should close the drawer
      // Controller uses 0.65s (650ms) duration, so wait 750ms to be safe
      await new Promise(resolve => setTimeout(resolve, 750))
      expect(controller.openValue).toBe(false)

      // Restore
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: originalInnerHeight
      })
    })

    test("does NOT close when dragging within first snap point range", async () => {
      const originalInnerHeight = window.innerHeight
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 800
      })

      container.innerHTML = `
        <div data-controller="ui--drawer"
             data-ui--drawer-open-value="true"
             data-ui--drawer-snap-points-value='[0.25, 0.5, 1]'>
          <div data-ui--drawer-target="container" data-state="open">
            <div data-ui--drawer-target="content" style="height: 800px"></div>
          </div>
        </div>
      `

      const content = container.querySelector('[data-ui--drawer-target="content"]')
      mockElementDimensions(content, { height: 800 })

      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--drawer"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--drawer")

      // Should be at first snap point (index 0, Y=600)
      expect(controller.activeSnapPointValue).toBe(0)

      // Simulate dragging slightly down but NOT beyond first snap point (Y=590, still < 600)
      const delta = 590 // Current Y position (not beyond first snap at Y=600)
      const velocity = 0.2 // Low velocity

      // Call handleSnapPointRelease directly
      controller.handleSnapPointRelease(delta, velocity)

      // Should NOT close, should stay at first snap point
      await new Promise(resolve => setTimeout(resolve, 10))
      expect(controller.openValue).toBe(true)
      expect(controller.activeSnapPointValue).toBe(0)

      // Restore
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: originalInnerHeight
      })
    })

    test("does NOT close when dragging down from second or later snap points", async () => {
      const originalInnerHeight = window.innerHeight
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 800
      })

      container.innerHTML = `
        <div data-controller="ui--drawer"
             data-ui--drawer-open-value="true"
             data-ui--drawer-snap-points-value='[0.25, 0.5, 1]'>
          <div data-ui--drawer-target="container" data-state="open">
            <div data-ui--drawer-target="content" style="height: 800px"></div>
          </div>
        </div>
      `

      const content = container.querySelector('[data-ui--drawer-target="content"]')
      mockElementDimensions(content, { height: 800 })

      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--drawer"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--drawer")

      // Move to second snap point (Y=400 for snap 0.5 on 800px viewport)
      controller.activeSnapPointValue = 1
      controller.snapTo(1, false)

      expect(controller.activeSnapPointValue).toBe(1)

      // Simulate dragging down from second snap point (Y=400)
      // Drag to Y=550 which is closer to snap 0 (Y=600) than snap 2 (Y=80)
      const delta = 550 // Current Y position after dragging down
      const velocity = 0.2 // Low velocity

      controller.handleSnapPointRelease(delta, velocity)

      // Should snap to closest point (first snap point), NOT close
      await new Promise(resolve => setTimeout(resolve, 10))
      expect(controller.openValue).toBe(true) // Still open
      expect(controller.activeSnapPointValue).toBe(0) // Snapped to first point

      // Restore
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: originalInnerHeight
      })
    })
  })

  describe("Viewport-Based Snap Point Calculations", () => {
    test("calculates snap points based on window.innerHeight, not content height", async () => {
      // Mock window.innerHeight for consistent testing
      const originalInnerHeight = window.innerHeight
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 800
      })

      container.innerHTML = `
        <div data-controller="ui--drawer"
             data-ui--drawer-snap-points-value='[0.25, 0.5, 1]'
             data-ui--drawer-direction-value="bottom">
          <div data-ui--drawer-target="content" style="height: 400px"></div>
        </div>
      `

      const content = container.querySelector('[data-ui--drawer-target="content"]')
      mockElementDimensions(content, { height: 400 })

      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--drawer"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--drawer")

      // Snap 0.25 (25% of viewport, not content)
      // pixels = 0.25 * 800 = 200
      // yPosition = 800 - 200 = 600 (for bottom drawer)
      expect(controller.getSnapPointY(0)).toBe(600)

      // Snap 0.5 (50% of viewport)
      // pixels = 0.5 * 800 = 400
      // yPosition = 800 - 400 = 400
      expect(controller.getSnapPointY(1)).toBe(400)

      // Snap 1.0 (100% of viewport)
      // Should return MOBILE_THRESHOLD (80) to keep handle accessible
      expect(controller.getSnapPointY(2)).toBe(80)

      // Restore
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: originalInnerHeight
      })
    })

    test("applies MOBILE_THRESHOLD for 100% snap point to keep handle accessible", async () => {
      const originalInnerHeight = window.innerHeight
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 863
      })

      container.innerHTML = `
        <div data-controller="ui--drawer"
             data-ui--drawer-snap-points-value='[0.25, 0.5, 1]'
             data-ui--drawer-direction-value="bottom">
          <div data-ui--drawer-target="content"></div>
        </div>
      `

      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--drawer"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--drawer")

      // For snap point 1 (100%): yPosition should be MOBILE_THRESHOLD (80px)
      // NOT 0, to prevent handle from hiding behind mobile browser address bar
      const yPosition = controller.getSnapPointY(2)
      expect(yPosition).toBe(80)

      // Verify other snap points DON'T use threshold
      // Snap 0.25: pixels = 0.25 * 863 = 215.75, yPosition = 863 - 215.75 = 647.25
      const y025 = controller.getSnapPointY(0)
      expect(y025).toBeCloseTo(647.25, 1)

      // Snap 0.5: pixels = 0.5 * 863 = 431.5, yPosition = 863 - 431.5 = 431.5
      const y05 = controller.getSnapPointY(1)
      expect(y05).toBeCloseTo(431.5, 1)

      // Restore
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: originalInnerHeight
      })
    })

    test("percentage calculations are correct for different viewport sizes", async () => {
      const originalInnerHeight = window.innerHeight

      // Test with viewport height 1000px
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 1000
      })

      container.innerHTML = `
        <div data-controller="ui--drawer"
             data-ui--drawer-snap-points-value='[0.25, 0.5, 0.75, 1]'
             data-ui--drawer-direction-value="bottom">
          <div data-ui--drawer-target="content"></div>
        </div>
      `

      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--drawer"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--drawer")

      // Snap 0.25: 25% of 1000 = 250px visible, yPosition = 1000 - 250 = 750
      expect(controller.getSnapPointY(0)).toBe(750)

      // Snap 0.5: 50% of 1000 = 500px visible, yPosition = 1000 - 500 = 500
      expect(controller.getSnapPointY(1)).toBe(500)

      // Snap 0.75: 75% of 1000 = 750px visible, yPosition = 1000 - 750 = 250
      expect(controller.getSnapPointY(2)).toBe(250)

      // Snap 1.0: MOBILE_THRESHOLD
      expect(controller.getSnapPointY(3)).toBe(80)

      // Restore
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: originalInnerHeight
      })
    })

    test("viewport calculations work correctly for top drawer direction", async () => {
      const originalInnerHeight = window.innerHeight
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 800
      })

      container.innerHTML = `
        <div data-controller="ui--drawer"
             data-ui--drawer-snap-points-value='[0.25, 0.5, 1]'
             data-ui--drawer-direction-value="top">
          <div data-ui--drawer-target="content"></div>
        </div>
      `

      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--drawer"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--drawer")

      // For top drawer: yPosition = pixels (not containerSize - pixels)
      // Snap 0.25: pixels = 0.25 * 800 = 200, yPosition = 200
      expect(controller.getSnapPointY(0)).toBe(200)

      // Snap 0.5: pixels = 0.5 * 800 = 400, yPosition = 400
      expect(controller.getSnapPointY(1)).toBe(400)

      // Snap 1.0: pixels = (800 - 80) = 720, yPosition = 720
      // Note: Top drawer also uses threshold for 100% snap
      expect(controller.getSnapPointY(2)).toBe(720)

      // Restore
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: originalInnerHeight
      })
    })
  })

  describe("Key Learnings from Refactoring", () => {
    test("NO offset pre-calculation, Y positions calculated on-demand", async () => {
      const originalInnerHeight = window.innerHeight
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 600
      })

      container.innerHTML = `
        <div data-controller="ui--drawer"
             data-ui--drawer-snap-points-value='[0.5, 1]'>
          <div data-ui--drawer-target="content" style="height: 600px"></div>
        </div>
      `

      const content = container.querySelector('[data-ui--drawer-target="content"]')
      mockElementDimensions(content, { height: 600 })

      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--drawer"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--drawer")

      // Should NOT have snapPointOffsets property
      expect(controller.snapPointOffsets).toBeUndefined()

      // Should calculate Y on demand using viewport
      const y0 = controller.getSnapPointY(0)
      const y1 = controller.getSnapPointY(1)

      expect(y0).toBe(300) // viewport 600 - (0.5 * 600) = 300
      expect(y1).toBe(80)  // MOBILE_THRESHOLD

      // Restore
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: originalInnerHeight
      })
    })

    test("NO dragStartOffset during drag, pure delta", async () => {
      container.innerHTML = `
        <div data-controller="ui--drawer">
          <div data-ui--drawer-target="content"></div>
        </div>
      `

      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--drawer"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--drawer")

      // Simulate pointer down
      const mockEvent = {
        pointerId: 1,
        clientX: 0,
        clientY: 0,
        pointerType: "mouse",
        target: controller.contentTarget
      }

      controller.handlePointerDown(mockEvent)

      // Should NOT have dragStartOffset
      expect(controller.dragStartOffset).toBeUndefined()
    })
  })
})
