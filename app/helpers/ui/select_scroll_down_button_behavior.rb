# frozen_string_literal: true

# UI::SelectScrollDownButtonBehavior
#
# Shared behavior for Select scroll down button across ERB, ViewComponent, and Phlex implementations.
# This module provides consistent HTML attribute generation and styling.
module UI::SelectScrollDownButtonBehavior
  # Returns HTML attributes for the select scroll down button element
  def select_scroll_down_button_html_attributes
    attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
    {
      class: select_scroll_down_button_classes,
      "aria-hidden": "true",
      # FIXED: Removed display: flex - visibility controlled by JavaScript/aria-hidden
      # ADDED: flex-shrink: 0 as per shadcn implementation
      style: "flex-shrink: 0;",
      data: select_scroll_down_button_data_attributes
    }.merge(attributes_value || {})
  end

  # Returns data attributes for Stimulus
  def select_scroll_down_button_data_attributes
    attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
    base_data = {
      ui__select_target: "scrollDownButton",
      action: "mouseenter->ui--select#scrollDown mouseleave->ui--select#stopScroll",
      slot: "select-scroll-down-button" # ADDED: data-slot attribute
    }

    (attributes_value&.fetch(:data, {}) || {}).merge(base_data)
  end

  # Returns combined CSS classes
  def select_scroll_down_button_classes
    classes_value = respond_to?(:classes, true) ? classes : @classes
    TailwindMerge::Merger.new.merge([
      select_scroll_down_button_base_classes,
      classes_value
    ].compact.join(" "))
  end

  private

  # Base classes for select scroll down button
  # FIXED: Removed absolute positioning (absolute bottom-0 left-0 right-0 z-10)
  # FIXED: Removed hover:bg-accent bg-popover (not in shadcn)
  # Now matches shadcn structure: simple flex layout
  def select_scroll_down_button_base_classes
    "flex cursor-default items-center justify-center py-1"
  end
end
