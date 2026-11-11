# frozen_string_literal: true

require "tailwind_merge"

# Shared behavior for AlertDialog Description component
# Handles description text styling
module UI::AlertDialogDescriptionBehavior
  # Base CSS classes for alert dialog description
  def alert_dialog_description_base_classes
    "text-muted-foreground text-sm"
  end

  # Merge base classes with custom classes using TailwindMerge
  def alert_dialog_description_classes
    UI::ClassMerger.merge([alert_dialog_description_base_classes, @classes].compact.join(" "))
  end

  # Build complete HTML attributes hash for alert dialog description
  # The `description` target lets the controller give it an id and point the
  # content's aria-describedby at it. An `id` passed by the caller is kept.
  def alert_dialog_description_html_attributes
    base_attrs = (@attributes || {}).except(:class, :data)
    user_data = @attributes&.fetch(:data, {}) || {}
    base_attrs.merge(
      class: alert_dialog_description_classes,
      data: user_data.merge(ui__alert_dialog_target: "description")
    )
  end
end
