import { Controller } from "@hotwired/stimulus"

// Input OTP controller for one-time password inputs
// Adapted from input-otp library behavior for Rails/Stimulus
export default class extends Controller {
  static targets = ["input"]
  static values = {
    length: { type: Number, default: 6 },
    pattern: { type: String, default: "\\d" }, // Regex pattern for valid characters
    complete: { type: Boolean, default: false }
  }

  connect() {
    // Focus first input on mount
    if (this.hasInputTarget) {
      this.inputTargets[0]?.focus()
    }
  }

  input(event) {
    const input = event.target
    const value = input.value
    const index = this.inputTargets.indexOf(input)

    // Validate against pattern
    const regex = new RegExp(`^${this.patternValue}$`)
    if (value && !regex.test(value)) {
      input.value = ""
      return
    }

    // If value entered, move to next input
    if (value && index < this.inputTargets.length - 1) {
      this.inputTargets[index + 1].focus()
    }

    // Check if complete
    this.checkComplete()
  }

  keydown(event) {
    const input = event.target
    const index = this.inputTargets.indexOf(input)

    // Handle backspace
    if (event.key === "Backspace") {
      // If current input is empty and not first, move to previous
      if (!input.value && index > 0) {
        event.preventDefault()
        this.inputTargets[index - 1].focus()
        this.inputTargets[index - 1].value = ""
      }
    }

    // Handle arrow keys for navigation
    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault()
      this.inputTargets[index - 1].focus()
    }

    if (event.key === "ArrowRight" && index < this.inputTargets.length - 1) {
      event.preventDefault()
      this.inputTargets[index + 1].focus()
    }

    // Handle Home/End
    if (event.key === "Home") {
      event.preventDefault()
      this.inputTargets[0].focus()
    }

    if (event.key === "End") {
      event.preventDefault()
      this.inputTargets[this.inputTargets.length - 1].focus()
    }
  }

  paste(event) {
    event.preventDefault()

    const pastedData = event.clipboardData.getData("text").trim()
    const regex = new RegExp(`^${this.patternValue}+$`)

    // Validate entire pasted string
    if (!regex.test(pastedData)) {
      return
    }

    // Distribute characters across inputs
    const chars = pastedData.split("")
    chars.forEach((char, index) => {
      if (index < this.inputTargets.length) {
        this.inputTargets[index].value = char
      }
    })

    // Focus next empty input or last input
    const nextEmptyIndex = this.inputTargets.findIndex(input => !input.value)
    if (nextEmptyIndex >= 0) {
      this.inputTargets[nextEmptyIndex].focus()
    } else {
      this.inputTargets[this.inputTargets.length - 1].focus()
    }

    // Check if complete
    this.checkComplete()
  }

  checkComplete() {
    const allFilled = this.inputTargets.every(input => input.value)
    const wasComplete = this.completeValue

    this.completeValue = allFilled

    if (allFilled && !wasComplete) {
      const value = this.inputTargets.map(input => input.value).join("")

      // Dispatch complete event
      this.element.dispatchEvent(new CustomEvent("inputotp:complete", {
        bubbles: true,
        detail: { value }
      }))
    }
  }

  getValue() {
    return this.inputTargets.map(input => input.value).join("")
  }

  clear() {
    this.inputTargets.forEach(input => {
      input.value = ""
    })
    this.completeValue = false
    if (this.hasInputTarget) {
      this.inputTargets[0].focus()
    }
  }
}
