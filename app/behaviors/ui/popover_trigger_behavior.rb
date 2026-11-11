# frozen_string_literal: true

# PopoverTriggerBehavior
#
# Shared behavior for PopoverTrigger component across ERB, ViewComponent, and Phlex implementations.
# This module provides consistent styling and HTML attribute generation.
module UI::PopoverTriggerBehavior
  # Returns HTML attributes for the popover trigger element
  def popover_trigger_html_attributes
    attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
    attrs = {
      class: popover_trigger_classes,
      data: {ui__popover_target: "trigger"}
    }

    # With as_child the trigger IS the button, so it carries the static ARIA.
    # The default wrapper is a <div>: the controller puts aria-* on the
    # focusable element inside it. aria-controls is wired on connect.
    if instance_variable_defined?(:@as_child) && @as_child
      attrs[:"aria-haspopup"] = "dialog"
      attrs[:"aria-expanded"] = "false"
    end

    attrs.merge(attributes_value)
  end

  # Returns combined CSS classes for the popover trigger
  def popover_trigger_classes
    classes_value = respond_to?(:classes, true) ? classes : @classes
    UI::ClassMerger.merge([
      popover_trigger_base_classes,
      classes_value

    ].compact.join(" "))
  end

  private

  # Base classes applied to all popover triggers - inline flex for proper alignment
  def popover_trigger_base_classes
    "inline-flex"
  end
end
