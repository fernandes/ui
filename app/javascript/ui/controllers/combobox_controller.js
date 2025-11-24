import { Controller } from "@hotwired/stimulus"

// Combobox controller for managing selection state
// Works with Command component to provide combobox functionality:
// - Maintains selected value state
// - Updates text target when item is selected
// - Controls check icon visibility (opacity-0/100)
// - Closes container (Popover/Drawer) after selection
//
// This controller should be attached to the container element (Popover/Drawer/DropdownMenu)
// and listens for command:select events from Command items inside
export default class extends Controller {
  static targets = ["text", "item"]
  static values = {
    value: String  // Currently selected value
  }

  connect() {
    // Listen for command:select event from Command items
    this.boundHandleSelect = this.handleSelect.bind(this)
    this.element.addEventListener('command:select', this.boundHandleSelect)

    // Apply initial state if value is set
    if (this.valueValue) {
      this.updateCheckIcons()
    }
  }

  disconnect() {
    this.element.removeEventListener('command:select', this.boundHandleSelect)
  }

  // Handle when a Command item is selected
  handleSelect(event) {
    const { value, item } = event.detail

    // Update selected value
    this.valueValue = value

    // Update text target (span inside button) with selected item's label
    if (this.hasTextTarget) {
      const label = item.querySelector('span')?.textContent || value
      this.textTarget.textContent = label
    }

    // Update check icon visibility for all items
    this.updateCheckIcons()

    // Close the container (Popover/Drawer)
    this.closeContainer()
  }

  // Update check icon visibility based on selected value
  // Items matching the selected value get opacity-100, others get opacity-0
  updateCheckIcons() {
    this.itemTargets.forEach(item => {
      const itemValue = item.dataset.value
      const checkIcon = item.querySelector('svg.ml-auto')

      if (checkIcon) {
        if (itemValue === this.valueValue) {
          checkIcon.classList.remove('opacity-0')
          checkIcon.classList.add('opacity-100')
        } else {
          checkIcon.classList.remove('opacity-100')
          checkIcon.classList.add('opacity-0')
        }
      }
    })
  }

  // Close the container (Popover, Drawer, or DropdownMenu)
  closeContainer() {
    // Try to find and close Popover controller
    const popoverController = this.application.getControllerForElementAndIdentifier(
      this.element,
      'ui--popover'
    )
    if (popoverController) {
      popoverController.hide()
      return
    }

    // Try to find and close Drawer controller (on this element or child)
    let drawerController = this.application.getControllerForElementAndIdentifier(
      this.element,
      'ui--drawer'
    )
    if (!drawerController) {
      // Search for drawer in child elements
      const drawerElement = this.element.querySelector('[data-controller~="ui--drawer"]')
      if (drawerElement) {
        drawerController = this.application.getControllerForElementAndIdentifier(
          drawerElement,
          'ui--drawer'
        )
      }
    }
    if (drawerController) {
      drawerController.hide()
      return
    }

    // Try to find and close DropdownMenu controller
    const dropdownController = this.application.getControllerForElementAndIdentifier(
      this.element,
      'ui--dropdown'
    )
    if (dropdownController) {
      dropdownController.close()
    }
  }
}
