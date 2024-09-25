import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  static targets = ["radio", "input"]

  connect() {
    this.radioClickHandlerBind = this.radioClickHandler.bind(this)
    this.radioTargets.forEach((x) => x.addEventListener('click', this.radioClickHandlerBind, { capture: true }))
    if (this.checkedRadio() === undefined) {
      this.radioTargets.forEach((x) => x.tabIndex = 0)
    }
  }

  disconnect() {
    this.radioTargets.forEach((x) => x.removeEventListener('click', this.radioClickHandlerBind, { capture: true }))
  }

  checkedRadio() {
    this.radioTargets.find((x) => x.checked)
  }

  radioClickHandler(e) {
    const buttonTargeted = this.radioTargets.find((x) => x.contains(e.target))
    if (buttonTargeted.ariaChecked === "true") {
      return true;
    }
    this.setButtonAsActive(buttonTargeted)
  }

  setButtonAsActive(button) {
    this.radioTargets.forEach((x) => {
      const checked = x == button
      if (checked) {
        this.radioMarkAsChecked(x)
      } else {
        this.radioMarkAsUnchecked(x)
      }
    })
  }

  radioMarkAsChecked(radio) {
    let span = radio.querySelector("span")
    radio.ariaChecked = true
    radio.setAttribute("aria-checked", true)
    radio.tabIndex = 0
    radio.focus();
    this.inputTarget.value = radio.value
    // span.style["display"] = "flex"
  }

  radioMarkAsUnchecked(radio) {
    let span = radio.querySelector("span")
    radio.ariaChecked = false
    radio.setAttribute("aria-checked", false)
    radio.tabIndex = -1
    // span.style["display"] = "none"
  }

  handleKeyUp(e) {
    if (this.buttonInsideHasFocus()) {
      e.preventDefault();
      const currentFocused = this.focusedRadioButton()
      const buttonBeforeFocused = this.radioButtonBefore(currentFocused)
      this.setButtonAsActive(buttonBeforeFocused)
    }
  }

  handleKeyDown(e) {
    if (this.buttonInsideHasFocus()) {
      e.preventDefault();
      const currentFocused = this.focusedRadioButton()
      const buttonAfterFocused = this.radioButtonAfter(currentFocused)
      this.setButtonAsActive(buttonAfterFocused)
    }
  }

  handleKeyEsc(e) {
    if (this.buttonInsideHasFocus()) {
      const currentFocused = this.focusedRadioButton()
      currentFocused.blur()
    }
  }

  buttonInsideHasFocus(e) {
    let focusInside = false
    this.radioTargets.forEach((x) => {
      if (x == document.activeElement) {
        focusInside = true
      }
    })
    return focusInside
  }

  focusedRadioButton() {
    return this.radioTargets.find((x) => x == document.activeElement)
  }

  isFocusedFirstItem() {
    return this.focusedRadioButton() == this.radioTargets[0]
  }

  isFocusedLastItem() {
    return this.focusedRadioButton() == this.radioTargets[-1]
  }

  radioButtonAfter(button) {
    if(button == this.radioTargets.at(-1)) {
      return this.radioTargets.at(0)
    }

    const buttonIndex = this.radioTargets.findIndex((el) => el == button)
    return this.radioTargets.at(buttonIndex + 1)
  }

  radioButtonBefore(button) {
    if(button == this.radioTargets.at(0)) {
      return this.radioTargets.at(-1)
    }

    const buttonIndex = this.radioTargets.findIndex((el) => el == button)
    return this.radioTargets.at(buttonIndex - 1)
  }
}
