import { Controller } from "@hotwired/stimulus"

// Slider controller for range slider with draggable thumbs
// Supports single or multiple thumbs, horizontal/vertical orientation
export default class extends Controller {
  static targets = ["track", "range", "thumb"]
  static values = {
    min: { type: Number, default: 0 },
    max: { type: Number, default: 100 },
    step: { type: Number, default: 1 },
    value: { type: Array, default: [0] },
    disabled: { type: Boolean, default: false },
    orientation: { type: String, default: "horizontal" },
    inverted: { type: Boolean, default: false },
    name: { type: String, default: "" },
    centerPoint: { type: Number, default: null }
  }

  connect() {
    this.isDragging = false
    this.currentThumbIndex = -1

    // Set data-orientation on track and range for CSS styling
    const orientation = this.element.getAttribute("data-orientation")
    if (this.hasTrackTarget) {
      this.trackTarget.setAttribute("data-orientation", orientation)
    }
    if (this.hasRangeTarget) {
      this.rangeTarget.setAttribute("data-orientation", orientation)
    }

    // Initialize thumb positions
    this.updateUI()

    // Add keyboard support to thumbs
    this.thumbTargets.forEach((thumb, index) => {
      thumb.addEventListener("keydown", this.handleKeyDown.bind(this, index))
    })
  }

  disconnect() {
    this.thumbTargets.forEach((thumb, index) => {
      thumb.removeEventListener("keydown", this.handleKeyDown.bind(this, index))
    })
  }

  // Start dragging when pointer down on thumb
  startDrag(event) {
    if (this.disabledValue) return

    event.preventDefault()

    // Find which thumb was clicked
    const thumbIndex = this.thumbTargets.indexOf(event.currentTarget)
    this.currentThumbIndex = thumbIndex
    this.isDragging = true

    // Capture pointer for smooth dragging
    event.currentTarget.setPointerCapture(event.pointerId)

    // Add move and up listeners
    document.addEventListener("pointermove", this.handleMove.bind(this))
    document.addEventListener("pointerup", this.endDrag.bind(this))
  }

  // Handle pointer move during drag
  handleMove(event) {
    if (!this.isDragging || this.currentThumbIndex === -1) return

    event.preventDefault()

    // Calculate new value based on pointer position
    const newValue = this.getValueFromPointer(event)

    // Update the value array
    const newValues = [...this.valueValue]
    newValues[this.currentThumbIndex] = newValue

    // Sort values to prevent thumbs from crossing
    newValues.sort((a, b) => a - b)

    this.valueValue = newValues
    this.updateUI()
    this.dispatchChangeEvent()
  }

  // End dragging
  endDrag(event) {
    if (!this.isDragging) return

    this.isDragging = false
    this.currentThumbIndex = -1

    document.removeEventListener("pointermove", this.handleMove.bind(this))
    document.removeEventListener("pointerup", this.endDrag.bind(this))

    this.dispatchCommitEvent()
  }

  // Click on track to jump to position
  clickTrack(event) {
    if (this.disabledValue) return

    // Don't handle clicks on thumbs
    if (this.thumbTargets.some(thumb => thumb.contains(event.target))) return

    event.preventDefault()

    // Find closest thumb to clicked position
    const clickValue = this.getValueFromPointer(event)
    const closestIndex = this.getClosestThumbIndex(clickValue)

    // Update value
    const newValues = [...this.valueValue]
    newValues[closestIndex] = clickValue
    newValues.sort((a, b) => a - b)

    this.valueValue = newValues
    this.updateUI()
    this.dispatchChangeEvent()
    this.dispatchCommitEvent()
  }

  // Get value from pointer position
  getValueFromPointer(event) {
    if (!this.hasTrackTarget) return this.minValue

    const rect = this.trackTarget.getBoundingClientRect()
    let percentage

    if (this.orientationValue === "horizontal") {
      const x = event.clientX - rect.left
      percentage = x / rect.width
      if (this.invertedValue) percentage = 1 - percentage
    } else {
      const y = event.clientY - rect.top
      percentage = 1 - (y / rect.height)
      if (this.invertedValue) percentage = 1 - percentage
    }

    // Clamp percentage to 0-1
    percentage = Math.max(0, Math.min(1, percentage))

    // Convert to value
    const rawValue = this.minValue + percentage * (this.maxValue - this.minValue)

    // Snap to step
    const steppedValue = Math.round((rawValue - this.minValue) / this.stepValue) * this.stepValue + this.minValue

    // Clamp to min/max
    return Math.max(this.minValue, Math.min(this.maxValue, steppedValue))
  }

  // Find closest thumb to a value
  getClosestThumbIndex(value) {
    let closestIndex = 0
    let closestDistance = Math.abs(this.valueValue[0] - value)

    for (let i = 1; i < this.valueValue.length; i++) {
      const distance = Math.abs(this.valueValue[i] - value)
      if (distance < closestDistance) {
        closestDistance = distance
        closestIndex = i
      }
    }

    return closestIndex
  }

  // Keyboard navigation
  handleKeyDown(thumbIndex, event) {
    if (this.disabledValue) return

    let newValue = this.valueValue[thumbIndex]
    const largeStep = (this.maxValue - this.minValue) / 10

    switch (event.key) {
      case "ArrowRight":
      case "ArrowUp":
        newValue += this.stepValue
        event.preventDefault()
        break
      case "ArrowLeft":
      case "ArrowDown":
        newValue -= this.stepValue
        event.preventDefault()
        break
      case "PageUp":
        newValue += largeStep
        event.preventDefault()
        break
      case "PageDown":
        newValue -= largeStep
        event.preventDefault()
        break
      case "Home":
        newValue = this.minValue
        event.preventDefault()
        break
      case "End":
        newValue = this.maxValue
        event.preventDefault()
        break
      default:
        return
    }

    // Clamp value
    newValue = Math.max(this.minValue, Math.min(this.maxValue, newValue))

    // Update value array
    const newValues = [...this.valueValue]
    newValues[thumbIndex] = newValue
    newValues.sort((a, b) => a - b)

    this.valueValue = newValues
    this.updateUI()
    this.dispatchChangeEvent()
    this.dispatchCommitEvent()
  }

  // Update UI based on current values
  updateUI() {
    if (!this.hasTrackTarget) return

    // Update range visual
    if (this.hasRangeTarget) {
      let startValue, endValue

      // For single thumb: range goes from min (or centerPoint) to thumb position
      // For multiple thumbs: range goes from smallest to largest thumb
      if (this.valueValue.length === 1) {
        const currentValue = this.valueValue[0]

        // If centerPoint is defined, range goes from centerPoint to current value
        if (this.hasCenterPointValue && this.centerPointValue !== null) {
          // Range goes from center to current value (bidirectional)
          if (currentValue >= this.centerPointValue) {
            startValue = this.centerPointValue
            endValue = currentValue
          } else {
            startValue = currentValue
            endValue = this.centerPointValue
          }
        } else {
          // Default: range goes from min to current value
          startValue = this.minValue
          endValue = currentValue
        }
      } else {
        startValue = Math.min(...this.valueValue)
        endValue = Math.max(...this.valueValue)
      }

      const startPercent = ((startValue - this.minValue) / (this.maxValue - this.minValue)) * 100
      const endPercent = ((endValue - this.minValue) / (this.maxValue - this.minValue)) * 100

      if (this.orientationValue === "horizontal") {
        this.rangeTarget.style.left = `${startPercent}%`
        this.rangeTarget.style.width = `${endPercent - startPercent}%`
        this.rangeTarget.style.top = "0"
        this.rangeTarget.style.height = "100%"
      } else {
        this.rangeTarget.style.bottom = `${startPercent}%`
        this.rangeTarget.style.height = `${endPercent - startPercent}%`
        this.rangeTarget.style.left = "0"
        this.rangeTarget.style.width = "100%"
      }
    }

    // Update thumb positions
    this.thumbTargets.forEach((thumb, index) => {
      const value = this.valueValue[index] ?? this.minValue
      const percent = ((value - this.minValue) / (this.maxValue - this.minValue)) * 100

      if (this.orientationValue === "horizontal") {
        thumb.style.left = `${percent}%`
        thumb.style.top = "50%"
        thumb.style.transform = "translate(-50%, -50%)"
      } else {
        thumb.style.bottom = `${percent}%`
        thumb.style.left = "50%"
        thumb.style.transform = "translate(-50%, 50%)"
      }

      // Update ARIA attributes
      thumb.setAttribute("aria-valuenow", value)
      thumb.setAttribute("aria-valuemin", this.minValue)
      thumb.setAttribute("aria-valuemax", this.maxValue)
      thumb.setAttribute("aria-orientation", this.orientationValue)

      if (this.disabledValue) {
        thumb.setAttribute("aria-disabled", "true")
      } else {
        thumb.removeAttribute("aria-disabled")
      }
    })
  }

  // Dispatch change event
  dispatchChangeEvent() {
    this.element.dispatchEvent(new CustomEvent("slider:change", {
      bubbles: true,
      detail: { value: this.valueValue }
    }))
  }

  // Dispatch commit event (when dragging ends or keyboard navigation)
  dispatchCommitEvent() {
    this.element.dispatchEvent(new CustomEvent("slider:commit", {
      bubbles: true,
      detail: { value: this.valueValue }
    }))
  }

  // Watch for value changes
  valueValueChanged() {
    this.updateUI()
  }

  // Watch for disabled changes
  disabledValueChanged() {
    if (this.disabledValue) {
      this.element.setAttribute("data-disabled", "")
    } else {
      this.element.removeAttribute("data-disabled")
    }
    this.updateUI()
  }

  // Watch for orientation changes
  orientationValueChanged() {
    this.element.setAttribute("data-orientation", this.orientationValue)
    if (this.hasTrackTarget) {
      this.trackTarget.setAttribute("data-orientation", this.orientationValue)
    }
    if (this.hasRangeTarget) {
      this.rangeTarget.setAttribute("data-orientation", this.orientationValue)
    }
    this.updateUI()
  }
}
