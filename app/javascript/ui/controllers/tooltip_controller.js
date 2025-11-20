import { Controller } from "@hotwired/stimulus"
import { computePosition, flip, offset, shift, arrow, autoUpdate } from "@floating-ui/dom"

// Tooltip controller using Floating UI for positioning
// Structure: Tooltip (root) > Trigger + Content
// Note: Targets are optional because content is moved to document.body during connect()
export default class extends Controller {
  static targets = ["trigger", "content"]
  static values = {
    sideOffset: { type: Number, default: 4 },
    hoverDelay: { type: Number, default: 0 }
  }

  constructor() {
    super(...arguments)
    this.cleanup = null
    this.hoverTimeout = null
    this.isOpen = false
  }

  connect() {
    // Close on Escape key
    this.boundHandleEscape = this.handleEscape.bind(this)
    document.addEventListener('keydown', this.boundHandleEscape)

    // Store reference to content before moving it
    // Once we move it to body, Stimulus loses the target reference
    if (this.hasContentTarget) {
      this.content = this.contentTarget
      this.originalParent = this.content.parentNode

      // Move content to body on next tick after Stimulus has finished connecting
      requestAnimationFrame(() => {
        if (this.content) {
          document.body.appendChild(this.content)
        }
      })
    }
  }

  disconnect() {
    // Cleanup Floating UI auto-update
    if (this.cleanup) {
      this.cleanup()
      this.cleanup = null
    }

    // Clear hover timeout
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout)
      this.hoverTimeout = null
    }

    // Return content to original parent
    if (this.content && this.content.parentNode === document.body) {
      if (this.originalParent) {
        this.originalParent.appendChild(this.content)
      } else {
        document.body.removeChild(this.content)
      }
    }

    // Remove event listeners
    document.removeEventListener('keydown', this.boundHandleEscape)
  }

  show() {
    // Clear any pending hide timeout
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout)
      this.hoverTimeout = null
    }

    // Apply hover delay before showing
    this.hoverTimeout = setTimeout(() => {
      if (!this.content || !this.hasTriggerTarget) return

      this.isOpen = true
      this.content.setAttribute('data-state', 'open')

      // Update position with Floating UI
      this.updatePosition()
    }, this.hoverDelayValue)
  }

  hide() {
    // Clear show timeout if still pending
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout)
      this.hoverTimeout = null
    }

    if (!this.content) return

    this.isOpen = false
    this.content.setAttribute('data-state', 'closed')

    // Cleanup auto-update when hiding
    if (this.cleanup) {
      this.cleanup()
      this.cleanup = null
    }
  }

  handleEscape(event) {
    if (event.key === 'Escape' && this.isOpen) {
      this.hide()
    }
  }

  updatePosition() {
    if (!this.content || !this.hasTriggerTarget) return

    // Cleanup previous auto-update if exists
    if (this.cleanup) {
      this.cleanup()
    }

    // Get placement from content data attributes
    const side = this.content.getAttribute('data-side') || 'top'
    const align = this.content.getAttribute('data-align') || 'center'
    const placement = align === 'center' ? side : `${side}-${align}`

    // Setup middleware
    const middleware = [
      offset(this.sideOffsetValue),
      flip(),
      shift({ padding: 8 })
    ]

    // Use autoUpdate to keep position synchronized
    this.cleanup = autoUpdate(
      this.triggerTarget,
      this.content,
      () => {
        computePosition(this.triggerTarget, this.content, {
          placement: placement,
          middleware: middleware,
          strategy: 'absolute'
        }).then(({ x, y, placement: actualPlacement }) => {
          Object.assign(this.content.style, {
            position: 'absolute',
            left: `${x}px`,
            top: `${y}px`,
          })

          // Update data-side attribute based on actual placement
          const actualSide = actualPlacement.split('-')[0]
          this.content.setAttribute('data-side', actualSide)
        })
      },
      {
        ancestorScroll: true,
        ancestorResize: true,
        elementResize: true,
        layoutShift: true,
        animationFrame: true
      }
    )
  }
}
