# frozen_string_literal: true

require "tailwind_merge"

# Shared behavior for Sheet Overlay component
# Handles backdrop/overlay styling and attributes
module UI::SheetOverlayBehavior
  # Base CSS classes for overlay backdrop
  # data-[initial] prevents exit animation on page load
  def sheet_overlay_base_classes
    "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:opacity-0 data-[state=open]:opacity-100 data-[state=open]:pointer-events-auto data-[state=closed]:pointer-events-none data-[initial]:animate-none data-[initial]:opacity-0 fixed inset-0 z-50 bg-black/50"
  end

  # Merge base classes with custom classes using TailwindMerge
  def sheet_overlay_classes
    TailwindMerge::Merger.new.merge([sheet_overlay_base_classes].compact.join(" "))
  end

  # Container wrapper classes
  # Use data-[initial]:invisible to hide on page load without animations
  # After first open, data-initial is removed and animations work normally
  def sheet_overlay_container_base_classes
    "data-[initial]:invisible data-[state=closed]:pointer-events-none data-[state=open]:pointer-events-auto fixed inset-0 z-50"
  end

  # Merge container base classes with custom classes
  def sheet_overlay_container_classes
    TailwindMerge::Merger.new.merge([sheet_overlay_container_base_classes, @classes].compact.join(" "))
  end

  # Data attributes for container
  def sheet_overlay_container_data_attributes
    {
      ui__dialog_target: "container"
    }
  end

  # Data attributes for overlay backdrop
  def sheet_overlay_data_attributes
    {
      ui__dialog_target: "overlay",
      action: "click->ui--dialog#closeOnOverlayClick"
    }
  end

  # Merge user-provided data attributes for container
  def merged_sheet_overlay_container_data_attributes
    user_data = @attributes&.fetch(:data, {}) || {}
    user_data.merge(sheet_overlay_container_data_attributes)
  end

  # Build complete HTML attributes hash for container wrapper
  def sheet_overlay_container_html_attributes
    base_attrs = @attributes&.except(:data) || {}
    attrs = base_attrs.merge(
      class: sheet_overlay_container_classes,
      "data-state": @open ? "open" : "closed",
      data: merged_sheet_overlay_container_data_attributes
    )
    # Add data-initial when closed to prevent exit animations on page load
    attrs["data-initial"] = "" unless @open
    attrs
  end

  # Build complete HTML attributes hash for overlay backdrop
  def sheet_overlay_html_attributes
    attrs = {
      class: sheet_overlay_classes,
      "data-state": @open ? "open" : "closed",
      data: sheet_overlay_data_attributes
    }
    # Add data-initial when closed to prevent exit animations on page load
    attrs["data-initial"] = "" unless @open
    attrs
  end
end
