# frozen_string_literal: true

require "tailwind_merge"

# Shared behavior for AlertDialog Action component
# This wraps the Button component with alert dialog close action
module UI::AlertDialogActionBehavior
  # Data attributes for Stimulus action
  def alert_dialog_action_data_attributes
    {
      action: "click->ui--alert-dialog#close"
    }
  end

  # Merge user-provided data attributes
  def merged_alert_dialog_action_data_attributes
    user_data = @attributes&.fetch(:data, {}) || {}
    user_data.merge(alert_dialog_action_data_attributes)
  end

  # Build data attributes hash to pass to Button component
  def alert_dialog_action_button_data_attributes
    {
      data: merged_alert_dialog_action_data_attributes
    }
  end
end
