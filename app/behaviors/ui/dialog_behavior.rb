# frozen_string_literal: true

require "tailwind_merge"

# UI::DialogBehavior
#
# @ui_component Dialog
# @ui_category overlay
#
# @ui_anatomy Dialog - Root container with state management (required)
# @ui_anatomy Close - Button to close/dismiss the component
# @ui_anatomy Content - Main content container (required)
# @ui_anatomy Description - Descriptive text element
# @ui_anatomy Footer - Footer section with actions
# @ui_anatomy Header - Header section with title and controls
# @ui_anatomy Overlay - Background overlay that dims the page
# @ui_anatomy Title - Title text element
# @ui_anatomy Trigger - Button or element that activates the component (required)
#
# @ui_feature Custom styling with Tailwind classes
# @ui_feature Focus management
#
# @ui_aria_pattern Dialog (Modal)
# @ui_aria_reference https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
#
# @ui_keyboard Escape Closes the component
#
# @ui_related alert_dialog
# @ui_related drawer
# @ui_related sheet
#
module UI::DialogBehavior
  # Generate data attributes for Stimulus controller
  def dialog_data_attributes
    attrs = {
      controller: "ui--dialog",
      ui__dialog_open_value: @open.to_s
    }

    # Only add optional values if they are explicitly set (not nil)
    attrs[:ui__dialog_close_on_escape_value] = @close_on_escape.to_s unless @close_on_escape.nil?
    attrs[:ui__dialog_close_on_overlay_click_value] = @close_on_overlay_click.to_s unless @close_on_overlay_click.nil?

    attrs
  end

  # Merge user-provided data attributes
  def merged_dialog_data_attributes
    user_data = @attributes&.fetch(:data, {}) || {}
    user_data.merge(dialog_data_attributes)
  end

  # Build complete HTML attributes hash
  def dialog_html_attributes
    base_attrs = @attributes&.except(:data) || {}
    base_attrs.merge(
      class: dialog_classes,
      data: merged_dialog_data_attributes
    )
  end

  # Base CSS classes
  def dialog_base_classes
    ""
  end

  # Generate final classes using TailwindMerge
  def dialog_classes
    TailwindMerge::Merger.new.merge([dialog_base_classes, @classes].compact.join(" "))
  end
end
