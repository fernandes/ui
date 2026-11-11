# frozen_string_literal: true

# ComboboxBehavior
#
# Shared behavior for Combobox wrapper component across ERB, ViewComponent, and Phlex implementations.
# This module provides consistent attribute generation for combobox functionality.
#
# The combobox pattern wraps a Popover/Drawer/DropdownMenu container and adds selection management:
# - Maintains selected value state
# - Updates target text when item is selected
# - Controls check icon visibility based on selection
# - Closes container after selection
#
# @example Usage with Popover (Phlex)
#   render UI::ComboboxWrapper.new(value: "next") do |combobox_attrs|
#     render UI::Popover.new(**combobox_attrs) do
#       # ... popover content
#     end
#   end
module UI::ComboboxBehavior
  # Returns HTML attributes for the combobox container (Popover/Drawer/DropdownMenu)
  # These attributes initialize the Stimulus controller and set the initial selected value
  #
  # @return [Hash] HTML attributes including Stimulus controller and value
  def combobox_html_attributes
    value = respond_to?(:value) ? value : (@value || "")

    {
      data: {
        controller: "ui--combobox",
        ui__combobox_value_value: value
      }
    }
  end

  # Returns HTML attributes for the text target element
  # This is typically a <span> inside the trigger button that displays the selected item's label
  #
  # @return [Hash] HTML attributes marking element as text target
  def combobox_text_html_attributes
    {
      data: {ui__combobox_target: "text"}
    }
  end

  # Returns HTML attributes for a command item
  # These attributes mark the item as a combobox target and associate it with a value
  #
  # @param value [String] The value associated with this item
  # @return [Hash] HTML attributes marking element as item target with value
  def combobox_item_html_attributes(value)
    {
      data: {
        ui__combobox_target: "item",
        value: value
      }
    }
  end
end
