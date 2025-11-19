(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? factory(exports, require("@hotwired/stimulus")) : typeof define === "function" && define.amd ? define([ "exports", "@hotwired/stimulus" ], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, 
  factory(global.UI = {}, global.Stimulus));
})(this, function(exports, stimulus) {
  "use strict";
  class HelloController extends stimulus.Controller {
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
  class DropdownController extends stimulus.Controller {
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
  function registerControllers(application) {
    return registerControllersInto(application, {
      "ui--hello": HelloController,
      "ui--dropdown": DropdownController
    });
  }
  exports.registerControllers = registerControllers;
  exports.registerControllersInto = registerControllersInto;
});
