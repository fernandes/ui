import { Controller } from "@hotwired/stimulus";

class HelloController extends Controller {
  static targets=[ "name", "output" ];
  static values={
    greeting: {
      type: String,
      default: "Hello"
    }
  };
  connect() {
    console.log("Hello controller connected!", this.element);
  }
  greet() {
    const name = this.hasNameTarget ? this.nameTarget.value : "World";
    const message = `${this.greetingValue}, ${name}!`;
    if (this.hasOutputTarget) {
      this.outputTarget.textContent = message;
    }
    console.log(message);
  }
  updateGreeting() {
    if (this.hasNameTarget && this.hasOutputTarget) {
      this.greet();
    }
  }
}

class DropdownController extends Controller {
  static targets=[ "menu" ];
  static classes=[ "open" ];
  connect() {
    console.log("Dropdown controller connected!", this.element);
    this.close();
  }
  toggle() {
    if (this.menuTarget.classList.contains(this.openClass)) {
      this.close();
    } else {
      this.open();
    }
  }
  open() {
    this.menuTarget.classList.add(this.openClass);
    this.element.setAttribute("aria-expanded", "true");
  }
  close() {
    this.menuTarget.classList.remove(this.openClass);
    this.element.setAttribute("aria-expanded", "false");
  }
  closeOnClickOutside(event) {
    if (!this.element.contains(event.target)) {
      this.close();
    }
  }
}

function registerControllersInto(application, controllers) {
  for (const [name, controller] of Object.entries(controllers)) {
    try {
      application.register(name, controller);
      console.log(`Registered Stimulus controller: ${name}`);
    } catch (error) {
      console.error(`Failed to register controller ${name}:`, error);
    }
  }
}

const version = "0.1.0";

function registerControllers(application) {
  return registerControllersInto(application, {
    "ui--hello": HelloController,
    "ui--dropdown": DropdownController
  });
}

export { DropdownController, HelloController, registerControllers, registerControllersInto, version };
