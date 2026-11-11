import { Controller } from "@hotwired/stimulus"

// Slider controller for range slider with draggable thumbs
// Supports single or multiple thumbs, horizontal/vertical orientation
//
// Accessibility (Radix / React Aria / APG slider):
// - Each thumb is role="slider" with aria-valuenow/min/max/orientation; the
//   server renders them and this controller keeps them in sync.
// - Thumbs without a name get Radix's defaults: "Minimum"/"Maximum" for two
//   thumbs, "Value n of m" for more; a single thumb takes the slider's
//   aria-labelledby / aria-label.
// - Keys: Arrow keys move one step (Shift: a large step), PageUp/PageDown a
//   large step (10% of the range, snapped to the step), Home/End go to min/max.
//   `inverted` flips the arrow keys. A thumb stops at its neighbours instead of
//   swapping with them, so the focused thumb always shows its own value.
// - Form: one hidden input per value (`name`, or `name[]` for a range).
export default class extends Controller {
  static targets = ["track", "range", "thumb", "input"]
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

  constructor() {
    super(...arguments)
    // Bound once, so removeEventListener removes the same function (X8).
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleMove = this.handleMove.bind(this)
    this.endDrag = this.endDrag.bind(this)
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

    this.syncInputs()
    this.updateUI()
  }

  disconnect() {
    this.stopDragListeners()
  }

  thumbTargetConnected(thumb) {
    thumb.addEventListener("keydown", this.handleKeyDown)
  }

  thumbTargetDisconnected(thumb) {
    thumb.removeEventListener("keydown", this.handleKeyDown)
  }

  // Start dragging when pointer down on thumb
  startDrag(event) {
    if (this.disabledValue) return

    event.preventDefault()

    // Find which thumb was clicked
    const thumbIndex = this.thumbTargets.indexOf(event.currentTarget)
    this.currentThumbIndex = thumbIndex
    this.isDragging = true
    event.currentTarget.focus?.()

    // Capture pointer for smooth dragging
    event.currentTarget.setPointerCapture?.(event.pointerId)

    document.addEventListener("pointermove", this.handleMove)
    document.addEventListener("pointerup", this.endDrag)
  }

  // Handle pointer move during drag
  handleMove(event) {
    if (!this.isDragging || this.currentThumbIndex === -1) return

    event.preventDefault()
    this.setThumbValue(this.currentThumbIndex, this.getValueFromPointer(event), { commit: false })
  }

  // End dragging
  endDrag() {
    if (!this.isDragging) return

    this.isDragging = false
    this.currentThumbIndex = -1
    this.stopDragListeners()

    this.dispatchCommitEvent()
  }

  stopDragListeners() {
    document.removeEventListener("pointermove", this.handleMove)
    document.removeEventListener("pointerup", this.endDrag)
  }

  // Click on track to jump to position
  clickTrack(event) {
    if (this.disabledValue) return

    // Don't handle clicks on thumbs
    if (this.thumbTargets.some(thumb => thumb.contains(event.target))) return

    event.preventDefault()

    // Move the closest thumb to the clicked position
    const clickValue = this.getValueFromPointer(event)
    const closestIndex = this.getClosestThumbIndex(clickValue)
    this.setThumbValue(closestIndex, clickValue)
    this.thumbTargets[closestIndex]?.focus()
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

    return this.snap(this.minValue + percentage * (this.maxValue - this.minValue))
  }

  // Find closest thumb to a value
  getClosestThumbIndex(value) {
    let closestIndex = 0
    let closestDistance = Math.abs(this.valueValue[0] - value)

    for (let i = 1; i < this.valueValue.length; i++) {
      const distance = Math.abs(this.valueValue[i] - value)
      // On a tie (stacked thumbs), move the upper one when clicking above it
      if (distance < closestDistance || (distance === closestDistance && value > this.valueValue[i])) {
        closestDistance = distance
        closestIndex = i
      }
    }

    return closestIndex
  }

  // Keyboard navigation
  handleKeyDown(event) {
    const thumbIndex = this.thumbTargets.indexOf(event.currentTarget)
    if (thumbIndex === -1 || this.disabledValue) return

    const current = this.valueValue[thumbIndex] ?? this.minValue
    const largeStep = this.largeStep()
    const arrowStep = event.shiftKey ? largeStep : this.stepValue
    let newValue

    switch (event.key) {
      case "ArrowRight":
      case "ArrowLeft":
      case "ArrowUp":
      case "ArrowDown":
        newValue = current + (this.isIncreaseKey(event.key) ? arrowStep : -arrowStep)
        break
      case "PageUp":
        newValue = current + largeStep
        break
      case "PageDown":
        newValue = current - largeStep
        break
      case "Home":
        newValue = this.minValue
        break
      case "End":
        newValue = this.maxValue
        break
      default:
        return
    }

    event.preventDefault()
    this.setThumbValue(thumbIndex, newValue)
  }

  // Which arrow keys increase the value. Radix: horizontal increases to the
  // right, vertical upwards; `inverted` flips both axes.
  isIncreaseKey(key) {
    const horizontal = this.orientationValue !== "vertical"
    let increases = horizontal
      ? (key === "ArrowRight" || key === "ArrowUp")
      : (key === "ArrowUp" || key === "ArrowRight")
    if (this.invertedValue) {
      increases = horizontal
        ? (key === "ArrowLeft" || key === "ArrowUp")
        : (key === "ArrowDown" || key === "ArrowRight")
    }
    return increases
  }

  // 10% of the range, as a whole number of steps (at least one step).
  largeStep() {
    const steps = Math.max(1, Math.floor((this.maxValue - this.minValue) / 10 / this.stepValue))
    return steps * this.stepValue
  }

  // Snap to the step grid, clamp to min/max, and drop float noise.
  snap(value) {
    const stepped = Math.round((value - this.minValue) / this.stepValue) * this.stepValue + this.minValue
    const clamped = Math.max(this.minValue, Math.min(this.maxValue, stepped))
    return this.roundToStepPrecision(clamped)
  }

  roundToStepPrecision(value) {
    const decimals = Math.max(this.decimalCount(this.stepValue), this.decimalCount(this.minValue))
    return Number(value.toFixed(decimals))
  }

  decimalCount(number) {
    return (String(number).split(".")[1] || "").length
  }

  // Moves one thumb, clamped between its neighbours (React Aria), so thumbs
  // never swap and the focused thumb keeps its own value.
  setThumbValue(index, value, { commit = true } = {}) {
    const values = [...this.valueValue]
    const lower = index > 0 ? values[index - 1] : this.minValue
    const upper = index < values.length - 1 ? values[index + 1] : this.maxValue
    const next = Math.max(lower, Math.min(upper, this.snap(value)))
    if (next === values[index]) return

    values[index] = next
    this.valueValue = values
    this.dispatchChangeEvent()
    if (commit) this.dispatchCommitEvent()
  }

  // Hidden inputs that submit the value with the form (created if the
  // markup didn't render them).
  syncInputs() {
    if (!this.nameValue) return

    const values = this.valueValue
    const inputName = values.length > 1 ? `${this.nameValue}[]` : this.nameValue
    const inputs = this.inputTargets

    while (inputs.length < values.length) {
      const input = document.createElement("input")
      input.type = "hidden"
      input.setAttribute("data-ui--slider-target", "input")
      this.element.appendChild(input)
      inputs.push(input)
    }

    inputs.forEach((input, index) => {
      if (index >= values.length) {
        input.remove()
        return
      }
      input.name = inputName
      input.value = String(values[index])
      input.disabled = this.disabledValue
    })
  }

  // Radix defaults for thumbs that have no name of their own.
  labelThumbs() {
    const total = this.thumbTargets.length
    this.thumbTargets.forEach((thumb, index) => {
      const generated = thumb.dataset.uiSliderGeneratedLabel === "true"
      if (!generated && (thumb.hasAttribute("aria-label") || thumb.hasAttribute("aria-labelledby"))) return

      let label = null
      if (total > 2) label = `Value ${index + 1} of ${total}`
      else if (total === 2) label = ["Minimum", "Maximum"][index]

      thumb.removeAttribute("aria-label")
      thumb.removeAttribute("aria-labelledby")
      if (label) {
        thumb.setAttribute("aria-label", label)
      } else if (this.element.hasAttribute("aria-labelledby")) {
        thumb.setAttribute("aria-labelledby", this.element.getAttribute("aria-labelledby"))
      } else if (this.element.hasAttribute("aria-label")) {
        thumb.setAttribute("aria-label", this.element.getAttribute("aria-label"))
      } else {
        delete thumb.dataset.uiSliderGeneratedLabel
        return
      }
      thumb.dataset.uiSliderGeneratedLabel = "true"
    })
  }

  // Update UI based on current values
  updateUI() {
    if (!this.hasTrackTarget) return

    const range = this.maxValue - this.minValue || 1

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

      let startPercent = ((startValue - this.minValue) / range) * 100
      let endPercent = ((endValue - this.minValue) / range) * 100
      if (this.invertedValue) {
        [startPercent, endPercent] = [100 - endPercent, 100 - startPercent]
      }

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
      let percent = ((value - this.minValue) / range) * 100
      if (this.invertedValue) percent = 100 - percent

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
        thumb.setAttribute("tabindex", "-1")
      } else {
        thumb.removeAttribute("aria-disabled")
        thumb.setAttribute("tabindex", "0")
      }
    })

    this.labelThumbs()
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
    this.syncInputs()
    this.updateUI()
  }

  // Watch for disabled changes
  disabledValueChanged() {
    if (this.disabledValue) {
      this.element.setAttribute("data-disabled", "")
    } else {
      this.element.removeAttribute("data-disabled")
    }
    this.syncInputs()
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
