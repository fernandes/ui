import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="ui--scroll-area"
export default class extends Controller {
  static targets = ["viewport", "scrollbar", "thumb"]

  static values = {
    type: { type: String, default: "hover" }, // always, hover, scroll, auto
    scrollHideDelay: { type: Number, default: 600 }
  }

  constructor() {
    super(...arguments)
    this.rafId = null
    this.isDragging = false
    this.dragStartPointer = 0
    this.dragStartScroll = 0
    this.resizeObserver = null

    // State machine for "scroll" type
    this.scrollbarStates = new Map() // scrollbar element -> state

    // Timers
    this.hideTimers = new Map()
    this.scrollEndTimers = new Map()
  }

  connect() {
    // Apply overflow to viewport based on scrollbar orientations
    this.applyViewportOverflow()

    // Initialize scrollbar visibility based on type
    this.initializeScrollbarBehavior()

    // Setup scroll synchronization using requestAnimationFrame pattern
    this.boundSyncThumbPosition = this.syncThumbPosition.bind(this)
    this.startScrollSync()

    // Setup resize observer to recalculate on size changes
    this.setupResizeObserver()

    // Setup scrollbar click-to-scroll handlers
    this.setupScrollbarClickHandlers()

    // Setup drag handlers
    this.boundHandlePointerMove = this.handlePointerMove.bind(this)
    this.boundHandlePointerUp = this.handlePointerUp.bind(this)
  }

  applyViewportOverflow() {
    if (!this.hasViewportTarget) return

    // Check which scrollbars are present
    const hasVertical = this.scrollbarTargets.some(sb => sb.dataset.orientation === "vertical")
    const hasHorizontal = this.scrollbarTargets.some(sb => sb.dataset.orientation === "horizontal")

    // Apply overflow based on Radix pattern
    this.viewportTarget.style.overflowX = hasHorizontal ? "scroll" : "hidden"
    this.viewportTarget.style.overflowY = hasVertical ? "scroll" : "hidden"
  }

  initializeScrollbarBehavior() {
    this.scrollbarTargets.forEach(scrollbar => {
      const orientation = scrollbar.dataset.orientation

      switch (this.typeValue) {
        case "hover":
          this.initializeHoverScrollbar(scrollbar)
          break
        case "scroll":
          this.initializeScrollScrollbar(scrollbar, orientation)
          break
        case "auto":
          this.initializeAutoScrollbar(scrollbar, orientation)
          break
        case "always":
          this.initializeAlwaysScrollbar(scrollbar, orientation)
          break
      }
    })
  }

  // TYPE: HOVER - Show on pointer enter, hide after delay
  initializeHoverScrollbar(scrollbar) {
    scrollbar.dataset.state = "hidden"

    const handlePointerEnter = () => {
      const timer = this.hideTimers.get(scrollbar)
      if (timer) {
        clearTimeout(timer)
        this.hideTimers.delete(scrollbar)
      }
      scrollbar.dataset.state = "visible"
    }

    const handlePointerLeave = () => {
      const timer = setTimeout(() => {
        scrollbar.dataset.state = "hidden"
        this.hideTimers.delete(scrollbar)
      }, this.scrollHideDelayValue)
      this.hideTimers.set(scrollbar, timer)
    }

    this.element.addEventListener("pointerenter", handlePointerEnter)
    this.element.addEventListener("pointerleave", handlePointerLeave)

    // Store cleanup functions
    if (!this.cleanupFunctions) this.cleanupFunctions = []
    this.cleanupFunctions.push(() => {
      this.element.removeEventListener("pointerenter", handlePointerEnter)
      this.element.removeEventListener("pointerleave", handlePointerLeave)
    })
  }

  // TYPE: SCROLL - State machine: hidden -> scrolling -> idle -> hidden
  initializeScrollScrollbar(scrollbar, orientation) {
    this.scrollbarStates.set(scrollbar, "hidden")
    scrollbar.dataset.state = "hidden"

    const scrollDirection = orientation === "horizontal" ? "scrollLeft" : "scrollTop"
    let prevScrollPos = this.viewportTarget[scrollDirection]

    const sendEvent = (event) => {
      const state = this.scrollbarStates.get(scrollbar)

      switch (state) {
        case "hidden":
          if (event === "SCROLL") {
            this.scrollbarStates.set(scrollbar, "scrolling")
            scrollbar.dataset.state = "visible"
          }
          break
        case "scrolling":
          if (event === "SCROLL_END") {
            this.scrollbarStates.set(scrollbar, "idle")
            // Schedule hide after delay
            const timer = setTimeout(() => {
              if (this.scrollbarStates.get(scrollbar) === "idle") {
                this.scrollbarStates.set(scrollbar, "hidden")
                scrollbar.dataset.state = "hidden"
              }
            }, this.scrollHideDelayValue)
            this.hideTimers.set(scrollbar, timer)
          } else if (event === "POINTER_ENTER") {
            this.scrollbarStates.set(scrollbar, "interacting")
          }
          break
        case "interacting":
          if (event === "POINTER_LEAVE") {
            this.scrollbarStates.set(scrollbar, "idle")
            // Schedule hide after delay
            const timer = setTimeout(() => {
              if (this.scrollbarStates.get(scrollbar) === "idle") {
                this.scrollbarStates.set(scrollbar, "hidden")
                scrollbar.dataset.state = "hidden"
              }
            }, this.scrollHideDelayValue)
            this.hideTimers.set(scrollbar, timer)
          }
          break
        case "idle":
          if (event === "SCROLL") {
            this.scrollbarStates.set(scrollbar, "scrolling")
            // Clear hide timer
            const timer = this.hideTimers.get(scrollbar)
            if (timer) {
              clearTimeout(timer)
              this.hideTimers.delete(scrollbar)
            }
          } else if (event === "POINTER_ENTER") {
            this.scrollbarStates.set(scrollbar, "interacting")
            // Clear hide timer
            const timer = this.hideTimers.get(scrollbar)
            if (timer) {
              clearTimeout(timer)
              this.hideTimers.delete(scrollbar)
            }
          }
          break
      }
    }

    const debounceScrollEnd = () => {
      const timer = this.scrollEndTimers.get(scrollbar)
      if (timer) clearTimeout(timer)

      const newTimer = setTimeout(() => {
        sendEvent("SCROLL_END")
        this.scrollEndTimers.delete(scrollbar)
      }, 100)
      this.scrollEndTimers.set(scrollbar, newTimer)
    }

    const handleScroll = () => {
      const scrollPos = this.viewportTarget[scrollDirection]
      if (prevScrollPos !== scrollPos) {
        sendEvent("SCROLL")
        debounceScrollEnd()
      }
      prevScrollPos = scrollPos
    }

    const handlePointerEnter = () => sendEvent("POINTER_ENTER")
    const handlePointerLeave = () => sendEvent("POINTER_LEAVE")

    this.viewportTarget.addEventListener("scroll", handleScroll)
    scrollbar.addEventListener("pointerenter", handlePointerEnter)
    scrollbar.addEventListener("pointerleave", handlePointerLeave)

    // Store cleanup
    if (!this.cleanupFunctions) this.cleanupFunctions = []
    this.cleanupFunctions.push(() => {
      this.viewportTarget.removeEventListener("scroll", handleScroll)
      scrollbar.removeEventListener("pointerenter", handlePointerEnter)
      scrollbar.removeEventListener("pointerleave", handlePointerLeave)
      const timer = this.scrollEndTimers.get(scrollbar)
      if (timer) clearTimeout(timer)
      const hideTimer = this.hideTimers.get(scrollbar)
      if (hideTimer) clearTimeout(hideTimer)
    })
  }

  // TYPE: AUTO - Show only when overflow exists
  initializeAutoScrollbar(scrollbar, orientation) {
    this.updateAutoScrollbar(scrollbar, orientation)
  }

  updateAutoScrollbar(scrollbar, orientation) {
    if (!this.hasViewportTarget) return

    let hasOverflow = false
    if (orientation === "horizontal") {
      hasOverflow = this.viewportTarget.scrollWidth > this.viewportTarget.clientWidth
    } else {
      hasOverflow = this.viewportTarget.scrollHeight > this.viewportTarget.clientHeight
    }

    scrollbar.dataset.state = hasOverflow ? "visible" : "hidden"
  }

  // TYPE: ALWAYS - Always visible when overflow exists
  initializeAlwaysScrollbar(scrollbar, orientation) {
    this.updateAlwaysScrollbar(scrollbar, orientation)
  }

  updateAlwaysScrollbar(scrollbar, orientation) {
    if (!this.hasViewportTarget) return

    let hasOverflow = false
    if (orientation === "horizontal") {
      hasOverflow = this.viewportTarget.scrollWidth > this.viewportTarget.clientWidth
    } else {
      hasOverflow = this.viewportTarget.scrollHeight > this.viewportTarget.clientHeight
    }

    scrollbar.dataset.state = hasOverflow ? "visible" : "hidden"
  }

  startScrollSync() {
    const sync = () => {
      this.syncThumbPosition()
      this.rafId = requestAnimationFrame(sync)
    }
    this.rafId = requestAnimationFrame(sync)
  }

  setupResizeObserver() {
    if (!this.hasViewportTarget) return

    this.resizeObserver = new ResizeObserver(() => {
      // Update auto/always scrollbars on resize
      this.scrollbarTargets.forEach(scrollbar => {
        const orientation = scrollbar.dataset.orientation
        if (this.typeValue === "auto") {
          this.updateAutoScrollbar(scrollbar, orientation)
        } else if (this.typeValue === "always") {
          this.updateAlwaysScrollbar(scrollbar, orientation)
        }
      })
      this.updateThumbSize()
    })

    this.resizeObserver.observe(this.viewportTarget)

    // Also observe the content inside viewport
    if (this.viewportTarget.firstElementChild) {
      this.resizeObserver.observe(this.viewportTarget.firstElementChild)
    }
  }

  setupScrollbarClickHandlers() {
    this.scrollbarTargets.forEach((scrollbar, index) => {
      const handleScrollbarClick = (event) => {
        // Ignore clicks on the thumb itself (thumb has its own drag handler)
        if (event.target.closest('[data-ui--scroll-area-target="thumb"]')) {
          return
        }

        const orientation = scrollbar.dataset.orientation
        const thumb = this.thumbTargets[index]
        if (!thumb) return

        const viewport = this.viewportTarget
        const rect = scrollbar.getBoundingClientRect()

        if (orientation === "horizontal") {
          // Calculate click position relative to scrollbar
          const clickX = event.clientX - rect.left
          const scrollbarWidth = scrollbar.clientWidth
          const contentWidth = viewport.scrollWidth
          const viewportWidth = viewport.clientWidth
          const scrollableWidth = contentWidth - viewportWidth

          // Calculate scroll position based on click (center the viewport at click point)
          const ratio = clickX / scrollbarWidth
          viewport.scrollLeft = ratio * scrollableWidth
        } else {
          // Vertical scrollbar
          const clickY = event.clientY - rect.top
          const scrollbarHeight = scrollbar.clientHeight
          const contentHeight = viewport.scrollHeight
          const viewportHeight = viewport.clientHeight
          const scrollableHeight = contentHeight - viewportHeight

          // Calculate scroll position based on click (center the viewport at click point)
          const ratio = clickY / scrollbarHeight
          viewport.scrollTop = ratio * scrollableHeight
        }
      }

      scrollbar.addEventListener('click', handleScrollbarClick)

      // Store cleanup function
      if (!this.cleanupFunctions) this.cleanupFunctions = []
      this.cleanupFunctions.push(() => {
        scrollbar.removeEventListener('click', handleScrollbarClick)
      })
    })
  }

  syncThumbPosition() {
    if (!this.hasViewportTarget) return

    this.scrollbarTargets.forEach((scrollbar, index) => {
      const orientation = scrollbar.dataset.orientation
      const thumb = this.thumbTargets[index]
      if (!thumb) return

      if (orientation === "horizontal") {
        this.updateHorizontalThumb(scrollbar, thumb)
      } else {
        this.updateVerticalThumb(scrollbar, thumb)
      }
    })
  }

  updateVerticalThumb(scrollbar, thumb) {
    const viewport = this.viewportTarget
    const contentHeight = viewport.scrollHeight
    const viewportHeight = viewport.clientHeight

    // Check if scrolling is needed
    if (contentHeight <= viewportHeight) {
      return
    }

    // Get scrollbar dimensions (account for padding - p-px = 1px on each side)
    const scrollbarHeight = scrollbar.clientHeight
    const scrollbarPadding = 2 // 1px top + 1px bottom from p-px
    const availableHeight = scrollbarHeight - scrollbarPadding

    // Calculate thumb size (minimum 18px like Radix)
    const thumbRatio = viewportHeight / contentHeight
    const thumbHeight = Math.max(18, availableHeight * thumbRatio)

    // Calculate thumb position
    const scrollableHeight = contentHeight - viewportHeight
    const scrollRatio = scrollableHeight > 0 ? viewport.scrollTop / scrollableHeight : 0
    const maxThumbTop = availableHeight - thumbHeight
    const thumbTop = scrollRatio * maxThumbTop

    // Apply styles (height and position)
    thumb.style.height = `${thumbHeight}px`
    thumb.style.transform = `translate3d(0, ${thumbTop}px, 0)`
  }

  updateHorizontalThumb(scrollbar, thumb) {
    const viewport = this.viewportTarget
    const contentWidth = viewport.scrollWidth
    const viewportWidth = viewport.clientWidth

    // Check if scrolling is needed
    if (contentWidth <= viewportWidth) {
      return
    }

    // Get scrollbar dimensions (account for padding - p-px = 1px on each side)
    const scrollbarWidth = scrollbar.clientWidth
    const scrollbarPadding = 2 // 1px left + 1px right from p-px
    const availableWidth = scrollbarWidth - scrollbarPadding

    // Calculate thumb size (minimum 18px like Radix)
    const thumbRatio = viewportWidth / contentWidth
    const thumbWidth = Math.max(18, availableWidth * thumbRatio)

    // Calculate thumb position
    const scrollableWidth = contentWidth - viewportWidth
    const scrollRatio = scrollableWidth > 0 ? viewport.scrollLeft / scrollableWidth : 0
    const maxThumbLeft = availableWidth - thumbWidth
    const thumbLeft = scrollRatio * maxThumbLeft

    // Apply styles (width and position)
    thumb.style.width = `${thumbWidth}px`
    thumb.style.transform = `translate3d(${thumbLeft}px, 0, 0)`
  }

  updateThumbSize() {
    if (!this.hasViewportTarget) return

    this.scrollbarTargets.forEach((scrollbar, index) => {
      const orientation = scrollbar.dataset.orientation
      const thumb = this.thumbTargets[index]
      if (!thumb) return

      if (orientation === "horizontal") {
        const contentWidth = this.viewportTarget.scrollWidth
        const viewportWidth = this.viewportTarget.clientWidth
        const scrollbarWidth = scrollbar.clientWidth
        const scrollbarPadding = 2
        const availableWidth = scrollbarWidth - scrollbarPadding
        const thumbRatio = viewportWidth / contentWidth
        const thumbWidth = Math.max(18, availableWidth * thumbRatio)
        thumb.style.width = `${thumbWidth}px`
      } else {
        const contentHeight = this.viewportTarget.scrollHeight
        const viewportHeight = this.viewportTarget.clientHeight
        const scrollbarHeight = scrollbar.clientHeight
        const scrollbarPadding = 2
        const availableHeight = scrollbarHeight - scrollbarPadding
        const thumbRatio = viewportHeight / contentHeight
        const thumbHeight = Math.max(18, availableHeight * thumbRatio)
        thumb.style.height = `${thumbHeight}px`
      }
    })
  }

  // Thumb dragging
  startDrag(event) {
    event.preventDefault()

    const thumb = event.currentTarget
    const index = this.thumbTargets.indexOf(thumb)
    const scrollbar = this.scrollbarTargets[index]
    const orientation = scrollbar.dataset.orientation

    this.isDragging = true
    this.currentScrollbar = scrollbar
    this.currentThumb = thumb
    this.currentOrientation = orientation

    // Store previous webkit user select to restore later
    this.prevWebkitUserSelect = document.body.style.webkitUserSelect
    document.body.style.webkitUserSelect = "none"

    if (orientation === "horizontal") {
      this.dragStartPointer = event.clientX
      this.dragStartScroll = this.viewportTarget.scrollLeft
    } else {
      this.dragStartPointer = event.clientY
      this.dragStartScroll = this.viewportTarget.scrollTop
    }

    // Disable smooth scrolling during drag
    if (this.viewportTarget) {
      this.viewportTarget.style.scrollBehavior = "auto"
    }

    // Add document-level listeners
    document.addEventListener("pointermove", this.boundHandlePointerMove)
    document.addEventListener("pointerup", this.boundHandlePointerUp)

    // Pointer capture
    thumb.setPointerCapture(event.pointerId)
  }

  handlePointerMove(event) {
    if (!this.isDragging) return

    const viewport = this.viewportTarget
    const scrollbar = this.currentScrollbar
    const thumb = this.currentThumb
    const orientation = this.currentOrientation

    if (orientation === "horizontal") {
      const deltaX = event.clientX - this.dragStartPointer
      const scrollbarWidth = scrollbar.clientWidth
      const contentWidth = viewport.scrollWidth
      const viewportWidth = viewport.clientWidth
      const scrollableWidth = contentWidth - viewportWidth

      // Convert pointer delta to scroll delta
      const thumbWidth = parseFloat(thumb.style.width) || 18
      const scrollbarPadding = 2
      const maxThumbLeft = scrollbarWidth - scrollbarPadding - thumbWidth
      const scrollDelta = maxThumbLeft > 0 ? (deltaX / maxThumbLeft) * scrollableWidth : 0

      viewport.scrollLeft = this.dragStartScroll + scrollDelta
    } else {
      const deltaY = event.clientY - this.dragStartPointer
      const scrollbarHeight = scrollbar.clientHeight
      const contentHeight = viewport.scrollHeight
      const viewportHeight = viewport.clientHeight
      const scrollableHeight = contentHeight - viewportHeight

      // Convert pointer delta to scroll delta
      const thumbHeight = parseFloat(thumb.style.height) || 18
      const scrollbarPadding = 2
      const maxThumbTop = scrollbarHeight - scrollbarPadding - thumbHeight
      const scrollDelta = maxThumbTop > 0 ? (deltaY / maxThumbTop) * scrollableHeight : 0

      viewport.scrollTop = this.dragStartScroll + scrollDelta
    }
  }

  handlePointerUp(event) {
    if (!this.isDragging) return

    this.isDragging = false

    // Restore webkit user select
    document.body.style.webkitUserSelect = this.prevWebkitUserSelect

    // Restore scroll behavior
    if (this.viewportTarget) {
      this.viewportTarget.style.scrollBehavior = ""
    }

    this.currentScrollbar = null
    this.currentThumb = null
    this.currentOrientation = null

    // Remove document-level listeners
    document.removeEventListener("pointermove", this.boundHandlePointerMove)
    document.removeEventListener("pointerup", this.boundHandlePointerUp)
  }

  disconnect() {
    // Stop animation frame
    if (this.rafId) {
      cancelAnimationFrame(this.rafId)
      this.rafId = null
    }

    // Disconnect resize observer
    if (this.resizeObserver) {
      this.resizeObserver.disconnect()
      this.resizeObserver = null
    }

    // Clean up all event listeners
    if (this.cleanupFunctions) {
      this.cleanupFunctions.forEach(fn => fn())
      this.cleanupFunctions = []
    }

    // Clean up drag listeners
    document.removeEventListener("pointermove", this.boundHandlePointerMove)
    document.removeEventListener("pointerup", this.boundHandlePointerUp)

    // Clear all timers
    this.hideTimers.forEach(timer => clearTimeout(timer))
    this.hideTimers.clear()
    this.scrollEndTimers.forEach(timer => clearTimeout(timer))
    this.scrollEndTimers.clear()
  }
}
