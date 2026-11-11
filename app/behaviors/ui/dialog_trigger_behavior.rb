# frozen_string_literal: true

# Shared behavior for Dialog Trigger (and Sheet Trigger)
#
# The trigger announces that it opens a dialog (aria-haspopup) and whether it
# is open (aria-expanded, kept in sync by the controller). aria-controls is
# wired by the controller on connect, pointing at the content's id.
module UI::DialogTriggerBehavior
  def dialog_trigger_base_attributes
    {
      "aria-haspopup": "dialog",
      "aria-expanded": "false",
      data: {
        action: "click->ui--dialog#open",
        ui__dialog_target: "trigger"
      }
    }
  end

  # Caller attributes win over the defaults (deep merge, so data keys combine).
  def dialog_trigger_attributes
    dialog_trigger_base_attributes.deep_merge(@attributes || {})
  end
end
