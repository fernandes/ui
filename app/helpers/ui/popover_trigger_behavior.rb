# frozen_string_literal: true

# PopoverTriggerBehavior
#
# Shared behavior for PopoverTrigger component across ERB, ViewComponent, and Phlex implementations.
# This module provides consistent styling and HTML attribute generation.
module UI::PopoverTriggerBehavior
  # Returns HTML attributes for the popover trigger element
  def popover_trigger_html_attributes
    attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
    {
      class: popover_trigger_classes,
      data: { ui__popover_target: "trigger" }
    }.merge(attributes_value)
  end

  # Returns combined CSS classes for the popover trigger
  def popover_trigger_classes
    classes_value = respond_to?(:classes, true) ? classes : @classes
    TailwindMerge::Merger.new.merge([
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
