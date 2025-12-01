# frozen_string_literal: true

# UI::TabsBehavior
#
# @ui_component Tabs
# @ui_description Tabs container component (Phlex) Root component for tabbed interface with keyboard navigation
# @ui_category navigation
#
# @ui_anatomy Tabs - Root container with state management (required)
# @ui_anatomy Content - Main content container (required)
# @ui_anatomy List - Container for list items
# @ui_anatomy Trigger - Button or element that activates the component (required)
#
# @ui_feature Keyboard navigation with arrow keys
#
# @ui_aria_pattern Tabs
# @ui_aria_reference https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
#
# @ui_keyboard ArrowDown Moves focus to next item
# @ui_keyboard ArrowUp Moves focus to previous item
# @ui_keyboard ArrowLeft Moves focus left or decreases value
# @ui_keyboard ArrowRight Moves focus right or increases value
# @ui_keyboard Home Moves focus to first item
# @ui_keyboard End Moves focus to last item
# @ui_keyboard Tab Moves focus to next focusable element
#
# @ui_related navigation_menu
# @ui_related accordion
#
module UI::TabsBehavior
  # Generate Stimulus controller data attributes
  def tabs_data_attributes
    {
      controller: "ui--tabs",
      ui__tabs_default_value_value: @default_value || "",
      ui__tabs_orientation_value: @orientation || "horizontal",
      ui__tabs_activation_mode_value: @activation_mode || "automatic"
    }
  end

  # Merge user-provided data attributes with tabs controller data
  def merged_data_attributes
    user_data = @attributes&.fetch(:data, {}) || {}
    user_data.merge(tabs_data_attributes)
  end

  # Build complete HTML attributes hash for tabs container
  def tabs_html_attributes
    base_attrs = @attributes&.except(:data) || {}
    base_attrs.merge(
      class: "flex flex-col gap-2 #{@classes}".strip,
      "data-orientation": @orientation || "horizontal",
      "data-slot": "tabs",
      data: merged_data_attributes
    )
  end
end
