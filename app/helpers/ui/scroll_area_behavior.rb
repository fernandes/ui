# frozen_string_literal: true

# UI::ScrollAreaBehavior
#
# Shared behavior for ScrollArea root across ERB, ViewComponent, and Phlex implementations.
# This module provides consistent HTML attribute generation and styling.
module UI::ScrollAreaBehavior
  # Returns HTML attributes for the scroll area root element
  def scroll_area_html_attributes
    attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
    {
      class: scroll_area_classes,
      dir: "ltr",
      style: "position: relative; --ui-scroll-area-corner-width: 0px; --ui-scroll-area-corner-height: 0px;",
      data: {
        slot: "scroll-area"
      }
    }.merge(attributes_value || {})
  end

  # Returns combined CSS classes
  def scroll_area_classes
    classes_value = respond_to?(:classes, true) ? classes : @classes
    TailwindMerge::Merger.new.merge([
      scroll_area_base_classes,
      classes_value
    ].compact.join(" "))
  end

  private

  # Base classes for scroll area root
  def scroll_area_base_classes
    "relative"
  end
end
