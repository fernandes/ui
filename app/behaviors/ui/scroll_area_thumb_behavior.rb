# frozen_string_literal: true

# UI::ScrollAreaThumbBehavior
#
# Shared behavior for ScrollArea thumb across ERB, ViewComponent, and Phlex implementations.
# This module provides consistent HTML attribute generation and styling.
module UI::ScrollAreaThumbBehavior
  # Returns HTML attributes for the thumb element
  def scroll_area_thumb_html_attributes
    attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
    {
      class: scroll_area_thumb_classes,
      data: {
        slot: "scroll-area-thumb"
      }
    }.merge(attributes_value || {})
  end

  # Returns combined CSS classes
  def scroll_area_thumb_classes
    classes_value = respond_to?(:classes, true) ? classes : @classes
    TailwindMerge::Merger.new.merge([
      scroll_area_thumb_base_classes,
      classes_value
    ].compact.join(" "))
  end

  private

  # Base classes for thumb
  def scroll_area_thumb_base_classes
    "bg-border relative flex-1 rounded-full"
  end
end
