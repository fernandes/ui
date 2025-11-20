# frozen_string_literal: true

# UI::ScrollAreaCornerBehavior
#
# Shared behavior for ScrollArea corner across ERB, ViewComponent, and Phlex implementations.
# This module provides consistent HTML attribute generation and styling.
module UI::ScrollAreaCornerBehavior
  # Returns HTML attributes for the corner element
  def scroll_area_corner_html_attributes
    attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
    {
      class: scroll_area_corner_classes,
      data: {
        slot: "scroll-area-corner"
      }
    }.merge(attributes_value || {})
  end

  # Returns combined CSS classes
  def scroll_area_corner_classes
    classes_value = respond_to?(:classes, true) ? classes : @classes
    TailwindMerge::Merger.new.merge([
      scroll_area_corner_base_classes,
      classes_value
    ].compact.join(" "))
  end

  private

  # Base classes for corner
  def scroll_area_corner_base_classes
    "absolute right-0 bottom-0"
  end
end
