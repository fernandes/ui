import { Controller } from "@hotwired/stimulus"

// Input OTP controller for one-time password inputs
//
// Like shadcn's input-otp: one real <input> (the `input` target, labelled,
// autocomplete="one-time-code") sits transparently over the slots, and this
// controller draws the input's value into the slots (`slot` targets) and marks
// the active one (`data-active`, and `data-caret` on an empty active slot).
// SMS / password-manager autofill, screen readers and forms all see a single
// ordinary text field; the slots are aria-hidden decoration.
//
// The caret is kept on one character at a time (a one-character selection),
// so typing over a filled slot replaces it.
export default class extends Controller {
  static targets = ["input", "slot"]
  static values = {
    length: { type: Number, default: 6 },
    pattern: { type: String, default: "\\d" }, // Regex for one valid character
    complete: { type: Boolean, default: false },
    autofocus: { type: Boolean, default: false }
  }

  constructor() {
    super(...arguments)
    this.handleReset = this.handleReset.bind(this)
  }

  connect() {
    this.focused = false
    this.completeValue = this.currentValue().length >= this.lengthValue
    this.render()

    this.form = this.hasInputTarget ? this.inputTarget.form : null
    if (this.form) this.form.addEventListener("reset", this.handleReset)

    // Only when asked for: stealing focus on every page load is disorienting.
    if (this.autofocusValue && this.hasInputTarget && !this.inputTarget.disabled) {
      this.inputTarget.focus()
    }
  }

  disconnect() {
    if (this.form) this.form.removeEventListener("reset", this.handleReset)
    this.form = null
  }

  // --- Events from the input ----------------------------------------------

  input() {
    const input = this.inputTarget
    const caret = input.selectionStart ?? input.value.length
    const before = this.sanitize(input.value.slice(0, caret))
    const cleaned = this.sanitize(input.value)
    if (cleaned !== input.value) {
      input.value = cleaned
      this.setCaret(Math.min(before.length, cleaned.length))
    }
    this.selectCurrent()
    this.render()
    this.checkComplete()
  }

  paste(event) {
    const text = event.clipboardData?.getData("text") ?? ""
    event.preventDefault()

    const input = this.inputTarget
    const pasted = this.sanitize(text)
    if (!pasted) return

    const start = input.selectionStart ?? input.value.length
    const end = input.selectionEnd ?? start
    const value = (input.value.slice(0, start) + pasted + input.value.slice(end)).slice(0, this.lengthValue)
    input.value = value
    this.setCaret(Math.min(start + pasted.length, value.length))
    this.selectCurrent()
    this.render()
    this.checkComplete()
    input.dispatchEvent(new Event("input", { bubbles: true }))
  }

  keydown(event) {
    if (event.altKey || event.ctrlKey || event.metaKey) return

    const index = this.activeIndex()
    const last = this.lastIndex()
    let next = null

    switch (event.key) {
      case "ArrowLeft":
        next = Math.max(0, index - 1)
        break
      case "ArrowRight":
        next = Math.min(last, index + 1)
        break
      case "Home":
        next = 0
        break
      case "End":
        next = last
        break
      default:
        return
    }

    event.preventDefault()
    this.moveTo(next)
  }

  focus() {
    this.focused = true
    // Like input-otp: focusing (or clicking) puts the caret after the last
    // character, so the next keystroke continues the code.
    requestAnimationFrame(() => {
      if (document.activeElement !== this.inputTarget) return
      this.moveTo(this.lastIndex())
    })
    this.moveTo(this.lastIndex())
  }

  blur() {
    this.focused = false
    this.render()
  }

  handleReset() {
    setTimeout(() => {
      this.completeValue = this.currentValue().length >= this.lengthValue
      this.render()
    }, 0)
  }

  // --- Caret / selection ----------------------------------------------------

  // The slot the caret is on.
  activeIndex() {
    if (!this.hasInputTarget) return 0
    const start = this.inputTarget.selectionStart ?? this.currentValue().length
    return Math.min(start, this.lengthValue - 1)
  }

  // Furthest slot the caret can go to: the first empty one, or the last slot.
  lastIndex() {
    return Math.min(this.currentValue().length, this.lengthValue - 1)
  }

  moveTo(index) {
    const value = this.currentValue()
    if (index < value.length) {
      this.setSelection(index, index + 1)
    } else {
      this.setCaret(index)
    }
    this.render()
  }

  // After typing, keep the caret on a single character so the next key
  // overwrites it (unless the caret is at the end of the value).
  selectCurrent() {
    const input = this.inputTarget
    const value = input.value
    if (input.selectionStart !== input.selectionEnd) return
    let index = input.selectionStart ?? value.length
    if (index >= this.lengthValue) index = this.lengthValue - 1
    if (index < value.length) this.setSelection(index, index + 1)
  }

  setCaret(index) {
    this.setSelection(index, index)
  }

  setSelection(start, end) {
    try {
      this.inputTarget.setSelectionRange(start, end)
    } catch {
      // Some input types don't support selection; nothing to do.
    }
  }

  // --- Drawing --------------------------------------------------------------

  render() {
    const value = this.currentValue()
    const active = this.focused && document.activeElement === this.inputTarget ? this.activeIndex() : -1

    this.slotTargets.forEach((slot, index) => {
      const char = value[index] || ""
      this.setSlotChar(slot, char)
      const isActive = index === active
      slot.setAttribute("data-active", isActive ? "true" : "false")
      if (isActive && !char) {
        slot.setAttribute("data-caret", "true")
      } else {
        slot.removeAttribute("data-caret")
      }
    })
  }

  setSlotChar(slot, char) {
    const first = slot.firstChild
    if (first && first.nodeType === Node.TEXT_NODE) {
      if (first.textContent !== char) first.textContent = char
    } else {
      slot.insertBefore(document.createTextNode(char), first)
    }
  }

  // --- Helpers --------------------------------------------------------------

  currentValue() {
    return this.hasInputTarget ? this.inputTarget.value : ""
  }

  // Keep only characters that match the pattern, up to the length.
  sanitize(text) {
    const regex = new RegExp(`^(?:${this.patternValue})$`)
    return Array.from(text).filter(char => regex.test(char)).join("").slice(0, this.lengthValue)
  }

  checkComplete() {
    const value = this.currentValue()
    const isComplete = value.length >= this.lengthValue
    const wasComplete = this.completeValue

    this.completeValue = isComplete

    if (isComplete && !wasComplete) {
      this.element.dispatchEvent(new CustomEvent("inputotp:complete", {
        bubbles: true,
        detail: { value }
      }))
    }
  }

  // --- Public API -----------------------------------------------------------

  getValue() {
    return this.currentValue()
  }

  clear() {
    if (!this.hasInputTarget) return
    this.inputTarget.value = ""
    this.completeValue = false
    this.inputTarget.focus()
    this.moveTo(0)
  }
}
