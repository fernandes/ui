# frozen_string_literal: true

# UI::InputGroupButtonBehavior
#
# Shared behavior for InputGroupButton component across ERB, ViewComponent, and Phlex implementations.
# This module provides consistent styling and HTML attribute generation for input group buttons.
module UI::InputGroupButtonBehavior
  # Returns HTML attributes for the input group button
  def input_group_button_html_attributes
    input_group_button_attributes
  end

  # Returns attributes to pass to the button component
  def input_group_button_attributes
    attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
    {
      type: @type,
      variant: @variant,
      classes: input_group_button_classes,
      "data-size": @size
    }.merge(attributes_value).compact
  end

  # Returns combined CSS classes for the button
  def input_group_button_classes
    classes_value = respond_to?(:classes, true) ? classes : @classes
    TailwindMerge::Merger.new.merge([
      input_group_button_base_classes,
      input_group_button_size_classes,
      classes_value

    ].compact.join(" "))
  end

  private

  # Base classes for input group buttons
  def input_group_button_base_classes
    "text-sm shadow-none flex gap-2 items-center"
  end

  # Size-specific classes
  def input_group_button_size_classes
    case @size.to_s
    when "xs"
      "h-6 gap-1 px-2 rounded-[calc(var(--radius)-5px)] [&>svg:not([class*='size-'])]:size-3.5 has-[>svg]:px-2"
    when "sm"
      "h-8 px-2.5 gap-1.5 rounded-md has-[>svg]:px-2.5"
    when "icon-xs"
      "size-6 rounded-[calc(var(--radius)-5px)] p-0 has-[>svg]:p-0"
    when "icon-sm"
      "size-8 p-0 has-[>svg]:p-0"
    else
      "h-6 gap-1 px-2 rounded-[calc(var(--radius)-5px)] [&>svg:not([class*='size-'])]:size-3.5 has-[>svg]:px-2"
    end
  end
end
