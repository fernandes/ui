# frozen_string_literal: true

# UI::ScrollAreaViewportBehavior
#
# Shared behavior for ScrollArea viewport across ERB, ViewComponent, and Phlex implementations.
# This module provides consistent HTML attribute generation and styling.
module UI::ScrollAreaViewportBehavior
  # Returns HTML attributes for the viewport element
  def scroll_area_viewport_html_attributes
    attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
    {
      class: scroll_area_viewport_classes,
      data: {
        slot: "scroll-area-viewport",
        ui_scroll_area_viewport: true
      }
    }.merge(attributes_value || {})
  end

  # Returns combined CSS classes
  def scroll_area_viewport_classes
    classes_value = respond_to?(:classes, true) ? classes : @classes
    TailwindMerge::Merger.new.merge([
      scroll_area_viewport_base_classes,
      classes_value
    ].compact.join(" "))
  end

  private

  # Base classes for viewport
  def scroll_area_viewport_base_classes
    "size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1 focus-visible:ring-ring/50"
  end
end
