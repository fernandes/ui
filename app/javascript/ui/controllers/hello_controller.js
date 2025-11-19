import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["name", "output"]
  static values = {
    greeting: { type: String, default: "Hello" }
  }

  connect() {
    console.log("Hello controller connected!", this.element)
  }

  greet() {
    const name = this.hasNameTarget ? this.nameTarget.value : "World"
    const message = `${this.greetingValue}, ${name}!`

    if (this.hasOutputTarget) {
      this.outputTarget.textContent = message
    }

    console.log(message)
  }

  // Handle input changes
  updateGreeting() {
    if (this.hasNameTarget && this.hasOutputTarget) {
      this.greet()
    }
  }
}
