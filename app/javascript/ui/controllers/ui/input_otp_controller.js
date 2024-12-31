import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  static targets = ["input", "slot"]
  static classes = [ "focus" ]

  static values = {
    currentIndex: { type: Number, default: 0 },
    maxSize: { type: Number, default: 6 },
  }

  connect() {
    this.typedValue = []
    this.maxSizeValue = this.slotTargets.length
    this.inputTarget.setAttribute("maxlength", this.maxSizeValue)
  }

  handleClick() {
    console.log("handleClick@input-otp")
    this.focusCurrent()
  }

  handleFocus() {
    console.log("handleFocus@input-otp")
    this.focusCurrent()
  }

  handleInput(e) {
    console.log("handleInput@input-otp", e)

    // 65 to 90 is a-z should we support?!
    if(e.keyCode >= 48 && e.keyCode <= 57) {
      const value = e.key
      this.insertText(value)
    } else if (e.key == "Backspace") {
      this.deleteContentBackward()
    }
    console.log("this.currentIndexValue", this.currentIndexValue, "this.maxSizeValue", this.maxSizeValue)
  }

  insertText(value) {
    console.log("insertText@input-otp", value)
    this.writeSlotValue(value)
    if(this.isOnLastSlot()) {
      // replace last character
      this.typedValue.pop()
      this.typedValue.push(value)
      // and we dont move once there is not a next one
    } else {
      this.typedValue.push(value)
      this.moveToNextSlot()
    }
    this.inputTarget.setAttribute("value", this.typedValue.join(''))
  }

  deleteContentBackward() {
    console.log("deleteContentBackward@input-otp")
    this.writeSlotValue("")
    if(this.isOnFirstSlot()) {
      return
    } else if(this.isOnLastSlot()) {
      this.typedValue.pop()
      this.focusElement(this.currentSlot())
    } else {
      this.typedValue.pop()
      this.moveToPreviousSlot()
    }
    this.inputTarget.setAttribute("value", this.typedValue.join(''))
  }

  focusCurrent() {
    console.log("focusCurrent@otp")
    const currentSlot = this.currentSlot()
    console.log("current", currentSlot)
    if(currentSlot) {
      this.focusElement(currentSlot)
    }
  }

  writeSlotValue(value) {
    const currentSlot = this.currentSlot()
    const span = currentSlot.querySelector("span")
    span.classList.remove("hidden")
    span.innerText = value
    currentSlot.querySelector("div").classList.add("hidden")
  }

  isOnLastSlot() {
    return this.typedValue.length == this.maxSizeValue
  }

  isOnFirstSlot() {
    return this.typedValue.length == 0
  }

  currentSlot() {
    return this.slotTargets.at(this.currentIndexValue)
  }

  moveToNextSlot() {
    if(this.currentIndexValue == this.maxSizeValue - 1) return

    const currentSlot = this.currentSlot()
    this.blurElement(currentSlot)

    this.currentIndexValue = this.currentIndexValue + 1

    const nextSlot = this.slotTargets.at(this.currentIndexValue)
    if(!nextSlot) return

    this.focusElement(nextSlot)
  }

  moveToPreviousSlot() {
    if(this.currentIndexValue == 0) return

    const currentSlot = this.currentSlot()
    this.blurElement(currentSlot)

    if(this.currentIndexValue > 0) {
      this.currentIndexValue = this.currentIndexValue - 1
    }

    const previousSlot = this.slotTargets.at(this.currentIndexValue)
    if(!previousSlot) return
    this.focusElement(previousSlot)
  }

  focusElement(el) {
    el.classList.add(...this.focusClasses)
    // current.focus({focusVisible: true})
    el.querySelector("div").classList.remove("hidden")
    el.querySelector("span").classList.add("hidden")
  }

  blurElement(el) {
    if(this.currentIndexValue == this.maxSizeValue) return

    el.classList.remove(...this.focusClasses)
    // current.focus({focusVisible: true})
    el.querySelector("div").classList.add("hidden")
    el.querySelector("span").classList.remove("hidden")
  }
}
