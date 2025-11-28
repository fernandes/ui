# frozen_string_literal: true

# UI::InputGroupBehavior
#
# Shared behavior for InputGroup component across ERB, ViewComponent, and Phlex implementations.
# This module provides consistent styling and HTML attribute generation for input groups.
module UI::InputGroupBehavior
  # Returns HTML attributes for the input group wrapper
  def input_group_html_attributes
    attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
    {
      "data-slot": "input-group",
      role: "group",
      class: input_group_classes
    }.merge(attributes_value).compact
  end

  # Returns combined CSS classes for the input group
  def input_group_classes
    classes_value = respond_to?(:classes, true) ? classes : @classes
    TailwindMerge::Merger.new.merge([
      input_group_base_classes,
      input_group_height_classes,
      input_group_alignment_classes,
      input_group_focus_classes,
      input_group_error_classes,
      classes_value

    ].compact.join(" "))
  end

  private

  # Base classes - exact match from shadcn/ui
  def input_group_base_classes
    "group/input-group border-input dark:bg-input/30 relative flex w-full items-center rounded-md border shadow-xs transition-[color,box-shadow] outline-none"
  end

  # Height classes
  def input_group_height_classes
    "h-9 min-w-0 has-[>textarea]:h-auto"
  end

  # Alignment-specific classes for addon positioning
  def input_group_alignment_classes
    [
      "has-[>[data-align=inline-start]]:[&>input]:pl-2",
      "has-[>[data-align=inline-end]]:[&>input]:pr-2",
      "has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>[data-align=block-start]]:[&>input]:pb-3",
      "has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-end]]:[&>input]:pt-3"
    ].join(" ")
  end

  # Focus state classes
  def input_group_focus_classes
    "has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:ring-ring/50 has-[[data-slot=input-group-control]:focus-visible]:ring-[3px]"
  end

  # Error state classes
  def input_group_error_classes
    "has-[[data-slot][aria-invalid=true]]:ring-destructive/20 has-[[data-slot][aria-invalid=true]]:border-destructive dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40"
  end
end
