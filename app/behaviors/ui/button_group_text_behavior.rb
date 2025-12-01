# frozen_string_literal: true

# TextBehavior
#
# Shared behavior for ButtonGroupText component across ERB, ViewComponent, and Phlex implementations.
# This module provides consistent styling and HTML attribute generation.
#
# Based on shadcn/ui ButtonGroup: https://ui.shadcn.com/docs/components/button-group
module UI::ButtonGroupTextBehavior
  # Returns HTML attributes for the text element
  def text_html_attributes
    {
      class: text_classes
    }
  end

  # Returns combined CSS classes for the text element
  def text_classes
    classes_value = respond_to?(:classes, true) ? classes : @classes
    TailwindMerge::Merger.new.merge([
      text_base_classes,
      classes_value
    ].compact.join(" "))
  end

  private

  # Base classes applied to all button group text elements
  # Matches shadcn/ui v4 exactly
  def text_base_classes
    "bg-muted flex items-center gap-2 rounded-md border px-4 text-sm font-medium shadow-xs " \
    "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4"
  end
end
