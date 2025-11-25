import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = {
    position: { type: String, default: "bottom-right" },
    theme: { type: String, default: "system" },
    richColors: { type: Boolean, default: false },
    expand: { type: Boolean, default: false },
    duration: { type: Number, default: 4000 },
    closeButton: { type: Boolean, default: false },
    visibleToasts: { type: Number, default: 3 },
    gap: { type: Number, default: 14 },
    offset: { type: Number, default: 16 }
  }

  connect() {
    this.toasts = []
    this.toastId = 0
    this.isHovered = false
    this.lastCloseTimestamp = 0
    this.setupContainer()
    this.setupEventListeners()
    this.setupHoverListeners()
    this.detectTheme()
  }

  setupContainer() {
    const [yPos, xPos] = this.positionValue.split("-")
    this.element.setAttribute("data-sonner-toaster", "")
    this.element.setAttribute("data-y-position", yPos)
    this.element.setAttribute("data-x-position", xPos)
    this.element.setAttribute("dir", "ltr")
    this.element.style.setProperty("--width", "356px")
    this.element.style.setProperty("--gap", `${this.gapValue}px`)
    this.element.style.setProperty("--offset-top", `${this.offsetValue}px`)
    this.element.style.setProperty("--offset-bottom", `${this.offsetValue}px`)
    this.element.style.setProperty("--offset-left", `${this.offsetValue}px`)
    this.element.style.setProperty("--offset-right", `${this.offsetValue}px`)
    // Mobile offsets
    this.element.style.setProperty("--mobile-offset-top", `${this.offsetValue}px`)
    this.element.style.setProperty("--mobile-offset-bottom", `${this.offsetValue}px`)
    this.element.style.setProperty("--mobile-offset-left", `${this.offsetValue}px`)
    this.element.style.setProperty("--mobile-offset-right", `${this.offsetValue}px`)
  }

  detectTheme() {
    let theme = this.themeValue
    if (theme === "system") {
      theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    }
    this.element.setAttribute("data-sonner-theme", theme)
  }

  setupHoverListeners() {
    this.boundHandleMouseEnter = this.handleMouseEnter.bind(this)
    this.boundHandleMouseLeave = this.handleMouseLeave.bind(this)
    this.element.addEventListener("mouseenter", this.boundHandleMouseEnter)
    this.element.addEventListener("mouseleave", this.boundHandleMouseLeave)
  }

  handleMouseEnter() {
    this.isHovered = true
    this.expandToasts()
    this.pauseAllTimers()
  }

  handleMouseLeave() {
    this.isHovered = false
    this.collapseToasts()
    this.resumeAllTimers()
  }

  expandToasts() {
    this.toasts.forEach(t => {
      t.element.setAttribute("data-expanded", "true")
    })
    this.updateToastPositions()
  }

  collapseToasts() {
    this.toasts.forEach(t => {
      t.element.setAttribute("data-expanded", "false")
    })
    this.updateToastPositions()
  }

  pauseAllTimers() {
    const now = Date.now()
    this.toasts.forEach(t => {
      if (t.timerId) {
        clearTimeout(t.timerId)
        t.timerId = null
        // Calculate remaining time
        t.remainingTime = Math.max(0, t.dismissAt - now)
      }
    })
  }

  resumeAllTimers() {
    const now = Date.now()
    this.toasts.forEach(t => {
      if (t.remainingTime !== undefined && t.remainingTime > 0) {
        t.dismissAt = now + t.remainingTime
        t.timerId = setTimeout(() => this.dismiss(t.id), t.remainingTime)
      }
    })
  }

  // Core toast creation
  show(message, options = {}) {
    const id = ++this.toastId
    const toast = this.createToastElement(id, message, options)

    this.element.appendChild(toast)

    // Store height as null initially, will be set after first render
    const toastData = { id, element: toast, options, timerId: null, dismissAt: null, remainingTime: null, height: null }
    this.toasts.push(toastData)
    this.updateToastPositions()

    // Trigger mount animation after a frame and capture height
    requestAnimationFrame(() => {
      const height = toast.getBoundingClientRect().height
      // Store the original height permanently in the toast data
      toastData.height = height
      toast.style.setProperty("--initial-height", `${height}px`)
      this.element.style.setProperty("--front-toast-height", `${height}px`)
      toast.setAttribute("data-mounted", "true")
    })

    // Auto-dismiss (only if not hovered)
    const duration = options.duration ?? this.durationValue
    if (duration !== Infinity) {
      if (!this.isHovered) {
        toastData.dismissAt = Date.now() + duration
        toastData.timerId = setTimeout(() => this.dismiss(id), duration)
      } else {
        // Store the duration for when hover ends
        toastData.remainingTime = duration
      }
    }

    return id
  }

  createToastElement(id, message, options) {
    const [yPos, xPos] = this.positionValue.split("-")
    const toast = document.createElement("li")
    toast.setAttribute("data-sonner-toast", "")
    toast.setAttribute("data-styled", "true")
    toast.setAttribute("data-y-position", yPos)
    toast.setAttribute("data-x-position", xPos)
    toast.setAttribute("data-front", "true")
    toast.setAttribute("data-visible", "true")
    toast.setAttribute("data-swipe-out", "false")
    // Start expanded if hovered, otherwise collapsed
    toast.setAttribute("data-expanded", this.isHovered || this.expandValue ? "true" : "false")
    if (options.type) toast.setAttribute("data-type", options.type)
    if (this.richColorsValue) toast.setAttribute("data-rich-colors", "true")

    // Build inner HTML
    let html = ""

    // Icon (if type)
    if (options.type) {
      html += `<div data-icon>${this.getIcon(options.type)}</div>`
    }

    // Content
    html += `<div data-content>`
    html += `<div data-title>${this.escapeHtml(message)}</div>`
    if (options.description) {
      html += `<div data-description>${this.escapeHtml(options.description)}</div>`
    }
    html += `</div>`

    // Action button
    if (options.action) {
      html += `<button data-button>${this.escapeHtml(options.action.label)}</button>`
    }

    // Close button
    if (this.closeButtonValue || options.closeButton) {
      html += `<button data-close-button aria-label="Close toast"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>`
    }

    toast.innerHTML = html

    // Event listeners
    const actionBtn = toast.querySelector("[data-button]")
    if (actionBtn && options.action) {
      actionBtn.addEventListener("click", () => {
        if (options.action.onClick) {
          options.action.onClick()
        }
        if (options.action.event) {
          document.dispatchEvent(new CustomEvent(options.action.event, { detail: options.action.data }))
        }
        this.dismiss(id)
      })
    }

    const closeBtn = toast.querySelector("[data-close-button]")
    if (closeBtn) {
      closeBtn.addEventListener("click", () => this.dismiss(id))
    }

    // Add hover listeners to individual toasts for expand/collapse
    toast.addEventListener("mouseenter", () => this.handleMouseEnter())
    toast.addEventListener("mouseleave", (e) => {
      // Only trigger leave if we're not moving to another toast or the toaster
      const relatedTarget = e.relatedTarget
      if (!relatedTarget || (!relatedTarget.closest('[data-sonner-toast]') && !relatedTarget.closest('[data-sonner-toaster]'))) {
        this.handleMouseLeave()
      }
    })

    return toast
  }

  escapeHtml(text) {
    const div = document.createElement("div")
    div.textContent = text
    return div.innerHTML
  }

  getIcon(type) {
    const icons = {
      success: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
      error: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
      info: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
      warning: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
      loading: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>`
    }
    return icons[type] || ""
  }

  updateToastPositions() {
    const visible = this.toasts.slice(-this.visibleToastsValue)
    const totalToasts = this.toasts.length
    const isExpanded = this.isHovered || this.expandValue

    // Use stored heights (or fallback to getBoundingClientRect for toasts not yet measured)
    const heights = this.toasts.map(t => t.height || t.element.getBoundingClientRect().height || 50)

    // For expanded mode, calculate offsets from front (most recent) to back
    // Front toast (most recent) has offset 0, older toasts stack above it
    let heightOffset = 0

    // Process from front (newest) to back (oldest)
    for (let i = totalToasts - 1; i >= 0; i--) {
      const t = this.toasts[i]
      const isVisible = visible.includes(t)
      const isFront = i === totalToasts - 1
      const toastsBefore = totalToasts - 1 - i

      t.element.setAttribute("data-visible", isVisible ? "true" : "false")
      t.element.setAttribute("data-front", isFront ? "true" : "false")
      t.element.setAttribute("data-expanded", isExpanded ? "true" : "false")
      t.element.style.setProperty("--z-index", i + 1)
      t.element.style.setProperty("--toasts-before", toastsBefore)
      // Only set --initial-height if we have a stored height (preserve original height)
      if (t.height) {
        t.element.style.setProperty("--initial-height", `${t.height}px`)
      }

      if (isExpanded) {
        // In expanded mode: front toast at offset 0, older toasts stack above
        t.element.style.setProperty("--offset", `${heightOffset}px`)
        if (isVisible) {
          heightOffset += heights[i] + this.gapValue
        }
      } else {
        // In collapsed mode, use toastsBefore for slight visual offset
        t.element.style.setProperty("--offset", `${toastsBefore * this.gapValue}px`)
      }
    }

    // Set front toast height for stacking calculations
    if (totalToasts > 0) {
      this.element.style.setProperty("--front-toast-height", `${heights[totalToasts - 1]}px`)

      // Calculate total height for the toaster container (for hover detection)
      const visibleCount = Math.min(totalToasts, this.visibleToastsValue)
      let totalHeight = 0
      if (isExpanded) {
        // Sum all visible toast heights + gaps
        for (let i = totalToasts - 1; i >= totalToasts - visibleCount; i--) {
          totalHeight += heights[i] + this.gapValue
        }
        totalHeight -= this.gapValue // Remove last gap
      } else {
        // Collapsed: front toast height + small offset for stacked appearance
        totalHeight = heights[totalToasts - 1] + (visibleCount - 1) * this.gapValue
      }
      this.element.style.height = `${totalHeight}px`
    } else {
      this.element.style.height = '0'
    }
  }

  dismiss(id) {
    const index = this.toasts.findIndex(t => t.id === id)
    if (index === -1) return

    const toast = this.toasts[index]

    // Clear any pending timer
    if (toast.timerId) {
      clearTimeout(toast.timerId)
    }

    toast.element.setAttribute("data-removed", "true")
    toast.element.setAttribute("data-front", "true")

    setTimeout(() => {
      toast.element.remove()
      // Find current index again as array may have changed during animation
      const currentIndex = this.toasts.findIndex(t => t.id === id)
      if (currentIndex !== -1) {
        this.toasts.splice(currentIndex, 1)
      }
      this.updateToastPositions()
    }, 400) // Match CSS transition duration
  }

  dismissAll() {
    const ids = this.toasts.map(t => t.id)
    ids.forEach(id => this.dismiss(id))
  }

  // Public API methods - triggered via Stimulus actions
  default(event) {
    const { message, description, duration } = event.params || {}
    if (message) {
      this.show(message, { description, duration })
    }
  }

  success(event) {
    const { message, description, duration } = event.params || {}
    if (message) {
      this.show(message, { type: "success", description, duration })
    }
  }

  error(event) {
    const { message, description, duration } = event.params || {}
    if (message) {
      this.show(message, { type: "error", description, duration })
    }
  }

  info(event) {
    const { message, description, duration } = event.params || {}
    if (message) {
      this.show(message, { type: "info", description, duration })
    }
  }

  warning(event) {
    const { message, description, duration } = event.params || {}
    if (message) {
      this.show(message, { type: "warning", description, duration })
    }
  }

  // Global event listener for triggering toasts from anywhere
  setupEventListeners() {
    this.boundHandleToast = this.handleToast.bind(this)
    document.addEventListener("ui:toast", this.boundHandleToast)
  }

  handleToast(event) {
    const detail = event.detail || {}
    const { type, message, description, duration, action, closeButton } = detail
    // Only create toast if message is a non-empty string
    if (message && typeof message === 'string' && message.trim()) {
      this.show(message.trim(), { type, description, duration, action, closeButton })
    }
  }

  disconnect() {
    document.removeEventListener("ui:toast", this.boundHandleToast)
    this.element.removeEventListener("mouseenter", this.boundHandleMouseEnter)
    this.element.removeEventListener("mouseleave", this.boundHandleMouseLeave)

    // Clear all timers
    this.toasts.forEach(t => {
      if (t.timerId) clearTimeout(t.timerId)
    })
  }
}
