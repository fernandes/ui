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

class AccordionController extends Controller {
  static targets=[ "item", "trigger", "content" ];
  static values={
    type: {
      type: String,
      default: "single"
    },
    collapsible: {
      type: Boolean,
      default: false
    }
  };
  connect() {
    this.setupItems();
  }
  setupItems() {
    this.itemTargets.forEach((item, index) => {
      const content = this.contentTargets[index];
      if (content) {
        const isOpen = item.dataset.state === "open";
        content.style.height = isOpen ? `${content.scrollHeight}px` : "0px";
        if (!isOpen) {
          content.setAttribute("hidden", "");
        }
      }
    });
  }
  toggle(event) {
    const trigger = event.currentTarget;
    const index = this.triggerTargets.indexOf(trigger);
    const item = this.itemTargets[index];
    const content = this.contentTargets[index];
    const isOpen = item.dataset.state === "open";
    const shouldOpen = !isOpen;
    if (this.typeValue === "single" && shouldOpen) {
      this.itemTargets.forEach((otherItem, otherIndex) => {
        if (otherIndex !== index) {
          this.updateItemState(otherItem, this.triggerTargets[otherIndex], this.contentTargets[otherIndex], false);
        }
      });
    }
    this.updateItemState(item, trigger, content, shouldOpen);
  }
  updateItemState(item, trigger, content, isOpen) {
    const state = isOpen ? "open" : "closed";
    item.dataset.state = state;
    trigger.dataset.state = state;
    trigger.setAttribute("aria-expanded", isOpen);
    content.dataset.state = state;
    const h3 = trigger.parentElement;
    if (h3 && h3.tagName === "H3") {
      h3.dataset.state = state;
    }
    if (isOpen) {
      content.removeAttribute("hidden");
      content.style.height = `${content.scrollHeight}px`;
    } else {
      content.style.height = "0px";
      content.addEventListener("transitionend", () => {
        if (content.dataset.state === "closed") {
          content.setAttribute("hidden", "");
        }
      }, {
        once: true
      });
    }
  }
}

class AlertDialogController extends Controller {
  static targets=[ "container", "overlay", "content" ];
  static values={
    open: {
      type: Boolean,
      default: false
    },
    closeOnEscape: {
      type: Boolean,
      default: true
    }
  };
  connect() {
    if (this.openValue) {
      this.show();
    }
  }
  open() {
    this.openValue = true;
    this.show();
  }
  close() {
    this.openValue = false;
    this.hide();
  }
  show() {
    if (this.hasContainerTarget) {
      this.containerTarget.setAttribute("data-state", "open");
    }
    if (this.hasOverlayTarget) {
      this.overlayTarget.setAttribute("data-state", "open");
    }
    if (this.hasContentTarget) {
      this.contentTarget.setAttribute("data-state", "open");
    }
    document.body.style.overflow = "hidden";
    this.setupFocusTrap();
    if (this.closeOnEscapeValue) {
      this.escapeHandler = e => {
        if (e.key === "Escape") {
          this.close();
        }
      };
      document.addEventListener("keydown", this.escapeHandler);
    }
    this.element.dispatchEvent(new CustomEvent("alertdialog:open", {
      bubbles: true,
      detail: {
        open: true
      }
    }));
  }
  hide() {
    if (this.hasContainerTarget) {
      this.containerTarget.setAttribute("data-state", "closed");
    }
    if (this.hasOverlayTarget) {
      this.overlayTarget.setAttribute("data-state", "closed");
    }
    if (this.hasContentTarget) {
      this.contentTarget.setAttribute("data-state", "closed");
    }
    document.body.style.overflow = "";
    if (this.escapeHandler) {
      document.removeEventListener("keydown", this.escapeHandler);
      this.escapeHandler = null;
    }
    this.element.dispatchEvent(new CustomEvent("alertdialog:close", {
      bubbles: true,
      detail: {
        open: false
      }
    }));
  }
  preventOverlayClose(event) {
    event.stopPropagation();
  }
  setupFocusTrap() {
    if (!this.hasContentTarget) return;
    const focusableElements = this.contentTarget.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }
  }
  disconnect() {
    document.body.style.overflow = "";
    if (this.escapeHandler) {
      document.removeEventListener("keydown", this.escapeHandler);
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
    "ui--dropdown": DropdownController,
    "ui--accordion": AccordionController,
    "ui--alert-dialog": AlertDialogController
  });
}

export { AccordionController, AlertDialogController, DropdownController, HelloController, registerControllers, registerControllersInto, version };
