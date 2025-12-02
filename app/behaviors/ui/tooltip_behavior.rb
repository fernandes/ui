# frozen_string_literal: true

require "tailwind_merge"

# UI::TooltipBehavior
#
# @ui_component Tooltip
# @ui_description Tooltip - Phlex implementation
# @ui_category overlay
#
# @ui_anatomy Tooltip - Root container for tooltip. Manages tooltip state via Stimulus controller. (required)
# @ui_anatomy Content - The popup content that displays tooltip information. (required)
# @ui_anatomy Trigger - The interactive element that shows/hides the tooltip on hover/focus. (required)
#
# @ui_aria_pattern Tooltip
# @ui_aria_reference https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/
#
# @ui_keyboard Escape Closes the component
#
# @ui_related popover
# @ui_related hover_card
#
module UI::TooltipBehavior
  # Returns HTML attributes for the tooltip root element
  # When as_child is true, don't include the "contents" class since
  # the parent element will handle its own styling
  def tooltip_html_attributes
    attrs = {
      data: tooltip_data_attributes
    }

    # Only add "contents" class when not using asChild
    # asChild mode passes data attributes to parent, which handles its own styling
    unless instance_variable_defined?(:@as_child) && @as_child
      attrs[:class] = "contents"
    end

    attrs.compact
  end

  # Returns data attributes for the tooltip controller
  def tooltip_data_attributes
    attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
    base_data = attributes_value&.fetch(:data, {}) || {}

    # Add tooltip controller
    controllers = [base_data[:controller], "ui--tooltip"].compact.join(" ")

    base_data.merge({
      controller: controllers
    }).compact
  end
end
