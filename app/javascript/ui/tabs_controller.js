import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  static targets = ["trigger", "content"]

  connect() {
    // this.element.textContent = "Hello from Tabs"
  }

  handleTriggerClick(e) {
    console.log("handleTriggerClick@tabs")
    const target = e.target
    const ariaControls = target.attributes["aria-controls"].value
    const content = this.findContentFor(ariaControls)
    console.log("handleTriggerClick@tabs", "aria-controls", ariaControls)
    console.log("handleTriggerClick@tabs", "content", content)
    this.unselectAllTrigers()
    this.selectTrigger(target)
    this.hideAllContents()
    this.showContent(content)
  }

  findContentFor(id) {
    console.log("findContentFor@tabs", id)
    return this.contentTargets.find((x) => {
      console.log("findContentFor@tabs find", x.attributes["aria-labelledby"])
      return x.id == id
    })
  }

  unselectAllTrigers() {
    this.triggerTargets.forEach((x) => {
      this.unselectTrigger(x)
    })
  }

  hideAllContents() {
    this.contentTargets.forEach((x) => {
      this.hideContent(x)
    })
  }

  hideContent(el) {
    el.dataset.state = "inactive"
    el.setAttribute("tabindex", -1)
  }

  unselectTrigger(el) {
    el.setAttribute("aria-selected", "false")
    el.dataset.state = "inactive"
  }

  showContent(el) {
    console.log("showContent@tabs", el)
    el.dataset.state = "active"
    el.setAttribute("tabindex", 0)
  }

  selectTrigger(el) {
    el.setAttribute("aria-selected", "true")
    el.dataset.state = "active"
  }
}
