# frozen_string_literal: true

require "tailwind_merge"

# UI::AlertDialogBehavior
#
# @ui_component Alert Dialog
# @ui_description AlertDialog - Phlex implementation
# @ui_category feedback
#
# @ui_anatomy Alert Dialog - A modal alert dialog component for important confirmations and alerts. (required)
# @ui_anatomy Action - Primary action button for the alert dialog.
# @ui_anatomy Cancel - Cancel button for the alert dialog.
# @ui_anatomy Content - Main alert dialog content area with proper ARIA attributes. (required)
# @ui_anatomy Description - Description text for the alert dialog.
# @ui_anatomy Footer - Footer section with action buttons for the alert dialog.
# @ui_anatomy Header - Header section of the alert dialog.
# @ui_anatomy Overlay - Container wrapper with backdrop and content for the alert dialog overlay.
# @ui_anatomy Title - Title text for the alert dialog.
# @ui_anatomy Trigger - A wrapper that adds the alert dialog open action to its child element. (required)
#
# @ui_feature Custom styling with Tailwind classes
# @ui_feature Focus management
#
# @ui_aria_pattern Alert Dialog
# @ui_aria_reference https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/
#
# @ui_keyboard Escape Closes the component
#
# @ui_related dialog
#
module UI::AlertDialogBehavior
  # Base CSS classes for alert dialog container
  def alert_dialog_base_classes
    ""
  end

  # Merge base classes with custom classes using TailwindMerge
  def alert_dialog_classes
    TailwindMerge::Merger.new.merge([alert_dialog_base_classes, @classes].compact.join(" "))
  end

  # Data attributes for Stimulus controller
  def alert_dialog_data_attributes
    {
      controller: "ui--alert-dialog",
      ui__alert_dialog_open_value: @open,
      ui__alert_dialog_close_on_escape_value: @close_on_escape
    }
  end

  # Merge user-provided data attributes
  def merged_alert_dialog_data_attributes
    user_data = @attributes&.fetch(:data, {}) || {}
    user_data.merge(alert_dialog_data_attributes)
  end

  # Build complete HTML attributes hash for alert dialog container
  def alert_dialog_html_attributes
    base_attrs = @attributes&.except(:data) || {}
    base_attrs.merge(
      class: alert_dialog_classes,
      data: merged_alert_dialog_data_attributes
    )
  end
end
