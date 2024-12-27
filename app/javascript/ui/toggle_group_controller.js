import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  static targets = ["toggle"]
  static values = {
    type: { type: String, default: "multiple" },
  }

  handleTogglePressed(e) {
    console.log("handleTogglePressed@toggle-group")
    if(this.typeValue == "multiple") return

    const target = e.target
    this.toggleTargets.forEach((el) => {
      console.log("checking el", el, target, el == target)
      if(el != target) {
        const toggleController = this.application.getControllerForElementAndIdentifier(el, "ui--toggle");
        toggleController.unpress(el);
      }
    })
  }
}
