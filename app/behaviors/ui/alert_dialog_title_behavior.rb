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
    UI::ClassMerger.merge([alert_dialog_title_base_classes, @classes].compact.join(" "))
  end

  # Build complete HTML attributes hash for alert dialog title
  # The `title` target lets the controller give it an id and point the
  # content's aria-labelledby at it. An `id` passed by the caller is kept.
  def alert_dialog_title_html_attributes
    base_attrs = (@attributes || {}).except(:class, :data)
    user_data = @attributes&.fetch(:data, {}) || {}
    base_attrs.merge(
      class: alert_dialog_title_classes,
      data: user_data.merge(ui__alert_dialog_target: "title")
    )
  end
end
