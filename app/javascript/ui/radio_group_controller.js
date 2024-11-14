import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  static targets = ["radio", "anput"]

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
    return this.radioTargets.find((x) => (x.dataset.state == "checked"))
  }

  radioClickHandler(e) {
    const buttonTargeted = this.radioTargets.find((x) => x.contains(e.target))
    if (buttonTargeted.dataset.state === "checked") {
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
    radio.setAttribute("aria-checked", true)
    radio.dataset.state = "checked"
    radio.tabIndex = 0
    radio.focus();
    span.dataset.state = "checked"
    span.classList.remove("hidden")
    // this.inputTarget.value = radio.value
    // span.style["display"] = "flex"
  }

  radioMarkAsUnchecked(radio) {
    let span = radio.querySelector("span")
    radio.setAttribute("aria-checked", false)
    radio.dataset.state = "unchecked"
    radio.tabIndex = -1
    span.dataset.state = "unchecked"
    span.classList.add("hidden")
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
