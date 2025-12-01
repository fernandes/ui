# frozen_string_literal: true

# UI::AccordionBehavior
#
# @ui_component Accordion
# @ui_description Accordion container component (Phlex) Wraps collapsible accordion items with Stimulus controller
# @ui_category data-display
#
# @ui_anatomy Accordion - Root container with state management (required)
# @ui_anatomy Content - Main content container (required)
# @ui_anatomy Item - Individual item element
# @ui_anatomy Trigger - Button or element that activates the component (required)
#
# @ui_feature Keyboard navigation with arrow keys
# @ui_feature Animation support
#
# @ui_aria_pattern Accordion
# @ui_aria_reference https://www.w3.org/WAI/ARIA/apg/patterns/accordion/
#
# @ui_keyboard Enter Activates the focused element
# @ui_keyboard ArrowDown Moves focus to next item
# @ui_keyboard ArrowUp Moves focus to previous item
# @ui_keyboard Home Moves focus to first item
# @ui_keyboard End Moves focus to last item
#
# @ui_related collapsible
# @ui_related tabs
#
module UI::AccordionBehavior
  # Generate Stimulus controller data attributes
  def accordion_data_attributes
    {
      controller: "ui--accordion",
      ui__accordion_type_value: @type || "single",
      ui__accordion_collapsible_value: @collapsible || false
    }
  end

  # Merge user-provided data attributes with accordion controller data
  def merged_data_attributes
    user_data = @attributes&.fetch(:data, {}) || {}
    user_data.merge(accordion_data_attributes)
  end

  # Build complete HTML attributes hash for accordion container
  def accordion_html_attributes
    base_attrs = @attributes&.except(:data) || {}
    base_attrs.merge(
      class: @classes || "",
      "data-orientation": @orientation || "vertical",
      data: merged_data_attributes
    )
  end
end
