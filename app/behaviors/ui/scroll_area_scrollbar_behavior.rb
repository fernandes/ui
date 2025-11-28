# frozen_string_literal: true

# UI::ScrollAreaScrollbarBehavior
#
# Shared behavior for ScrollArea scrollbar across ERB, ViewComponent, and Phlex implementations.
# This module provides consistent HTML attribute generation and styling.
module UI::ScrollAreaScrollbarBehavior
  # Returns HTML attributes for the scrollbar element
  def scroll_area_scrollbar_html_attributes
    attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
    orientation_value = respond_to?(:orientation, true) ? orientation : @orientation

    {
      class: scroll_area_scrollbar_classes,
      data: {
        slot: "scroll-area-scrollbar",
        orientation: orientation_value
      }
    }.merge(attributes_value || {})
  end

  # Returns combined CSS classes
  def scroll_area_scrollbar_classes
    classes_value = respond_to?(:classes, true) ? classes : @classes
    orientation_value = respond_to?(:orientation, true) ? orientation : @orientation

    TailwindMerge::Merger.new.merge([
      scroll_area_scrollbar_base_classes,
      scroll_area_scrollbar_orientation_classes(orientation_value),
      classes_value
    ].compact.join(" "))
  end

  private

  # Base classes for scrollbar
  def scroll_area_scrollbar_base_classes
    "absolute flex touch-none p-px transition-colors select-none overflow-hidden rounded-sm"
  end

  # Orientation-specific classes
  def scroll_area_scrollbar_orientation_classes(orientation)
    case orientation
    when "horizontal"
      "bottom-0 left-0 right-0 h-2.5 flex-col border-t border-t-transparent"
    else # vertical (default)
      "right-0.5 top-0.5 bottom-0.5 w-2.5 border-l border-l-transparent"
    end
  end
end
