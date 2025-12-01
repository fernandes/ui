# frozen_string_literal: true

require "tailwind_merge"

# Shared behavior for AlertDialog Title component
# Handles title styling
module UI::AlertDialogTitleBehavior
  # Base CSS classes for alert dialog title
  def alert_dialog_title_base_classes
    "text-lg font-semibold"
  end

  # Merge base classes with custom classes using TailwindMerge
  def alert_dialog_title_classes
    TailwindMerge::Merger.new.merge([alert_dialog_title_base_classes, @classes].compact.join(" "))
  end

  # Build complete HTML attributes hash for alert dialog title
  def alert_dialog_title_html_attributes
    base_attrs = @attributes || {}
    base_attrs.merge(
      class: alert_dialog_title_classes
    )
  end
end
