# frozen_string_literal: true

# UI::PopoverBehavior
#
# @ui_component Popover
# @ui_description Popover - Phlex implementation
# @ui_category overlay
#
# @ui_anatomy Popover - Container for popover trigger and content. (required)
# @ui_anatomy Content - The floating content panel. (required)
# @ui_anatomy Trigger - Button or element that triggers the popover. (required)
#
# @ui_feature Custom styling with Tailwind classes
# @ui_feature Click outside to close
#
# @ui_aria_pattern Dialog (Non-modal)
# @ui_aria_reference https://www.w3.org/WAI/ARIA/apg/patterns/dialog-non-modal/
#
# @ui_keyboard Enter Activates the focused element
# @ui_keyboard Escape Closes the component
#
# @ui_related tooltip
# @ui_related hover_card
# @ui_related dropdown_menu
#
module UI::PopoverBehavior
  # Returns HTML attributes for the popover container element
  def popover_html_attributes
    attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
    {
      class: popover_classes,
      data: popover_data_attributes
    }.merge(attributes_value)
  end

  # Returns combined CSS classes for the popover
  def popover_classes
    classes_value = respond_to?(:classes, true) ? classes : @classes
    TailwindMerge::Merger.new.merge([
      popover_base_classes,
      classes_value

    ].compact.join(" "))
  end

  # Returns data attributes for the popover controller
  def popover_data_attributes
    {
      controller: "ui--popover",
      ui__popover_placement_value: normalized_placement,
      ui__popover_offset_value: @offset,
      ui__popover_trigger_value: @trigger,
      ui__popover_hover_delay_value: @hover_delay
    }
  end

  private

  # Base classes applied to all popovers - relative positioning for absolute content
  def popover_base_classes
    "relative inline-block"
  end

  # Normalize placement from legacy align parameter
  def normalized_placement
    # If we have a legacy align parameter, convert it to placement
    if @align && @align != "center"
      "bottom-#{@align}"
    else
      @placement
    end
  end
end
