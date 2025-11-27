import { Controller } from "@hotwired/stimulus"

// Drawer controller for gesture-based mobile-first drawers
// Based on Vaul (https://vaul.emilkowal.ski)
//
// Features:
// - Drag-to-close with velocity detection
// - Four directions: bottom, top, left, right
// - Snap points support
// - Modal and non-modal modes
// - Handle-only dragging
// - Input repositioning for mobile keyboards
export default class extends Controller {
  static targets = ["container", "overlay", "content", "handle"]
  static values = {
    open: { type: Boolean, default: false },
    direction: { type: String, default: "bottom" },
    dismissible: { type: Boolean, default: true },
    modal: { type: Boolean, default: true },
    snapPoints: { type: Array, default: [] },
    activeSnapPoint: { type: Number, default: -1 },
    fadeFromIndex: { type: Number, default: -1 },
    snapToSequentialPoint: { type: Boolean, default: false },
    handleOnly: { type: Boolean, default: false },
    repositionInputs: { type: Boolean, default: true }
  }

  // Constants from Vaul
  TRANSITIONS = {
    DURATION: 0.65, // 650ms - increased from Vaul's 500ms for smoother perceived closing
    EASE: [0.32, 0.72, 0, 1] // Same easing for all animations (from Vaul original)
  }

  VELOCITY_THRESHOLD = 0.4 // px/ms - high velocity triggers immediate close/snap
  CLOSE_THRESHOLD = 0.25 // 25% of drawer height/width
  DRAG_CLASS = "vaul-dragging"
  SCROLL_LOCK_TIMEOUT = 500 // ms

  connect() {
    this.isPointerDown = false
    this.pointerStart = null
    this.dragStartTime = null
    this.isDragging = false
    this.lastPositions = [] // For velocity calculation
    this.lastScrollTime = 0
    this.hasBeenOpened = false
    this.dragStartY = 0 // Initial Y position when drag starts (for snap points)

    // Setup resize observer for snap point recalculation
    this.resizeObserver = new ResizeObserver(() => {
      this.handleResize()
    })
    if (this.hasContentTarget) {
      this.resizeObserver.observe(this.contentTarget)
    }

    if (this.openValue) {
      this.show()
    } else {
      // Set initial closed state
      if (this.hasContainerTarget) {
        this.containerTarget.setAttribute("data-state", "closed")
      }
      if (this.hasOverlayTarget) {
        this.overlayTarget.setAttribute("data-state", "closed")
      }
      if (this.hasContentTarget) {
        this.contentTarget.setAttribute("data-state", "closed")
      }
    }

    // Setup viewport resize handler for input repositioning
    if (this.repositionInputsValue && typeof visualViewport !== "undefined") {
      this.viewportResizeHandler = this.handleViewportResize.bind(this)
      visualViewport.addEventListener("resize", this.viewportResizeHandler)
    }
  }

  disconnect() {
    document.body.style.overflow = ""
    document.body.removeAttribute("data-scroll-locked")
    if (this.escapeHandler) {
      document.removeEventListener("keydown", this.escapeHandler)
    }
    if (this.preventScrollHandler) {
      document.removeEventListener("touchmove", this.preventScrollHandler)
    }
    if (this.viewportResizeHandler && typeof visualViewport !== "undefined") {
      visualViewport.removeEventListener("resize", this.viewportResizeHandler)
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect()
    }
  }

  // ============================================================================
  // PUBLIC ACTIONS
  // ============================================================================

  open() {
    this.openValue = true
    this.show()
  }

  close() {
    if (!this.dismissibleValue) return
    this.openValue = false
    this.hide()
  }

  closeOnOverlayClick(event) {
    if (this.dismissibleValue && this.modalValue) {
      this.animateToClosedPosition()
    }
  }

  // ============================================================================
  // POINTER EVENT HANDLERS
  // ============================================================================

  handlePointerDown(event) {
    // Ignore if handle-only mode and not dragging from handle
    if (this.handleOnlyValue && !this.isHandleEvent(event)) {
      return
    }

    // Check for opt-outs
    if (this.shouldIgnoreDrag(event)) {
      return
    }

    this.isPointerDown = true
    this.pointerStart = this.getPointerPosition(event)
    this.dragStartTime = Date.now()
    this.lastPositions = [{
      position: this.pointerStart,
      time: this.dragStartTime
    }]

    // Capture pointer for smooth drag
    if (this.hasContentTarget) {
      this.contentTarget.setPointerCapture(event.pointerId)
    }
  }

  handlePointerMove(event) {
    if (!this.isPointerDown) return

    const currentPos = this.getPointerPosition(event)
    const delta = this.getDelta(this.pointerStart, currentPos)

    // Check if drag threshold exceeded
    if (!this.isDragging) {
      const threshold = event.pointerType === "touch" ? 10 : 2
      if (Math.abs(delta) > threshold) {
        this.startDrag()
      } else {
        return
      }
    }

    // Update velocity tracking
    const now = Date.now()
    this.lastPositions.push({ position: currentPos, time: now })
    // Keep only last 5 positions for velocity calculation
    if (this.lastPositions.length > 5) {
      this.lastPositions.shift()
    }

    // Apply damping for opposite-direction drags
    const dampedDelta = this.applyDamping(delta)

    // Update transform
    this.updateTransform(dampedDelta)
  }

  handlePointerUp(event) {
    if (!this.isPointerDown) return

    this.isPointerDown = false

    if (this.hasContentTarget) {
      this.contentTarget.releasePointerCapture(event.pointerId)
    }

    if (!this.isDragging) return

    // Calculate velocity
    const velocity = this.calculateVelocity()
    const currentPos = this.getPointerPosition(event)
    const delta = this.getDelta(this.pointerStart, currentPos)
    const dampedDelta = this.applyDamping(delta)

    this.endDrag(dampedDelta, velocity)
  }

  handlePointerCancel(event) {
    this.handlePointerUp(event)
  }

  // ============================================================================
  // DRAG LOGIC
  // ============================================================================

  startDrag() {
    this.isDragging = true
    this.hasBeenOpened = true

    // Capture current drawer position for snap points
    // When drawer is at a snap point, we need to maintain that position as the base
    if (this.snapPointsValue && this.snapPointsValue.length > 0 && this.activeSnapPointValue >= 0) {
      this.dragStartY = this.getSnapPointY(this.activeSnapPointValue)
    } else {
      this.dragStartY = 0
    }

    // Add dragging class and clear any inline transitions
    if (this.hasContentTarget) {
      this.contentTarget.classList.add(this.DRAG_CLASS)
      // Clear any inline transition from previous snap/animations
      // This ensures smooth dragging without interference
      this.contentTarget.style.transition = "none"
    }

    // Dispatch drag start event
    this.element.dispatchEvent(new CustomEvent("drawer:drag:start", {
      bubbles: true,
      detail: { direction: this.directionValue }
    }))
  }

  updateTransform(delta) {
    if (!this.hasContentTarget) return

    // For snap points: add delta to the initial position
    // This ensures smooth dragging from the current snap point
    let finalDelta = delta
    if (this.snapPointsValue && this.snapPointsValue.length > 0) {
      finalDelta = this.dragStartY + delta
    }

    // Vaul approach: During drag, apply the calculated position
    const transform = this.getTransformForDirection(finalDelta)
    this.contentTarget.style.transform = transform

    // Update overlay opacity based on current position
    this.updateOverlayOpacity(finalDelta)
  }

  endDrag(delta, velocity) {
    this.isDragging = false

    // Remove dragging class to re-enable transitions
    if (this.hasContentTarget) {
      this.contentTarget.classList.remove(this.DRAG_CLASS)
    }

    // For snap points: calculate final position (initial + delta)
    let finalDelta = delta
    if (this.snapPointsValue && this.snapPointsValue.length > 0) {
      finalDelta = this.dragStartY + delta
    }

    // Decide: close, snap, or return to current position
    if (this.snapPointsValue.length > 0) {
      this.handleSnapPointRelease(finalDelta, velocity)
    } else {
      this.handleRegularRelease(delta, velocity)
    }

    // Dispatch drag end event
    this.element.dispatchEvent(new CustomEvent("drawer:drag:end", {
      bubbles: true,
      detail: {
        direction: this.directionValue,
        velocity,
        delta: finalDelta
      }
    }))
  }

  // ============================================================================
  // SNAP POINTS
  // ============================================================================

  // Convert snap point index to Y position (in pixels)
  // This is how Vaul does it - simple Y positions, no complex offsets
  getSnapPointY(snapIndex) {
    if (!this.snapPointsValue || snapIndex < 0 || snapIndex >= this.snapPointsValue.length) {
      return 0
    }

    const snapPoint = this.snapPointsValue[snapIndex]

    // Use window.innerHeight for viewport-based snap points
    const viewportHeight = window.innerHeight
    const viewportWidth = window.innerWidth

    // For mobile Safari: subtract threshold to account for browser UI (address bar, etc)
    // This ensures 100% snap point is always visible and accessible
    const MOBILE_THRESHOLD = 80

    let containerSize
    if (this.directionValue === "left" || this.directionValue === "right") {
      containerSize = viewportWidth
    } else {
      // For snap point 1 (100%): use viewport - threshold to keep handle accessible
      // For other snap points: use full viewport
      if (snapPoint === 1) {
        containerSize = viewportHeight - MOBILE_THRESHOLD
      } else {
        containerSize = viewportHeight
      }
    }

    if (containerSize === 0) return 0

    let pixels

    if (typeof snapPoint === 'string' && snapPoint.includes('px')) {
      // Explicit pixel value
      pixels = parseInt(snapPoint)
    } else if (snapPoint > 1) {
      // Percentage (1-100)
      pixels = (snapPoint / 100) * containerSize
    } else {
      // Decimal percentage (0-1)
      // 0.25 = 25% of viewport, 0.5 = 50% of viewport, 1 = 100% of viewport
      pixels = snapPoint * containerSize
    }

    // For bottom/right drawers: Y position = containerSize - pixels
    // More pixels visible = lower Y position (closer to 0)
    // For top/left drawers: Y position = pixels
    let yPosition
    if (this.directionValue === 'bottom' || this.directionValue === 'right') {
      yPosition = containerSize - pixels

      // Special case for snap 1 (100%): add threshold to prevent hiding behind browser UI
      if (snapPoint === 1) {
        yPosition = MOBILE_THRESHOLD
      }
    } else {
      yPosition = pixels
    }

    return yPosition
  }

  handleSnapPointRelease(delta, velocity) {
    if (!this.snapPointsValue || this.snapPointsValue.length === 0) {
      // No snap points configured
      this.close()
      return
    }

    const currentIndex = this.activeSnapPointValue >= 0 ? this.activeSnapPointValue : 0
    const currentY = delta

    // If at first snap point and dragging in closing direction
    if (currentIndex === 0 && this.isClosingDirection(delta)) {
      const firstSnapY = this.getSnapPointY(0)

      // Only close if dragged significantly beyond the first snap point
      // Check if current position is past the first snap point in closing direction
      const isDraggedBeyondFirstSnap = this.directionValue === "bottom" || this.directionValue === "right"
        ? currentY > firstSnapY  // For bottom/right, Y increases when closing
        : currentY < firstSnapY  // For top/left, Y decreases when closing

      if (isDraggedBeyondFirstSnap) {
        // Animate from current position to closed position
        this.animateToClosedPosition()
        return
      }
    }

    // Vaul approach: currentY is just the delta (drawer's current Y position)
    let targetIndex

    // High velocity - skip to next/previous snap point
    if (Math.abs(velocity) > this.VELOCITY_THRESHOLD && !this.snapToSequentialPointValue) {
      // Use VELOCITY to determine direction of movement, not delta
      // Positive velocity = moving in closing direction
      // Negative velocity = moving in opening direction
      if (velocity > 0) {
        // Moving toward closed - go to previous snap point (lower index = more closed)
        targetIndex = Math.max(currentIndex - 1, 0)
      } else {
        // Moving toward open - go to next snap point (higher index = more open)
        targetIndex = Math.min(currentIndex + 1, this.snapPointsValue.length - 1)
      }
    } else {
      // Low velocity - find closest snap point based on Y position
      targetIndex = this.findClosestSnapPointIndex(currentY)
    }

    this.snapTo(targetIndex)
  }

  handleRegularRelease(delta, velocity) {
    const drawerSize = this.getDrawerSize()
    const dragPercentage = Math.abs(delta) / drawerSize

    // High velocity in closing direction - immediate close
    if (Math.abs(velocity) > this.VELOCITY_THRESHOLD && this.isClosingDirection(delta)) {
      this.close()
      return
    }

    // Low velocity - use distance threshold
    if (dragPercentage > this.CLOSE_THRESHOLD && this.isClosingDirection(delta)) {
      this.close()
    } else {
      // Return to open position
      this.resetPosition()
    }
  }

  findClosestSnapPointIndex(currentY) {
    if (!this.snapPointsValue || this.snapPointsValue.length === 0) return 0

    let closestIndex = 0
    let closestDistance = Infinity

    this.snapPointsValue.forEach((_, index) => {
      const snapY = this.getSnapPointY(index)
      const distance = Math.abs(currentY - snapY)

      if (distance < closestDistance) {
        closestDistance = distance
        closestIndex = index
      }
    })

    return closestIndex
  }

  snapTo(snapPointIndex, animated = true) {
    if (snapPointIndex < 0 || snapPointIndex >= this.snapPointsValue.length) {
      return
    }

    this.activeSnapPointValue = snapPointIndex
    const snapPoint = this.snapPointsValue[snapPointIndex]
    const snapY = this.getSnapPointY(snapPointIndex)

    // Update transform to snap position
    if (this.hasContentTarget) {
      const currentTransform = this.contentTarget.style.transform
      const targetTransform = this.getTransformForSnapPoint(snapY)

      if (animated) {
        this.contentTarget.style.transition = `transform ${this.TRANSITIONS.DURATION}s cubic-bezier(${this.TRANSITIONS.EASE.join(',')})`
      }

      this.contentTarget.style.transform = targetTransform

      // Clear transition after animation
      if (animated) {
        setTimeout(() => {
          if (this.hasContentTarget) {
            this.contentTarget.style.transition = ""
          }
        }, this.TRANSITIONS.DURATION * 1000)
      }
    }

    // Update overlay opacity based on snap point
    this.updateOverlayOpacityForSnapPoint(snapPointIndex)

    // Dispatch snap event
    this.element.dispatchEvent(new CustomEvent("drawer:snap", {
      bubbles: true,
      detail: {
        snapPoint,
        snapPointIndex,
        y: snapY
      }
    }))
  }

  snapPointToPercentage(snapPoint) {
    if (snapPoint === 1) return 1 // Fully open
    if (typeof snapPoint === "number" && snapPoint < 1) return snapPoint // 0-1 percentage

    // Pixel value - convert to percentage
    const drawerSize = this.getDrawerSize()
    const pixels = parseInt(snapPoint)
    return Math.min(pixels / drawerSize, 1)
  }

  // ============================================================================
  // DIRECTION SUPPORT
  // ============================================================================

  // Get transform for snap point (uses pre-calculated offset)
  getTransformForSnapPoint(offset) {
    switch (this.directionValue) {
      case "bottom":
        return `translate3d(0, ${offset}px, 0)`
      case "top":
        return `translate3d(0, ${-offset}px, 0)`
      case "left":
        return `translate3d(${-offset}px, 0, 0)`
      case "right":
        return `translate3d(${offset}px, 0, 0)`
      default:
        return `translate3d(0, ${offset}px, 0)`
    }
  }

  // Get transform for drag delta (during drag)
  getTransformForDirection(delta) {
    switch (this.directionValue) {
      case "bottom":
        return `translate3d(0, ${delta}px, 0)`
      case "top":
        return `translate3d(0, ${-delta}px, 0)`
      case "left":
        return `translate3d(${-delta}px, 0, 0)`
      case "right":
        return `translate3d(${delta}px, 0, 0)`
      default:
        return `translate3d(0, ${delta}px, 0)`
    }
  }

  getDelta(start, current) {
    switch (this.directionValue) {
      case "bottom":
        return current.y - start.y // Positive = dragging down = closing
      case "top":
        return start.y - current.y // Positive = dragging up = closing
      case "left":
        return start.x - current.x // Positive = dragging left = closing
      case "right":
        return current.x - start.x // Positive = dragging right = closing
      default:
        return current.y - start.y
    }
  }

  isClosingDirection(delta) {
    // Positive delta means closing direction
    return delta > 0
  }

  getDrawerSize() {
    if (!this.hasContentTarget) return 0

    if (this.directionValue === "left" || this.directionValue === "right") {
      return this.contentTarget.offsetWidth
    } else {
      return this.contentTarget.offsetHeight
    }
  }

  getClosedPosition() {
    // Get viewport size for the drawer direction
    const viewportHeight = window.innerHeight
    const viewportWidth = window.innerWidth
    const drawerSize = this.getDrawerSize()

    // Return position that's completely off-screen based on direction
    // For drawer to be fully off-screen, it needs to move by viewport size + drawer size
    // Note: getTransformForDirection() will apply direction-specific transformations
    // So we return positive values and let that function handle the sign
    switch (this.directionValue) {
      case "bottom":
      case "top":
        // Move beyond viewport by drawer height to ensure it's fully off-screen
        return viewportHeight + drawerSize
      case "right":
      case "left":
        // Move beyond viewport by drawer width to ensure it's fully off-screen
        return viewportWidth + drawerSize
      default:
        return 0
    }
  }

  // ============================================================================
  // VELOCITY CALCULATION
  // ============================================================================

  calculateVelocity() {
    if (this.lastPositions.length < 2) return 0

    const latest = this.lastPositions[this.lastPositions.length - 1]
    const earliest = this.lastPositions[0]

    const timeDelta = latest.time - earliest.time
    if (timeDelta === 0) return 0

    const positionDelta = this.getDelta(earliest.position, latest.position)

    // Velocity in px/ms
    return positionDelta / timeDelta
  }

  // ============================================================================
  // DAMPING
  // ============================================================================

  applyDamping(delta) {
    // NO damping when using snap points - drawer should move freely between all snap points
    if (this.snapPointsValue && this.snapPointsValue.length > 0) {
      return delta
    }

    // Only apply damping for opposite-direction drags (trying to open more than fully open)
    if (!this.isClosingDirection(delta)) {
      // Apply constant 10% resistance (elastic boundary effect)
      // This creates a strong rubber band effect when trying to open beyond fully open
      return delta * 0.1
    }

    return delta
  }

  // ============================================================================
  // HELPERS
  // ============================================================================

  getPointerPosition(event) {
    return {
      x: event.clientX,
      y: event.clientY
    }
  }

  shouldIgnoreDrag(event) {
    // Check if text is selected
    const selection = window.getSelection()
    if (selection && selection.toString().length > 0) {
      return true
    }

    // Check for data-vaul-no-drag attribute
    if (event.target.closest("[data-vaul-no-drag]")) {
      return true
    }

    // Check if over scrollable content (and not at scroll top/bottom)
    const scrollableEl = event.target.closest("[data-vaul-scrollable]")
    if (scrollableEl) {
      const now = Date.now()
      if (now - this.lastScrollTime < this.SCROLL_LOCK_TIMEOUT) {
        return true
      }

      const isVertical = this.directionValue === "bottom" || this.directionValue === "top"

      if (isVertical) {
        const canScrollUp = scrollableEl.scrollTop > 0
        const canScrollDown = scrollableEl.scrollTop < scrollableEl.scrollHeight - scrollableEl.clientHeight

        if (canScrollUp || canScrollDown) {
          return true
        }
      }
    }

    return false
  }

  isHandleEvent(event) {
    if (!this.hasHandleTarget) return false
    return event.target === this.handleTarget || this.handleTarget.contains(event.target)
  }

  resetPosition() {
    if (!this.hasContentTarget) return
    // Animate back to open position
    this.contentTarget.style.transition = `transform ${this.TRANSITIONS.DURATION}s cubic-bezier(${this.TRANSITIONS.EASE.join(',')})`
    this.contentTarget.style.transform = "translate3d(0, 0, 0)"

    // Clear transition after animation
    setTimeout(() => {
      if (this.hasContentTarget) {
        this.contentTarget.style.transition = ""
        this.contentTarget.style.transform = ""
      }
    }, this.TRANSITIONS.DURATION * 1000)

    this.updateOverlayOpacity(0)
  }

  updateOverlayOpacity(delta) {
    if (!this.hasOverlayTarget) return
    if (!this.snapPointsValue || this.snapPointsValue.length === 0) return

    const currentY = delta

    // fadeFromIndex: overlay APPEARS starting from this snap point
    // Behavior:
    // 1. MORE OPEN than fadeEndIndex: opacity = 1 (ALWAYS)
    // 2. BETWEEN fadeFromIndex and fadeEndIndex: opacity gradual (0 → 1)
    // 3. MORE CLOSED than fadeFromIndex: opacity = 0
    let fadeIndex
    if (this.fadeFromIndexValue >= 0) {
      fadeIndex = this.fadeFromIndexValue
    } else {
      // When not specified, overlay visible from first snap point
      fadeIndex = 0
    }

    const fadeStartY = this.getSnapPointY(fadeIndex)
    const fadeEndIndex = Math.min(fadeIndex + 1, this.snapPointsValue.length - 1)
    const fadeEndY = this.getSnapPointY(fadeEndIndex)

    // 1. MORE OPEN than fadeEndIndex (currentY < fadeEndY) - ALWAYS opacity = 1
    if (currentY < fadeEndY) {
      this.overlayTarget.style.opacity = "1"
      return
    }

    // 2. BETWEEN fadeFromIndex and fadeEndIndex - overlay appears gradually
    if (currentY >= fadeEndY && currentY <= fadeStartY) {
      const range = fadeStartY - fadeEndY
      const progress = (fadeStartY - currentY) / range
      const finalOpacity = Math.min(1, Math.max(0, progress))
      this.overlayTarget.style.opacity = finalOpacity
      return
    }

    // 3. MORE CLOSED than fadeFromIndex (currentY > fadeStartY) - NO overlay
    this.overlayTarget.style.opacity = "0"
  }

  updateOverlayOpacityForSnapPoint(snapPointIndex) {
    if (!this.hasOverlayTarget) return
    if (!this.snapPointsValue || this.snapPointsValue.length === 0) return

    const fadeIndex = this.fadeFromIndexValue >= 0
      ? this.fadeFromIndexValue
      : 0
    const fadeEndIndex = fadeIndex + 1

    // BEFORE fadeFromIndex - NO overlay
    if (snapPointIndex < fadeIndex) {
      this.overlayTarget.style.opacity = "0"
      return
    }

    // AT or AFTER fadeEndIndex - overlay fully visible
    if (snapPointIndex >= fadeEndIndex) {
      this.overlayTarget.style.opacity = "1"
      return
    }

    // AT fadeFromIndex - overlay starting to appear (use Y position for precise opacity)
    const currentY = this.getSnapPointY(snapPointIndex)
    this.updateOverlayOpacity(currentY)
  }

  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  show() {
    // Set data-state to open for animations
    if (this.hasContainerTarget) {
      this.containerTarget.setAttribute("data-state", "open")
    }
    if (this.hasOverlayTarget) {
      this.overlayTarget.setAttribute("data-state", "open")
    }
    if (this.hasContentTarget) {
      this.contentTarget.setAttribute("data-state", "open")
    }

    // If using snap points, position drawer at FIRST snap point (Vaul behavior)
    if (this.snapPointsValue && this.snapPointsValue.length > 0) {
      const initialIndex = 0 // Always start at first snap point

      if (this.hasContentTarget) {
        // Always animate from closed position (both first open and re-opens)
        // 1. Reset activeSnapPoint to ensure we're starting fresh
        this.activeSnapPointValue = initialIndex

        // 2. Position at closed (off-screen) without animation
        const closedPosition = this.getClosedPosition()
        this.contentTarget.style.transition = "none"
        this.contentTarget.style.transform = this.getTransformForDirection(closedPosition)

        // 3. Force reflow to ensure position is applied
        this.contentTarget.offsetHeight

        // 4. Animate to first snap position (ALWAYS index 0)
        this.snapTo(initialIndex, true)
      }

      this.hasBeenOpened = true

      // Set initial overlay opacity based on fadeFromIndex
      this.updateOverlayOpacityForSnapPoint(initialIndex)
    } else {
      // No snap points - always animate from closed position to fully open
      if (this.hasContentTarget) {
        // 1. Position at closed (off-screen) without animation
        const closedPosition = this.getClosedPosition()
        this.contentTarget.style.transition = "none"
        this.contentTarget.style.transform = this.getTransformForDirection(closedPosition)

        // 2. Force reflow
        this.contentTarget.offsetHeight

        // 3. Animate to open position (Y=0)
        this.contentTarget.style.transition = `transform ${this.TRANSITIONS.DURATION}s cubic-bezier(${this.TRANSITIONS.EASE.join(',')})`
        this.contentTarget.style.transform = "translate3d(0, 0, 0)"
      }

      this.hasBeenOpened = true
    }

    // Lock body scroll in modal mode
    if (this.modalValue) {
      document.body.style.overflow = "hidden"
      document.body.setAttribute("data-scroll-locked", "1")

      // Prevent page scroll on touch devices while allowing drawer drag
      this.preventScrollHandler = this.handlePreventScroll.bind(this)
      document.addEventListener("touchmove", this.preventScrollHandler, { passive: false })
    }

    // Setup focus trap
    this.setupFocusTrap()

    // Setup escape key handler
    if (this.dismissibleValue) {
      this.escapeHandler = (e) => {
        if (e.key === "Escape") {
          this.animateToClosedPosition()
        }
      }
      document.addEventListener("keydown", this.escapeHandler)
    }

    // Dispatch open event
    this.element.dispatchEvent(new CustomEvent("drawer:open", {
      bubbles: true,
      detail: { open: true }
    }))
  }

  hide() {
    // Simply delegate to animateToClosedPosition for consistent animation
    this.animateToClosedPosition()
  }

  animateToClosedPosition() {
    // Animate from current position to closed position, then close
    if (this.hasContentTarget) {
      const closedPosition = this.getClosedPosition()
      const currentTransform = this.contentTarget.style.transform

      // Apply transition for smooth animation
      this.contentTarget.style.transition = `transform ${this.TRANSITIONS.DURATION}s cubic-bezier(${this.TRANSITIONS.EASE.join(',')})`
      this.contentTarget.style.transform = this.getTransformForDirection(closedPosition)

      // Fade out overlay
      if (this.hasOverlayTarget) {
        this.overlayTarget.style.transition = `opacity ${this.TRANSITIONS.DURATION}s`
        this.overlayTarget.style.opacity = "0"
      }

      // After animation completes, clean up and update state WITHOUT calling hide()
      setTimeout(() => {
        // Clear inline styles and set data-state
        if (this.hasContentTarget) {
          // Set transition to none BEFORE clearing styles to prevent CSS transition from triggering
          this.contentTarget.style.transition = "none"
          this.contentTarget.style.transform = ""
          this.contentTarget.setAttribute("data-state", "closed")
        }
        if (this.hasOverlayTarget) {
          this.overlayTarget.style.transition = "none"
          this.overlayTarget.style.opacity = ""
          this.overlayTarget.setAttribute("data-state", "closed")
        }
        if (this.hasContainerTarget) {
          this.containerTarget.setAttribute("data-state", "closed")
        }

        // Update state and clean up (without calling hide() which would animate again)
        this.openValue = false

        // Unlock body scroll
        document.body.style.overflow = ""
        document.body.removeAttribute("data-scroll-locked")

        // Remove touch scroll prevention
        if (this.preventScrollHandler) {
          document.removeEventListener("touchmove", this.preventScrollHandler)
          this.preventScrollHandler = null
        }

        // Remove escape handler
        if (this.escapeHandler) {
          document.removeEventListener("keydown", this.escapeHandler)
          this.escapeHandler = null
        }

        // Dispatch close event
        this.element.dispatchEvent(new CustomEvent("drawer:close", {
          bubbles: true,
          detail: { open: false }
        }))
      }, this.TRANSITIONS.DURATION * 1000)
    } else {
      // Fallback if no content target
      this.close()
    }
  }

  isMobile() {
    // Detect mobile devices to prevent keyboard popup on focus
    return /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  }

  setupFocusTrap() {
    if (!this.hasContentTarget) return

    const focusableElements = this.contentTarget.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )

    if (focusableElements.length === 0) return

    // On mobile, avoid focusing inputs/textareas to prevent keyboard popup
    if (this.isMobile()) {
      // Find first non-input focusable element
      const nonInputElement = Array.from(focusableElements).find(el =>
        el.tagName !== 'INPUT' && el.tagName !== 'TEXTAREA' && el.tagName !== 'SELECT'
      )

      if (nonInputElement) {
        nonInputElement.focus({ preventScroll: true })
      }
      // If only inputs exist, don't focus anything on mobile
    } else {
      // Desktop: focus first element as usual
      focusableElements[0].focus({ preventScroll: true })
    }
  }

  // ============================================================================
  // ADVANCED FEATURES
  // ============================================================================

  handleResize() {
    // If drawer is open and using snap points, maintain relative position
    // Y positions are calculated on-demand via getSnapPointY(), no pre-calculation needed
    if (this.openValue && this.snapPointsValue && this.snapPointsValue.length > 0 && this.activeSnapPointValue >= 0) {
      this.snapTo(this.activeSnapPointValue, false)
    }
  }

  handleViewportResize() {
    // Detect mobile keyboard open/close
    if (!this.hasContentTarget || !this.openValue) return

    // When keyboard opens, visualViewport height decreases
    // Scroll active input into view
    const activeElement = document.activeElement

    if (activeElement && (activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA")) {
      setTimeout(() => {
        activeElement.scrollIntoView({ behavior: "smooth", block: "center" })
      }, 100)
    }
  }

  handlePreventScroll(event) {
    // Allow scroll inside drawer content
    if (!this.hasContentTarget) return

    // Check if the touch is inside the drawer content
    const target = event.target
    const isInsideDrawer = this.contentTarget.contains(target)

    if (isInsideDrawer) {
      // Find the nearest scrollable parent
      let scrollableParent = target
      while (scrollableParent && scrollableParent !== this.contentTarget) {
        const overflowY = window.getComputedStyle(scrollableParent).overflowY
        const isScrollable = overflowY === "auto" || overflowY === "scroll"

        if (isScrollable && scrollableParent.scrollHeight > scrollableParent.clientHeight) {
          // Allow scroll inside this scrollable container
          return
        }

        scrollableParent = scrollableParent.parentElement
      }
    }

    // Prevent page scroll for everything else
    event.preventDefault()
  }
}
