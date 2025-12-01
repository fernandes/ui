# frozen_string_literal: true

# Shared behavior for Drawer Trigger component
# Opens drawer on click, supports asChild pattern
module UI::DrawerTriggerBehavior
  # Data attributes for trigger
  def drawer_trigger_data_attributes
    {action: "click->ui--drawer#open"}
  end

  # Build complete trigger attributes (for asChild pattern)
  def drawer_trigger_html_attributes
    {
      data: drawer_trigger_data_attributes,
      **@attributes
    }
  end
end
