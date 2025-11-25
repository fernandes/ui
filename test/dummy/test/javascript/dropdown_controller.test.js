import { describe, test, expect, beforeEach, afterEach } from "bun:test"
import { Application } from "@hotwired/stimulus"
import DropdownController from "../../../../app/javascript/ui/controllers/dropdown_controller.js"

describe("DropdownController", () => {
  let application
  let container

  beforeEach(() => {
    application = Application.start()
    application.register("ui--dropdown", DropdownController)
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  afterEach(() => {
    application.stop()
    document.body.innerHTML = ""
  })

  // Helper to create basic dropdown HTML
  function createDropdown(options = {}) {
    const { items = 3, withCheckbox = false, withRadio = false, withSubmenu = false } = options

    let itemsHtml = ""
    for (let i = 1; i <= items; i++) {
      itemsHtml += `<div role="menuitem" tabindex="-1" data-ui--dropdown-target="item">Item ${i}</div>`
    }

    if (withCheckbox) {
      itemsHtml += `
        <div role="menuitemcheckbox" tabindex="-1" data-state="unchecked" aria-checked="false" data-ui--dropdown-target="item" data-action="click->ui--dropdown#toggleCheckbox">
          <span class="absolute left-2"></span>
          Checkbox Item
        </div>
      `
    }

    if (withRadio) {
      itemsHtml += `
        <div role="group">
          <div role="menuitemradio" tabindex="-1" data-state="unchecked" aria-checked="false" data-ui--dropdown-target="item" data-action="click->ui--dropdown#selectRadio">
            <span class="absolute left-2"></span>
            Radio 1
          </div>
          <div role="menuitemradio" tabindex="-1" data-state="unchecked" aria-checked="false" data-ui--dropdown-target="item" data-action="click->ui--dropdown#selectRadio">
            <span class="absolute left-2"></span>
            Radio 2
          </div>
        </div>
      `
    }

    if (withSubmenu) {
      itemsHtml += `
        <div class="relative">
          <div role="menuitem" tabindex="-1" data-ui--dropdown-target="item"
               data-action="mouseenter->ui--dropdown#openSubmenu mouseleave->ui--dropdown#closeSubmenu">
            Submenu Trigger
          </div>
          <div role="menu" data-side="right" data-state="closed" class="hidden absolute">
            <div role="menuitem" tabindex="-1">Submenu Item 1</div>
            <div role="menuitem" tabindex="-1">Submenu Item 2</div>
          </div>
        </div>
      `
    }

    return `
      <div data-controller="ui--dropdown"
           data-ui--dropdown-placement-value="bottom-start"
           data-ui--dropdown-offset-value="4"
           data-ui--dropdown-flip-value="true">
        <button data-ui--dropdown-target="trigger" data-action="click->ui--dropdown#toggle">
          Open Menu
        </button>
        <div data-ui--dropdown-target="content" role="menu" data-state="closed" class="hidden absolute">
          ${itemsHtml}
        </div>
      </div>
    `
  }

  describe("Initialization", () => {
    test("connects with default values", async () => {
      container.innerHTML = createDropdown()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--dropdown"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--dropdown")

      expect(controller).not.toBeNull()
      expect(controller.openValue).toBe(false)
    })

    test("menu starts hidden with data-state closed", async () => {
      container.innerHTML = createDropdown()
      await new Promise(resolve => setTimeout(resolve, 10))

      const content = container.querySelector('[data-ui--dropdown-target="content"]')
      expect(content.classList.contains("hidden")).toBe(true)
      expect(content.getAttribute("data-state")).toBe("closed")
    })

    test("has trigger and content targets", async () => {
      container.innerHTML = createDropdown()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--dropdown"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--dropdown")

      expect(controller.hasTriggerTarget).toBe(true)
      expect(controller.hasContentTarget).toBe(true)
    })
  })

  describe("Toggle", () => {
    test("toggle opens menu", async () => {
      container.innerHTML = createDropdown()
      await new Promise(resolve => setTimeout(resolve, 10))

      const trigger = container.querySelector('[data-ui--dropdown-target="trigger"]')
      trigger.click()

      await new Promise(resolve => setTimeout(resolve, 150))

      const content = container.querySelector('[data-ui--dropdown-target="content"]')
      expect(content.classList.contains("hidden")).toBe(false)
      expect(content.getAttribute("data-state")).toBe("open")
    })

    test("toggle closes menu when open", async () => {
      container.innerHTML = createDropdown()
      await new Promise(resolve => setTimeout(resolve, 10))

      const trigger = container.querySelector('[data-ui--dropdown-target="trigger"]')

      // Open
      trigger.click()
      await new Promise(resolve => setTimeout(resolve, 150))

      // Close
      trigger.click()
      await new Promise(resolve => setTimeout(resolve, 50))

      const content = container.querySelector('[data-ui--dropdown-target="content"]')
      expect(content.classList.contains("hidden")).toBe(true)
      expect(content.getAttribute("data-state")).toBe("closed")
    })

    test("openValue updates on toggle", async () => {
      container.innerHTML = createDropdown()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--dropdown"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--dropdown")
      const trigger = container.querySelector('[data-ui--dropdown-target="trigger"]')

      expect(controller.openValue).toBe(false)

      trigger.click()
      await new Promise(resolve => setTimeout(resolve, 50))

      expect(controller.openValue).toBe(true)
    })
  })

  describe("Click Outside", () => {
    test("clicking outside closes menu", async () => {
      container.innerHTML = createDropdown()
      await new Promise(resolve => setTimeout(resolve, 10))

      const trigger = container.querySelector('[data-ui--dropdown-target="trigger"]')
      const content = container.querySelector('[data-ui--dropdown-target="content"]')

      // Open menu
      trigger.click()
      await new Promise(resolve => setTimeout(resolve, 150))
      expect(content.classList.contains("hidden")).toBe(false)

      // Click outside
      document.body.click()
      await new Promise(resolve => setTimeout(resolve, 50))

      expect(content.classList.contains("hidden")).toBe(true)
    })

    test("clicking inside menu does not close it", async () => {
      container.innerHTML = createDropdown()
      await new Promise(resolve => setTimeout(resolve, 10))

      const trigger = container.querySelector('[data-ui--dropdown-target="trigger"]')
      const content = container.querySelector('[data-ui--dropdown-target="content"]')

      // Open menu
      trigger.click()
      await new Promise(resolve => setTimeout(resolve, 150))

      // Click inside menu
      content.click()
      await new Promise(resolve => setTimeout(resolve, 50))

      expect(content.classList.contains("hidden")).toBe(false)
    })
  })

  describe("Keyboard Navigation - Basic", () => {
    test("ArrowDown moves focus to next item", async () => {
      container.innerHTML = createDropdown()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--dropdown"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--dropdown")
      const trigger = container.querySelector('[data-ui--dropdown-target="trigger"]')
      const items = container.querySelectorAll('[role="menuitem"]')

      // Open menu
      trigger.click()
      await new Promise(resolve => setTimeout(resolve, 150))

      // First item should be focused
      expect(items[0].getAttribute("tabindex")).toBe("0")

      // Press ArrowDown
      const event = new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true })
      element.dispatchEvent(event)
      await new Promise(resolve => setTimeout(resolve, 50))

      // Second item should now be focused
      expect(items[1].getAttribute("tabindex")).toBe("0")
      expect(items[0].getAttribute("tabindex")).toBe("-1")
    })

    test("ArrowUp moves focus to previous item", async () => {
      container.innerHTML = createDropdown()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--dropdown"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--dropdown")
      const trigger = container.querySelector('[data-ui--dropdown-target="trigger"]')
      const items = container.querySelectorAll('[role="menuitem"]')

      // Open menu
      trigger.click()
      await new Promise(resolve => setTimeout(resolve, 150))

      // Move to second item first
      const downEvent = new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true })
      element.dispatchEvent(downEvent)
      await new Promise(resolve => setTimeout(resolve, 50))

      // Press ArrowUp
      const upEvent = new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true })
      element.dispatchEvent(upEvent)
      await new Promise(resolve => setTimeout(resolve, 50))

      // First item should be focused again
      expect(items[0].getAttribute("tabindex")).toBe("0")
    })

    test("Home moves focus to first item", async () => {
      container.innerHTML = createDropdown()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--dropdown"]')
      const trigger = container.querySelector('[data-ui--dropdown-target="trigger"]')
      const items = container.querySelectorAll('[role="menuitem"]')

      // Open menu
      trigger.click()
      await new Promise(resolve => setTimeout(resolve, 150))

      // Move to last item
      const endEvent = new KeyboardEvent("keydown", { key: "End", bubbles: true })
      element.dispatchEvent(endEvent)
      await new Promise(resolve => setTimeout(resolve, 50))

      // Press Home
      const homeEvent = new KeyboardEvent("keydown", { key: "Home", bubbles: true })
      element.dispatchEvent(homeEvent)
      await new Promise(resolve => setTimeout(resolve, 50))

      // First item should be focused
      expect(items[0].getAttribute("tabindex")).toBe("0")
    })

    test("End moves focus to last item", async () => {
      container.innerHTML = createDropdown()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--dropdown"]')
      const trigger = container.querySelector('[data-ui--dropdown-target="trigger"]')
      const items = container.querySelectorAll('[role="menuitem"]')

      // Open menu
      trigger.click()
      await new Promise(resolve => setTimeout(resolve, 150))

      // Press End
      const event = new KeyboardEvent("keydown", { key: "End", bubbles: true })
      element.dispatchEvent(event)
      await new Promise(resolve => setTimeout(resolve, 50))

      // Last item should be focused
      expect(items[items.length - 1].getAttribute("tabindex")).toBe("0")
    })

    test("Escape closes menu", async () => {
      container.innerHTML = createDropdown()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--dropdown"]')
      const trigger = container.querySelector('[data-ui--dropdown-target="trigger"]')
      const content = container.querySelector('[data-ui--dropdown-target="content"]')

      // Open menu
      trigger.click()
      await new Promise(resolve => setTimeout(resolve, 150))
      expect(content.classList.contains("hidden")).toBe(false)

      // Press Escape
      const event = new KeyboardEvent("keydown", { key: "Escape", bubbles: true })
      element.dispatchEvent(event)
      await new Promise(resolve => setTimeout(resolve, 50))

      expect(content.classList.contains("hidden")).toBe(true)
    })
  })

  describe("Focus Management", () => {
    test("first item gets focus when menu opens", async () => {
      container.innerHTML = createDropdown()
      await new Promise(resolve => setTimeout(resolve, 10))

      const trigger = container.querySelector('[data-ui--dropdown-target="trigger"]')
      const items = container.querySelectorAll('[role="menuitem"]')

      // All items should have tabindex -1 initially
      items.forEach(item => {
        expect(item.getAttribute("tabindex")).toBe("-1")
      })

      // Open menu
      trigger.click()
      await new Promise(resolve => setTimeout(resolve, 150))

      // First item should have tabindex 0
      expect(items[0].getAttribute("tabindex")).toBe("0")
    })

    test("roving tabindex updates correctly", async () => {
      container.innerHTML = createDropdown()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--dropdown"]')
      const trigger = container.querySelector('[data-ui--dropdown-target="trigger"]')
      const items = container.querySelectorAll('[role="menuitem"]')

      // Open menu
      trigger.click()
      await new Promise(resolve => setTimeout(resolve, 150))

      // Navigate down twice
      const event1 = new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true })
      element.dispatchEvent(event1)
      await new Promise(resolve => setTimeout(resolve, 50))

      const event2 = new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true })
      element.dispatchEvent(event2)
      await new Promise(resolve => setTimeout(resolve, 50))

      // Only third item should have tabindex 0
      expect(items[0].getAttribute("tabindex")).toBe("-1")
      expect(items[1].getAttribute("tabindex")).toBe("-1")
      expect(items[2].getAttribute("tabindex")).toBe("0")
    })
  })

  describe("Checkbox Items", () => {
    test("toggleCheckbox changes checked state", async () => {
      container.innerHTML = createDropdown({ withCheckbox: true })
      await new Promise(resolve => setTimeout(resolve, 10))

      const checkbox = container.querySelector('[role="menuitemcheckbox"]')

      expect(checkbox.getAttribute("data-state")).toBe("unchecked")
      expect(checkbox.getAttribute("aria-checked")).toBe("false")

      // Click to toggle
      checkbox.click()
      await new Promise(resolve => setTimeout(resolve, 50))

      expect(checkbox.getAttribute("data-state")).toBe("checked")
      expect(checkbox.getAttribute("aria-checked")).toBe("true")
    })

    test("toggleCheckbox toggles back to unchecked", async () => {
      container.innerHTML = createDropdown({ withCheckbox: true })
      await new Promise(resolve => setTimeout(resolve, 10))

      const checkbox = container.querySelector('[role="menuitemcheckbox"]')

      // Toggle twice
      checkbox.click()
      await new Promise(resolve => setTimeout(resolve, 50))
      checkbox.click()
      await new Promise(resolve => setTimeout(resolve, 50))

      expect(checkbox.getAttribute("data-state")).toBe("unchecked")
      expect(checkbox.getAttribute("aria-checked")).toBe("false")
    })

    test("checkbox click does not close menu", async () => {
      container.innerHTML = createDropdown({ withCheckbox: true })
      await new Promise(resolve => setTimeout(resolve, 10))

      const trigger = container.querySelector('[data-ui--dropdown-target="trigger"]')
      const content = container.querySelector('[data-ui--dropdown-target="content"]')
      const checkbox = container.querySelector('[role="menuitemcheckbox"]')

      // Open menu
      trigger.click()
      await new Promise(resolve => setTimeout(resolve, 150))

      // Click checkbox
      checkbox.click()
      await new Promise(resolve => setTimeout(resolve, 50))

      // Menu should still be open
      expect(content.classList.contains("hidden")).toBe(false)
    })
  })

  describe("Radio Items", () => {
    test("selectRadio selects item", async () => {
      container.innerHTML = createDropdown({ withRadio: true })
      await new Promise(resolve => setTimeout(resolve, 10))

      const radios = container.querySelectorAll('[role="menuitemradio"]')

      expect(radios[0].getAttribute("data-state")).toBe("unchecked")

      // Click first radio
      radios[0].click()
      await new Promise(resolve => setTimeout(resolve, 50))

      expect(radios[0].getAttribute("data-state")).toBe("checked")
      expect(radios[0].getAttribute("aria-checked")).toBe("true")
    })

    test("selectRadio deselects other radios in group", async () => {
      container.innerHTML = createDropdown({ withRadio: true })
      await new Promise(resolve => setTimeout(resolve, 10))

      const radios = container.querySelectorAll('[role="menuitemradio"]')

      // Select first radio
      radios[0].click()
      await new Promise(resolve => setTimeout(resolve, 50))
      expect(radios[0].getAttribute("data-state")).toBe("checked")

      // Select second radio
      radios[1].click()
      await new Promise(resolve => setTimeout(resolve, 50))

      // First should be unchecked, second checked
      expect(radios[0].getAttribute("data-state")).toBe("unchecked")
      expect(radios[0].getAttribute("aria-checked")).toBe("false")
      expect(radios[1].getAttribute("data-state")).toBe("checked")
      expect(radios[1].getAttribute("aria-checked")).toBe("true")
    })

    test("radio click does not close menu", async () => {
      container.innerHTML = createDropdown({ withRadio: true })
      await new Promise(resolve => setTimeout(resolve, 10))

      const trigger = container.querySelector('[data-ui--dropdown-target="trigger"]')
      const content = container.querySelector('[data-ui--dropdown-target="content"]')
      const radio = container.querySelector('[role="menuitemradio"]')

      // Open menu
      trigger.click()
      await new Promise(resolve => setTimeout(resolve, 150))

      // Click radio
      radio.click()
      await new Promise(resolve => setTimeout(resolve, 50))

      // Menu should still be open
      expect(content.classList.contains("hidden")).toBe(false)
    })
  })

  describe("Submenus", () => {
    test("openSubmenu opens submenu on hover", async () => {
      container.innerHTML = createDropdown({ withSubmenu: true })
      await new Promise(resolve => setTimeout(resolve, 10))

      const trigger = container.querySelector('[data-ui--dropdown-target="trigger"]')
      const submenuTrigger = container.querySelector('.relative [role="menuitem"]')
      const submenu = container.querySelector('.relative [role="menu"]')

      // Open main menu
      trigger.click()
      await new Promise(resolve => setTimeout(resolve, 150))

      // Simulate mouseenter on submenu trigger
      const mouseenterEvent = new MouseEvent("mouseenter", { bubbles: true })
      submenuTrigger.dispatchEvent(mouseenterEvent)
      await new Promise(resolve => setTimeout(resolve, 50))

      expect(submenu.classList.contains("hidden")).toBe(false)
      expect(submenu.getAttribute("data-state")).toBe("open")
    })

    test("closeSubmenu closes submenu after delay", async () => {
      container.innerHTML = createDropdown({ withSubmenu: true })
      await new Promise(resolve => setTimeout(resolve, 10))

      const trigger = container.querySelector('[data-ui--dropdown-target="trigger"]')
      const submenuTrigger = container.querySelector('.relative [role="menuitem"]')
      const submenu = container.querySelector('.relative [role="menu"]')

      // Open main menu
      trigger.click()
      await new Promise(resolve => setTimeout(resolve, 150))

      // Open submenu
      const mouseenterEvent = new MouseEvent("mouseenter", { bubbles: true })
      submenuTrigger.dispatchEvent(mouseenterEvent)
      await new Promise(resolve => setTimeout(resolve, 50))
      expect(submenu.classList.contains("hidden")).toBe(false)

      // Simulate mouseleave - submenu should close after 300ms delay
      const mouseleaveEvent = new MouseEvent("mouseleave", { bubbles: true, relatedTarget: document.body })
      submenuTrigger.dispatchEvent(mouseleaveEvent)

      // Should still be open immediately
      expect(submenu.classList.contains("hidden")).toBe(false)

      // Wait for delay
      await new Promise(resolve => setTimeout(resolve, 350))

      expect(submenu.classList.contains("hidden")).toBe(true)
    })

    test("closeAllSubmenus closes all submenus", async () => {
      container.innerHTML = createDropdown({ withSubmenu: true })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--dropdown"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--dropdown")
      const trigger = container.querySelector('[data-ui--dropdown-target="trigger"]')
      const submenuTrigger = container.querySelector('.relative [role="menuitem"]')
      const submenu = container.querySelector('.relative [role="menu"]')

      // Open main menu and submenu
      trigger.click()
      await new Promise(resolve => setTimeout(resolve, 150))

      const mouseenterEvent = new MouseEvent("mouseenter", { bubbles: true })
      submenuTrigger.dispatchEvent(mouseenterEvent)
      await new Promise(resolve => setTimeout(resolve, 50))
      expect(submenu.classList.contains("hidden")).toBe(false)

      // Close all submenus
      controller.closeAllSubmenus()
      await new Promise(resolve => setTimeout(resolve, 50))

      expect(submenu.classList.contains("hidden")).toBe(true)
    })
  })

  describe("Keyboard Navigation - Submenus", () => {
    test("ArrowRight opens submenu", async () => {
      container.innerHTML = createDropdown({ withSubmenu: true })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--dropdown"]')
      const trigger = container.querySelector('[data-ui--dropdown-target="trigger"]')
      const submenu = container.querySelector('.relative [role="menu"]')

      // Open main menu
      trigger.click()
      await new Promise(resolve => setTimeout(resolve, 150))

      // Navigate to submenu trigger (it's the last item in the regular items)
      const items = container.querySelectorAll('[data-ui--dropdown-target="item"]')
      const submenuTriggerIndex = Array.from(items).findIndex(item =>
        item.closest('.relative') && item.getAttribute('role') === 'menuitem'
      )

      // Navigate to submenu trigger using End key
      const endEvent = new KeyboardEvent("keydown", { key: "End", bubbles: true })
      element.dispatchEvent(endEvent)
      await new Promise(resolve => setTimeout(resolve, 50))

      // Press ArrowRight to open submenu
      const rightEvent = new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true })
      element.dispatchEvent(rightEvent)
      await new Promise(resolve => setTimeout(resolve, 50))

      expect(submenu.classList.contains("hidden")).toBe(false)
    })

    test("ArrowLeft closes submenu", async () => {
      container.innerHTML = createDropdown({ withSubmenu: true })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--dropdown"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--dropdown")
      const trigger = container.querySelector('[data-ui--dropdown-target="trigger"]')
      const submenuTrigger = container.querySelector('.relative [role="menuitem"]')
      const submenu = container.querySelector('.relative [role="menu"]')

      // Open main menu
      trigger.click()
      await new Promise(resolve => setTimeout(resolve, 150))

      // Open submenu via hover first
      const mouseenterEvent = new MouseEvent("mouseenter", { bubbles: true })
      submenuTrigger.dispatchEvent(mouseenterEvent)
      await new Promise(resolve => setTimeout(resolve, 50))
      expect(submenu.classList.contains("hidden")).toBe(false)

      // Important: Reset all items in main menu to tabindex=-1
      // and set only the submenu item to tabindex=0 (simulating roving tabindex into submenu)
      const allItems = element.querySelectorAll('[role="menuitem"]')
      allItems.forEach(item => item.setAttribute("tabindex", "-1"))

      // Focus first item in submenu and update controller state
      const submenuItems = submenu.querySelectorAll('[role="menuitem"]')
      submenuItems[0].setAttribute("tabindex", "0")
      submenuItems[0].focus()
      controller.lastHoveredItem = submenuItems[0]

      // Press ArrowLeft to close submenu
      const leftEvent = new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true })
      element.dispatchEvent(leftEvent)
      await new Promise(resolve => setTimeout(resolve, 50))

      expect(submenu.classList.contains("hidden")).toBe(true)
    })
  })

  describe("Keyboard Navigation - Enter/Space", () => {
    test("Enter on regular item activates and closes menu", async () => {
      container.innerHTML = createDropdown()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--dropdown"]')
      const trigger = container.querySelector('[data-ui--dropdown-target="trigger"]')
      const content = container.querySelector('[data-ui--dropdown-target="content"]')
      const items = container.querySelectorAll('[role="menuitem"]')

      let clicked = false
      items[0].addEventListener("click", () => { clicked = true })

      // Open menu
      trigger.click()
      await new Promise(resolve => setTimeout(resolve, 150))

      // Press Enter on first item
      const event = new KeyboardEvent("keydown", { key: "Enter", bubbles: true })
      element.dispatchEvent(event)
      await new Promise(resolve => setTimeout(resolve, 50))

      expect(clicked).toBe(true)
      expect(content.classList.contains("hidden")).toBe(true)
    })

    test("Space on checkbox toggles without closing", async () => {
      container.innerHTML = createDropdown({ withCheckbox: true })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--dropdown"]')
      const trigger = container.querySelector('[data-ui--dropdown-target="trigger"]')
      const content = container.querySelector('[data-ui--dropdown-target="content"]')
      const checkbox = container.querySelector('[role="menuitemcheckbox"]')

      // Open menu
      trigger.click()
      await new Promise(resolve => setTimeout(resolve, 150))

      // Navigate to checkbox (it's after the regular items)
      const endEvent = new KeyboardEvent("keydown", { key: "End", bubbles: true })
      element.dispatchEvent(endEvent)
      await new Promise(resolve => setTimeout(resolve, 50))

      // Press Space
      const spaceEvent = new KeyboardEvent("keydown", { key: " ", bubbles: true })
      element.dispatchEvent(spaceEvent)
      await new Promise(resolve => setTimeout(resolve, 50))

      // Checkbox should be checked
      expect(checkbox.getAttribute("data-state")).toBe("checked")
      // Menu should still be open
      expect(content.classList.contains("hidden")).toBe(false)
    })

    test("Enter on checkbox toggles and closes", async () => {
      container.innerHTML = createDropdown({ withCheckbox: true })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--dropdown"]')
      const trigger = container.querySelector('[data-ui--dropdown-target="trigger"]')
      const content = container.querySelector('[data-ui--dropdown-target="content"]')
      const checkbox = container.querySelector('[role="menuitemcheckbox"]')

      // Open menu
      trigger.click()
      await new Promise(resolve => setTimeout(resolve, 150))

      // Navigate to checkbox
      const endEvent = new KeyboardEvent("keydown", { key: "End", bubbles: true })
      element.dispatchEvent(endEvent)
      await new Promise(resolve => setTimeout(resolve, 50))

      // Press Enter
      const enterEvent = new KeyboardEvent("keydown", { key: "Enter", bubbles: true })
      element.dispatchEvent(enterEvent)
      await new Promise(resolve => setTimeout(resolve, 200))

      // Checkbox should be checked
      expect(checkbox.getAttribute("data-state")).toBe("checked")
      // Menu should be closed
      expect(content.classList.contains("hidden")).toBe(true)
    })
  })

  describe("getFocusableItems", () => {
    test("returns only non-disabled items", async () => {
      container.innerHTML = `
        <div data-controller="ui--dropdown">
          <button data-ui--dropdown-target="trigger" data-action="click->ui--dropdown#toggle">Open</button>
          <div data-ui--dropdown-target="content" role="menu" data-state="closed" class="hidden">
            <div role="menuitem" tabindex="-1" data-ui--dropdown-target="item">Item 1</div>
            <div role="menuitem" tabindex="-1" data-ui--dropdown-target="item" data-disabled>Disabled Item</div>
            <div role="menuitem" tabindex="-1" data-ui--dropdown-target="item">Item 2</div>
          </div>
        </div>
      `
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--dropdown"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--dropdown")
      const trigger = container.querySelector('[data-ui--dropdown-target="trigger"]')

      // Open menu
      trigger.click()
      await new Promise(resolve => setTimeout(resolve, 150))

      const focusableItems = controller.getFocusableItems()

      // Should only return 2 items (excluding disabled)
      expect(focusableItems.length).toBe(2)
    })

    test("includes items in radio groups", async () => {
      container.innerHTML = createDropdown({ withRadio: true })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--dropdown"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--dropdown")
      const trigger = container.querySelector('[data-ui--dropdown-target="trigger"]')

      // Open menu
      trigger.click()
      await new Promise(resolve => setTimeout(resolve, 150))

      const focusableItems = controller.getFocusableItems()

      // Should include the 3 regular items + 2 radio items
      expect(focusableItems.length).toBe(5)
    })

    test("includes items in relative containers (submenus)", async () => {
      container.innerHTML = createDropdown({ withSubmenu: true })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--dropdown"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--dropdown")
      const trigger = container.querySelector('[data-ui--dropdown-target="trigger"]')

      // Open menu
      trigger.click()
      await new Promise(resolve => setTimeout(resolve, 150))

      const focusableItems = controller.getFocusableItems()

      // Should include the 3 regular items + submenu trigger (not submenu items until opened)
      expect(focusableItems.length).toBe(4)
    })
  })

  describe("Hover Tracking", () => {
    test("trackHoveredItem updates tabindex on hover", async () => {
      container.innerHTML = createDropdown()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--dropdown"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--dropdown")
      const trigger = container.querySelector('[data-ui--dropdown-target="trigger"]')
      const items = container.querySelectorAll('[role="menuitem"]')

      // Open menu
      trigger.click()
      await new Promise(resolve => setTimeout(resolve, 150))

      // Simulate hover on second item
      const hoverEvent = { currentTarget: items[1] }
      controller.trackHoveredItem(hoverEvent)
      await new Promise(resolve => setTimeout(resolve, 50))

      // Second item should have tabindex 0
      expect(items[1].getAttribute("tabindex")).toBe("0")
      // First item should have tabindex -1
      expect(items[0].getAttribute("tabindex")).toBe("-1")
    })

    test("lastHoveredItem is tracked", async () => {
      container.innerHTML = createDropdown()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--dropdown"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--dropdown")
      const trigger = container.querySelector('[data-ui--dropdown-target="trigger"]')
      const items = container.querySelectorAll('[role="menuitem"]')

      // Open menu
      trigger.click()
      await new Promise(resolve => setTimeout(resolve, 150))

      // Simulate hover on second item
      const hoverEvent = { currentTarget: items[1] }
      controller.trackHoveredItem(hoverEvent)

      expect(controller.lastHoveredItem).toBe(items[1])
    })
  })

  describe("Close Method", () => {
    test("close method closes menu and resets state", async () => {
      container.innerHTML = createDropdown()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--dropdown"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--dropdown")
      const trigger = container.querySelector('[data-ui--dropdown-target="trigger"]')
      const content = container.querySelector('[data-ui--dropdown-target="content"]')

      // Open menu
      trigger.click()
      await new Promise(resolve => setTimeout(resolve, 150))
      expect(controller.openValue).toBe(true)

      // Close menu
      controller.close()
      await new Promise(resolve => setTimeout(resolve, 50))

      expect(controller.openValue).toBe(false)
      expect(content.classList.contains("hidden")).toBe(true)
      expect(content.getAttribute("data-state")).toBe("closed")
    })

    test("close resets all item tabindexes", async () => {
      container.innerHTML = createDropdown()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--dropdown"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--dropdown")
      const trigger = container.querySelector('[data-ui--dropdown-target="trigger"]')
      const items = container.querySelectorAll('[role="menuitem"]')

      // Open menu (first item gets tabindex 0)
      trigger.click()
      await new Promise(resolve => setTimeout(resolve, 150))
      expect(items[0].getAttribute("tabindex")).toBe("0")

      // Close menu
      controller.close()
      await new Promise(resolve => setTimeout(resolve, 50))

      // All items should have tabindex -1
      items.forEach(item => {
        expect(item.getAttribute("tabindex")).toBe("-1")
      })
    })

    test("close with returnFocus returns focus to trigger", async () => {
      container.innerHTML = createDropdown()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--dropdown"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--dropdown")
      const trigger = container.querySelector('[data-ui--dropdown-target="trigger"]')

      // Open menu
      trigger.click()
      await new Promise(resolve => setTimeout(resolve, 150))

      // Close with return focus
      controller.close({ returnFocus: true })
      await new Promise(resolve => setTimeout(resolve, 200))

      expect(document.activeElement).toBe(trigger)
    })
  })

  describe("Disconnect", () => {
    test("disconnect removes event listeners", async () => {
      container.innerHTML = createDropdown()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--dropdown"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--dropdown")
      const trigger = container.querySelector('[data-ui--dropdown-target="trigger"]')

      // Open menu
      trigger.click()
      await new Promise(resolve => setTimeout(resolve, 150))

      // Disconnect
      controller.disconnect()

      // Should not throw when clicking outside
      document.body.click()
      await new Promise(resolve => setTimeout(resolve, 50))
    })

    test("disconnect clears submenu timeouts", async () => {
      container.innerHTML = createDropdown({ withSubmenu: true })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--dropdown"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--dropdown")
      const trigger = container.querySelector('[data-ui--dropdown-target="trigger"]')
      const submenuTrigger = container.querySelector('.relative [role="menuitem"]')

      // Open menu and start closing submenu (which sets a timeout)
      trigger.click()
      await new Promise(resolve => setTimeout(resolve, 150))

      const mouseenterEvent = new MouseEvent("mouseenter", { bubbles: true })
      submenuTrigger.dispatchEvent(mouseenterEvent)
      await new Promise(resolve => setTimeout(resolve, 50))

      const mouseleaveEvent = new MouseEvent("mouseleave", { bubbles: true, relatedTarget: document.body })
      submenuTrigger.dispatchEvent(mouseleaveEvent)

      // Disconnect should clear the timeout
      controller.disconnect()

      // Should not throw
      expect(controller.closeSubmenuTimeouts.size).toBe(0)
    })
  })
})
