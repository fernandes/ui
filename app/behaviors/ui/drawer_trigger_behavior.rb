# frozen_string_literal: true

# Shared behavior for Drawer Trigger component
# Opens drawer on click, supports asChild pattern. Announces that it opens a
# dialog (aria-haspopup) and whether it is open (aria-expanded, kept in sync
# by the controller, which also wires aria-controls).
module UI::DrawerTriggerBehavior
  # Data attributes for trigger
  def drawer_trigger_data_attributes
    {action: "click->ui--drawer#open", ui__drawer_target: "trigger"}
  end

  # Build complete trigger attributes (for asChild pattern).
  # Caller attributes win (deep merge, so data keys combine).
  def drawer_trigger_html_attributes
    {
      "aria-haspopup": "dialog",
      "aria-expanded": "false",
      data: drawer_trigger_data_attributes
    }.deep_merge(@attributes || {})
  end
end
