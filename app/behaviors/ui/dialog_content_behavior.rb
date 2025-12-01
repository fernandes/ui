# frozen_string_literal: true

require "tailwind_merge"

# Shared behavior for Dialog Content component
# Handles content area styling, ARIA attributes, and animations
module UI::DialogContentBehavior
  # Base CSS classes for dialog content
  # Use opacity-0/scale-95 and pointer-events-none when closed for smooth animations
  def dialog_content_base_classes
    "bg-background data-[state=closed]:invisible data-[state=open]:visible data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:opacity-0 data-[state=open]:opacity-100 data-[state=open]:pointer-events-auto data-[state=closed]:pointer-events-none fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg"
  end

  # Merge base classes with custom classes using TailwindMerge
  def dialog_content_classes
    TailwindMerge::Merger.new.merge([dialog_content_base_classes, @classes].compact.join(" "))
  end

  # Data attributes for Stimulus target
  def dialog_content_data_attributes
    {
      ui__dialog_target: "content"
    }
  end

  # Merge user-provided data attributes
  def merged_dialog_content_data_attributes
    user_data = @attributes&.fetch(:data, {}) || {}
    user_data.merge(dialog_content_data_attributes)
  end

  # Build complete HTML attributes hash for dialog content
  def dialog_content_html_attributes
    base_attrs = @attributes&.except(:data) || {}
    attrs = base_attrs.merge(
      class: dialog_content_classes,
      role: "dialog",
      "aria-modal": "true",
      "data-state": @open ? "open" : "closed",
      data: merged_dialog_content_data_attributes
    )
    # Add inert when closed to prevent focus on elements inside
    attrs[:inert] = true unless @open
    attrs
  end
end
