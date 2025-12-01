# frozen_string_literal: true

require "tailwind_merge"

# Shared behavior for AlertDialog Content component
# Handles content area styling, ARIA attributes, and animations
module UI::AlertDialogContentBehavior
  # Base CSS classes for alert dialog content
  # Use opacity-0/scale-95 and pointer-events-none when closed for smooth animations
  def alert_dialog_content_base_classes
    "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:opacity-0 data-[state=open]:opacity-100 data-[state=open]:pointer-events-auto data-[state=closed]:pointer-events-none fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg"
  end

  # Merge base classes with custom classes using TailwindMerge
  def alert_dialog_content_classes
    TailwindMerge::Merger.new.merge([alert_dialog_content_base_classes, @classes].compact.join(" "))
  end

  # Data attributes for Stimulus target
  def alert_dialog_content_data_attributes
    {
      ui__alert_dialog_target: "content"
    }
  end

  # Merge user-provided data attributes
  def merged_alert_dialog_content_data_attributes
    user_data = @attributes&.fetch(:data, {}) || {}
    user_data.merge(alert_dialog_content_data_attributes)
  end

  # Build complete HTML attributes hash for alert dialog content
  def alert_dialog_content_html_attributes
    base_attrs = @attributes&.except(:data) || {}
    base_attrs.merge(
      class: alert_dialog_content_classes,
      role: "alertdialog",
      "aria-modal": "true",
      data: merged_alert_dialog_content_data_attributes
    )
  end
end
