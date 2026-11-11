import { Controller } from "@hotwired/stimulus"
import { ensureId, setIdRefs } from "../utils/id-manager.js"

/**
 * Resizable controller for resizable panel groups
 * Supports horizontal and vertical layouts with draggable handles
 * Implements keyboard navigation and accessibility features
 *
 * Based on react-resizable-panels behavior:
 * - Panels have percentage-based sizes
 * - Handles can be dragged or controlled via keyboard
 * - Supports min/max size constraints
 */
export default class extends Controller {
  static targets = ["panel", "handle"]
  static values = {
    direction: { type: String, default: "horizontal" },
    keyboardResizeBy: { type: Number, default: 10 }
  }

  connect() {
    this.isDragging = false
    this.activeHandleIndex = -1
    this.startPosition = 0
    this.startSizes = []
    this.activePointerId = null

    // Initialize panel sizes if not already set
    this.initializePanelSizes()

    // Set up data attributes
    this.element.setAttribute("data-panel-group-direction", this.directionValue)

    // Window splitter semantics (APG). Keyboard is bound with data-action
    // (keydown->ui--resizable#handleKeyDown), so nothing piles up on reconnect.
    this.collapsedFrom = new Map()
    this.handleTargets.forEach((handle, index) => {
      handle.setAttribute("tabindex", "0")
      handle.setAttribute("role", "separator")
      // A horizontal group is split by a vertical separator, and vice versa
      handle.setAttribute("aria-orientation", this.directionValue === "horizontal" ? "vertical" : "horizontal")
      handle.setAttribute("data-resize-handle-state", "inactive")
      handle.setAttribute("data-panel-group-direction", this.directionValue)
      // Set touch-action to none to prevent scroll interference on touch devices
      handle.style.touchAction = "none"

      // The separator controls (and is named after) the panel before it
      const panel = this.panelTargets[index]
      if (panel) {
        ensureId(panel, "resizable-panel")
        setIdRefs(handle, "aria-controls", panel)
        if (panel.hasAttribute("aria-label") && !handle.hasAttribute("aria-label")) {
          setIdRefs(handle, "aria-labelledby", panel)
        }
      }
      this.syncHandleAria(index)
    })

    // Store bound handlers for cleanup
    this._boundHandleMove = this.handleMove.bind(this)
    this._boundEndDrag = this.endDrag.bind(this)
  }

  disconnect() {
    document.removeEventListener("pointermove", this._boundHandleMove)
    document.removeEventListener("pointerup", this._boundEndDrag)
    document.removeEventListener("pointercancel", this._boundEndDrag)

    // Ensure we clean up any dragging state
    if (this.isDragging) {
      this.cleanupDragState()
    }
  }

  /**
   * Clean up drag state and restore normal behavior
   */
  cleanupDragState() {
    document.body.style.userSelect = ""
    document.body.style.cursor = ""
  }

  /**
   * Initialize panel sizes based on defaultSize data attributes
   * Falls back to equal distribution if not specified
   */
  initializePanelSizes() {
    const panels = this.panelTargets
    let totalDefaultSize = 0
    let panelsWithoutDefault = 0

    // Calculate total of specified default sizes
    panels.forEach(panel => {
      const defaultSize = parseFloat(panel.dataset.defaultSize)
      if (!isNaN(defaultSize)) {
        totalDefaultSize += defaultSize
      } else {
        panelsWithoutDefault++
      }
    })

    // Distribute remaining space equally among panels without defaults
    const remainingSpace = 100 - totalDefaultSize
    const defaultForUnspecified = panelsWithoutDefault > 0 ? remainingSpace / panelsWithoutDefault : 0

    // Apply sizes
    panels.forEach(panel => {
      let size = parseFloat(panel.dataset.defaultSize)
      if (isNaN(size)) {
        size = defaultForUnspecified
      }
      this.setPanelSize(panel, size)
    })
  }

  /**
   * Set a panel's size using flex-grow for proportional sizing
   * Uses flex-grow instead of flex-basis percentage to work correctly
   * with min-height containers in vertical layouts
   */
  setPanelSize(panel, size) {
    panel.dataset.panelSize = size
    // Use flex-grow for proportional distribution
    // This works with both explicit height and min-height containers
    panel.style.flexGrow = size.toString()
    panel.style.flexShrink = size.toString()
    panel.style.flexBasis = "0"
  }

  /**
   * aria-valuenow/min/max of a handle: the size and limits of the panel
   * before it (react-resizable-panels)
   */
  syncHandleAria(handleIndex) {
    const handle = this.handleTargets[handleIndex]
    const panel = this.panelTargets[handleIndex]
    if (!handle || !panel) return

    handle.setAttribute("aria-valuenow", Math.round(this.getPanelSize(panel)))
    handle.setAttribute("aria-valuemin", Math.round(parseFloat(panel.dataset.minSize) || 0))
    handle.setAttribute("aria-valuemax", Math.round(parseFloat(panel.dataset.maxSize) || 100))
  }

  /**
   * Get a panel's current size
   */
  getPanelSize(panel) {
    return parseFloat(panel.dataset.panelSize) || 0
  }

  /**
   * Start dragging when pointer down on handle
   */
  startDrag(event) {
    const handle = event.currentTarget
    const handleIndex = this.handleTargets.indexOf(handle)

    if (handleIndex === -1) return

    event.preventDefault()

    this.isDragging = true
    this.activeHandleIndex = handleIndex
    this.activePointerId = event.pointerId

    // Store initial position
    if (this.directionValue === "horizontal") {
      this.startPosition = event.clientX
    } else {
      this.startPosition = event.clientY
    }

    // Store initial sizes of adjacent panels
    const leftPanel = this.panelTargets[handleIndex]
    const rightPanel = this.panelTargets[handleIndex + 1]
    this.startSizes = [this.getPanelSize(leftPanel), this.getPanelSize(rightPanel)]

    // Update handle state
    handle.setAttribute("data-resize-handle-state", "drag")
    handle.setAttribute("data-resize-handle-active", "pointer")

    // Prevent text selection during drag
    document.body.style.userSelect = "none"

    // Set cursor for the entire document during drag
    document.body.style.cursor = this.directionValue === "horizontal" ? "col-resize" : "row-resize"

    // Capture pointer for smooth dragging (works on touch and mouse)
    handle.setPointerCapture(event.pointerId)

    // Add document-level listeners
    document.addEventListener("pointermove", this._boundHandleMove)
    document.addEventListener("pointerup", this._boundEndDrag)
    document.addEventListener("pointercancel", this._boundEndDrag)

    // Dispatch resize start event
    this.dispatch("resizeStart", {
      detail: { handleIndex, sizes: this.getCurrentSizes() }
    })
  }

  /**
   * Handle pointer move during drag
   */
  handleMove(event) {
    if (!this.isDragging || this.activeHandleIndex === -1) return

    event.preventDefault()

    // Calculate delta in pixels
    let delta
    if (this.directionValue === "horizontal") {
      delta = event.clientX - this.startPosition
    } else {
      delta = event.clientY - this.startPosition
    }

    // Convert pixel delta to percentage
    const containerRect = this.element.getBoundingClientRect()
    const containerSize = this.directionValue === "horizontal"
      ? containerRect.width
      : containerRect.height

    const percentageDelta = (delta / containerSize) * 100

    // Calculate new sizes
    const leftPanel = this.panelTargets[this.activeHandleIndex]
    const rightPanel = this.panelTargets[this.activeHandleIndex + 1]

    let newLeftSize = this.startSizes[0] + percentageDelta
    let newRightSize = this.startSizes[1] - percentageDelta

    // Apply min/max constraints
    const leftMin = parseFloat(leftPanel.dataset.minSize) || 0
    const leftMax = parseFloat(leftPanel.dataset.maxSize) || 100
    const rightMin = parseFloat(rightPanel.dataset.minSize) || 0
    const rightMax = parseFloat(rightPanel.dataset.maxSize) || 100

    // Clamp sizes
    if (newLeftSize < leftMin) {
      const adjustment = leftMin - newLeftSize
      newLeftSize = leftMin
      newRightSize -= adjustment
    }
    if (newLeftSize > leftMax) {
      const adjustment = newLeftSize - leftMax
      newLeftSize = leftMax
      newRightSize += adjustment
    }
    if (newRightSize < rightMin) {
      const adjustment = rightMin - newRightSize
      newRightSize = rightMin
      newLeftSize -= adjustment
    }
    if (newRightSize > rightMax) {
      const adjustment = newRightSize - rightMax
      newRightSize = rightMax
      newLeftSize += adjustment
    }

    // Final clamp to valid range
    newLeftSize = Math.max(leftMin, Math.min(leftMax, newLeftSize))
    newRightSize = Math.max(rightMin, Math.min(rightMax, newRightSize))

    // Apply new sizes
    this.setPanelSize(leftPanel, newLeftSize)
    this.setPanelSize(rightPanel, newRightSize)

    // Update ARIA
    const handle = this.handleTargets[this.activeHandleIndex]
    handle.setAttribute("aria-valuenow", Math.round(newLeftSize))

    // Dispatch resize event
    this.dispatch("resize", {
      detail: { handleIndex: this.activeHandleIndex, sizes: this.getCurrentSizes() }
    })
  }

  /**
   * End dragging
   */
  endDrag(event) {
    if (!this.isDragging) return

    const handle = this.handleTargets[this.activeHandleIndex]
    if (handle) {
      handle.setAttribute("data-resize-handle-state", "inactive")
      handle.removeAttribute("data-resize-handle-active")

      // Release pointer capture if we have an active pointer
      if (this.activePointerId !== null) {
        try {
          handle.releasePointerCapture(this.activePointerId)
        } catch (e) {
          // Pointer may have already been released
        }
      }
    }

    this.isDragging = false
    this.activeHandleIndex = -1
    this.activePointerId = null

    // Clean up drag state (user-select, cursor)
    this.cleanupDragState()

    document.removeEventListener("pointermove", this._boundHandleMove)
    document.removeEventListener("pointerup", this._boundEndDrag)
    document.removeEventListener("pointercancel", this._boundEndDrag)

    // Dispatch resize end event
    this.dispatch("resizeEnd", {
      detail: { sizes: this.getCurrentSizes() }
    })
  }

  /**
   * Handle hover state for handles
   */
  handleEnter(event) {
    if (!this.isDragging) {
      event.currentTarget.setAttribute("data-resize-handle-state", "hover")
    }
  }

  handleLeave(event) {
    if (!this.isDragging) {
      event.currentTarget.setAttribute("data-resize-handle-state", "inactive")
    }
  }

  /**
   * Keyboard navigation for handles (APG window splitter):
   * arrows along the group axis resize, Home/End go to min/max, Enter
   * collapses the panel before the handle to its minimum and restores it.
   * Perpendicular arrows are left to the page.
   */
  handleKeyDown(event) {
    const handleIndex = this.handleTargets.indexOf(event.currentTarget)
    if (handleIndex === -1) return

    const leftPanel = this.panelTargets[handleIndex]
    const rightPanel = this.panelTargets[handleIndex + 1]

    if (!leftPanel || !rightPanel) return

    let delta = 0
    const resizeBy = this.keyboardResizeByValue

    const isHorizontal = this.directionValue === "horizontal"

    const leftMinSize = parseFloat(leftPanel.dataset.minSize) || 0

    switch (event.key) {
      case "ArrowLeft":
      case "ArrowRight":
        if (!isHorizontal) return
        delta = event.key === "ArrowRight" ? resizeBy : -resizeBy
        event.preventDefault()
        break
      case "ArrowUp":
      case "ArrowDown":
        if (isHorizontal) return
        delta = event.key === "ArrowDown" ? resizeBy : -resizeBy
        event.preventDefault()
        break
      case "Home":
        // Minimize left panel
        delta = -(this.getPanelSize(leftPanel) - (parseFloat(leftPanel.dataset.minSize) || 0))
        event.preventDefault()
        break
      case "End":
        // Maximize left panel
        delta = (parseFloat(leftPanel.dataset.maxSize) || 100) - this.getPanelSize(leftPanel)
        event.preventDefault()
        break
      case "Enter": {
        event.preventDefault()
        const current = this.getPanelSize(leftPanel)
        const restoreTo = this.collapsedFrom.get(handleIndex)
        if (restoreTo !== undefined && current <= leftMinSize + 0.01) {
          delta = restoreTo - current
          this.collapsedFrom.delete(handleIndex)
        } else {
          this.collapsedFrom.set(handleIndex, current)
          delta = leftMinSize - current
        }
        break
      }
      default:
        return
    }

    if (delta === 0) return

    // Mark handle as keyboard-active
    const handle = this.handleTargets[handleIndex]
    handle.setAttribute("data-resize-handle-active", "keyboard")

    // Calculate new sizes
    let newLeftSize = this.getPanelSize(leftPanel) + delta
    let newRightSize = this.getPanelSize(rightPanel) - delta

    // Apply constraints
    const leftMin = parseFloat(leftPanel.dataset.minSize) || 0
    const leftMax = parseFloat(leftPanel.dataset.maxSize) || 100
    const rightMin = parseFloat(rightPanel.dataset.minSize) || 0
    const rightMax = parseFloat(rightPanel.dataset.maxSize) || 100

    newLeftSize = Math.max(leftMin, Math.min(leftMax, newLeftSize))
    newRightSize = Math.max(rightMin, Math.min(rightMax, newRightSize))

    // Ensure total remains consistent
    const total = newLeftSize + newRightSize
    if (Math.abs(total - (this.getPanelSize(leftPanel) + this.getPanelSize(rightPanel))) > 0.1) {
      // Adjust if constraints caused imbalance
      const targetTotal = this.getPanelSize(leftPanel) + this.getPanelSize(rightPanel)
      const ratio = targetTotal / total
      newLeftSize *= ratio
      newRightSize *= ratio
    }

    this.setPanelSize(leftPanel, newLeftSize)
    this.setPanelSize(rightPanel, newRightSize)

    // Update ARIA
    this.syncHandleAria(handleIndex)

    // Dispatch resize event
    this.dispatch("resize", {
      detail: { handleIndex, sizes: this.getCurrentSizes() }
    })

    // Clear keyboard-active state after a short delay
    setTimeout(() => {
      handle.removeAttribute("data-resize-handle-active")
    }, 100)
  }

  /**
   * Handle focus on handle
   */
  handleFocus(event) {
    event.currentTarget.setAttribute("data-resize-handle-state", "hover")
  }

  /**
   * Handle blur on handle
   */
  handleBlur(event) {
    event.currentTarget.setAttribute("data-resize-handle-state", "inactive")
  }

  /**
   * Get current sizes of all panels
   */
  getCurrentSizes() {
    return this.panelTargets.map(panel => this.getPanelSize(panel))
  }

  /**
   * Programmatically set panel sizes
   * @param {number[]} sizes - Array of percentage sizes for each panel
   */
  setSizes(sizes) {
    if (sizes.length !== this.panelTargets.length) {
      console.warn("Number of sizes must match number of panels")
      return
    }

    this.panelTargets.forEach((panel, index) => {
      this.setPanelSize(panel, sizes[index])
    })

    // Update ARIA on handles
    this.handleTargets.forEach((_handle, index) => this.syncHandleAria(index))

    this.dispatch("resize", {
      detail: { sizes: this.getCurrentSizes() }
    })
  }
}
