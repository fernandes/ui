# frozen_string_literal: true

# UI::InputGroupTextBehavior
#
# Shared behavior for InputGroupText component across ERB, ViewComponent, and Phlex implementations.
# This module provides consistent styling and HTML attribute generation for input group text elements.
module UI::InputGroupTextBehavior
  # Returns HTML attributes for the text element
  def input_group_text_html_attributes
    attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
    {
      class: input_group_text_classes
    }.merge(attributes_value).compact
  end

  # Returns combined CSS classes for the text element
  def input_group_text_classes
    classes_value = respond_to?(:classes, true) ? classes : @classes
    TailwindMerge::Merger.new.merge([
      input_group_text_base_classes,
      classes_value

    ].compact.join(" "))
  end

  private

  # Base classes - exact match from shadcn/ui
  def input_group_text_base_classes
    "text-muted-foreground flex items-center gap-2 text-sm [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4"
  end
end
