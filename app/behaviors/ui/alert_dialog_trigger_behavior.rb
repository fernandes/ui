# frozen_string_literal: true

require "tailwind_merge"

# Shared behavior for AlertDialog Trigger component
# Handles classes and Stimulus actions
module UI::AlertDialogTriggerBehavior
  # Base CSS classes for alert dialog trigger wrapper
  def alert_dialog_trigger_base_classes
    "inline-flex"
  end

  # Merge base classes with custom classes using TailwindMerge
  def alert_dialog_trigger_classes
    UI::ClassMerger.merge([alert_dialog_trigger_base_classes, @classes].compact.join(" "))
  end

  # Data attributes for Stimulus action. The wrapper is the `trigger` target;
  # the controller puts aria-haspopup/aria-controls/aria-expanded on the
  # button inside it.
  def alert_dialog_trigger_data_attributes
    {
      action: "click->ui--alert-dialog#open",
      ui__alert_dialog_target: "trigger"
    }
  end

  # as_child: attributes yielded to the caller's own button/link, which then
  # is the trigger (no wrapper). aria-controls is wired by the controller.
  # Caller attributes win (deep merge, so data keys combine).
  def alert_dialog_trigger_as_child_attributes
    {
      "aria-haspopup": "dialog",
      "aria-expanded": "false",
      data: alert_dialog_trigger_data_attributes
    }.deep_merge(@attributes || {})
  end

  # Merge user-provided data attributes
  def merged_alert_dialog_trigger_data_attributes
    user_data = @attributes&.fetch(:data, {}) || {}
    user_data.merge(alert_dialog_trigger_data_attributes)
  end

  # Build complete HTML attributes hash for alert dialog trigger
  def alert_dialog_trigger_html_attributes
    base_attrs = @attributes&.except(:data) || {}
    base_attrs.merge(
      class: alert_dialog_trigger_classes,
      data: merged_alert_dialog_trigger_data_attributes
    )
  end
end
