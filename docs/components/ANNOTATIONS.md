# Component Documentation Annotations

Este documento descreve as anotações YARD e JSDoc usadas para documentar componentes UI.

## Ruby (YARD)

### Tags Customizadas para Componentes

```ruby
# @ui_component Select
#   Exibe uma lista de opções para o usuário escolher.
#
# @ui_category forms
#
# @ui_anatomy Select - Root container (required)
# @ui_anatomy Trigger - Button that opens dropdown (required)
# @ui_anatomy Content - Container for options (required)
# @ui_anatomy Item - Selectable option
#
# @ui_feature Single selection from a list
# @ui_feature Keyboard navigation
# @ui_feature Type-ahead search
#
# @ui_related combobox
# @ui_related dropdown_menu
```

### Tags para Parâmetros

```ruby
# @param value [String] Currently selected value
# @param disabled [Boolean] Whether the select is disabled
# @param name [String] Form field name
```

### Tags para Data Attributes

```ruby
# @ui_data_attr data-state ["open", "closed"] Current open/closed state
# @ui_data_attr data-side ["top", "bottom"] Which side content appears
# @ui_data_attr data-disabled ["true"] Present when disabled
```

### Tags para CSS Variables

```ruby
# @ui_css_var --trigger-width Width of the trigger element
# @ui_css_var --content-max-height Maximum height of content
```

### Tags para Acessibilidade

```ruby
# @ui_aria_pattern Listbox
# @ui_aria_reference https://www.w3.org/WAI/ARIA/apg/patterns/listbox/
# @ui_aria_attr role="combobox" on trigger
# @ui_aria_attr aria-expanded on trigger
# @ui_aria_attr aria-selected on items
```

### Tags para Keyboard

```ruby
# @ui_keyboard Space Opens dropdown when trigger focused
# @ui_keyboard Enter Opens dropdown / selects item
# @ui_keyboard ArrowDown Moves to next item
# @ui_keyboard Escape Closes dropdown
```

## JavaScript (JSDoc)

### Tags para Stimulus Controllers

```javascript
/**
 * @controller ui--select
 * @description Manages select dropdown state and interactions
 *
 * @target trigger - Button that toggles dropdown
 * @target content - Dropdown container
 * @target item - Selectable options
 *
 * @value open {Boolean} Controls open state
 * @value value {String} Current selected value
 *
 * @fires ui:select:change When selection changes
 */
export default class extends Controller {
  /**
   * Toggle the dropdown open/closed
   * @action
   */
  toggle() { }

  /**
   * Select an item
   * @action
   * @param {Event} event - Click event from item
   */
  selectItem(event) { }
}
```

## Exemplo Completo - Select Behavior

```ruby
# frozen_string_literal: true

# UI::SelectBehavior
#
# @ui_component Select
# @ui_description Displays a list of options for the user to pick from, triggered by a button.
# @ui_category forms
#
# @ui_anatomy Select - Root container with state management (required)
# @ui_anatomy Trigger - Button that opens the dropdown (required)
# @ui_anatomy Content - Container for the dropdown options (required)
# @ui_anatomy Item - Individual selectable option (required)
# @ui_anatomy Group - Groups related items with a label
# @ui_anatomy Label - Label for item groups
# @ui_anatomy Separator - Visual separator between items
#
# @ui_feature Single selection from a list of options
# @ui_feature Keyboard navigation with arrow keys
# @ui_feature Type-ahead search functionality
# @ui_feature Grouped options with labels
# @ui_feature Disabled items support
# @ui_feature Custom trigger with asChild pattern
# @ui_feature Placeholder text when no selection
# @ui_feature Form integration with hidden input
#
# @ui_data_attr data-state ["open", "closed"] Current open/closed state
# @ui_data_attr data-placeholder ["true"] Present when showing placeholder
# @ui_data_attr data-side ["top", "bottom"] Which side the content appears
#
# @ui_css_var --trigger-width Width of the trigger element
#
# @ui_aria_pattern Listbox
# @ui_aria_reference https://www.w3.org/WAI/ARIA/apg/patterns/listbox/
# @ui_aria_attr role="combobox" on the trigger
# @ui_aria_attr role="listbox" on the content container
# @ui_aria_attr role="option" on each item
# @ui_aria_attr aria-expanded on trigger
# @ui_aria_attr aria-selected on the selected item
# @ui_aria_attr aria-disabled on disabled items
#
# @ui_keyboard Space Opens dropdown when trigger is focused
# @ui_keyboard Enter Opens dropdown / selects highlighted item
# @ui_keyboard ArrowDown Opens dropdown / moves to next item
# @ui_keyboard ArrowUp Moves to previous item
# @ui_keyboard Home Moves to first item
# @ui_keyboard End Moves to last item
# @ui_keyboard Escape Closes dropdown
# @ui_keyboard A-Z,a-z Type-ahead to find matching item
#
# @ui_related combobox
# @ui_related dropdown_menu
# @ui_related radio_group
#
module UI::SelectBehavior
  # Returns HTML attributes for the select element
  #
  # @return [Hash] HTML attributes
  def select_html_attributes
    # ...
  end
end
```

## Exemplo Completo - Select Controller

```javascript
/**
 * Select Controller
 *
 * @controller ui--select
 * @description Manages select dropdown state, positioning, and keyboard navigation
 *
 * @target trigger - Button that toggles the dropdown
 * @target content - Dropdown container
 * @target item - Selectable option elements
 * @target valueDisplay - Span showing selected value text
 * @target hiddenInput - Hidden input for form submission
 * @target viewport - Scrollable viewport containing items
 *
 * @value open {Boolean} Controls dropdown visibility
 * @value value {String} Currently selected value
 *
 * @fires ui:select:change - Fired when selection changes (detail: { value, previousValue })
 */
export default class extends Controller {
  static targets = ["trigger", "content", "item", "valueDisplay", "hiddenInput", "viewport"]
  static values = { open: Boolean, value: String }

  /**
   * Toggle dropdown open/closed
   * @action
   */
  toggle(event) { }

  /**
   * Open the dropdown
   * @action
   */
  open() { }

  /**
   * Close the dropdown
   * @action
   */
  close() { }

  /**
   * Select an item from the dropdown
   * @action
   * @param {Event} event - Click event from the item
   */
  selectItem(event) { }
}
```
