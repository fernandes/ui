# frozen_string_literal: true

require "tailwind_merge"

# ToggleGroupBehavior
#
# Shared behavior for ToggleGroup (Root) component across ERB, ViewComponent, and Phlex implementations.
# This module provides consistent variant and size styling for the group container.
#
# Keyboard: roving tabindex (one tab stop), arrow keys move focus (by
# orientation), Home/End, disabled items skipped, loop by default.
module UI::ToggleGroupBehavior
  # Context handed to the items (variant, size, selection, disabled).
  def toggle_group_context
    {
      variant: @variant,
      size: @size,
      type: @type,
      spacing: @spacing,
      value: @value,
      disabled: @disabled
    }
  end

  # Returns HTML attributes for the toggle group container element
  def toggle_group_html_attributes
    attrs = {
      class: toggle_group_classes,
      role: (@type == "single") ? "radiogroup" : "group",
      data: {
        controller: "ui--toggle-group",
        "ui--toggle-group-type-value": @type || "single",
        "ui--toggle-group-value-value": @value&.to_json || ((@type == "multiple") ? "[]" : "null"),
        "ui--toggle-group-loop-value": ((@loop == false) ? "false" : nil)
      }.compact
    }

    # Orientation drives which arrow keys move focus. aria-orientation is only
    # valid on the radiogroup role; a plain group exposes it as data only.
    if @orientation
      attrs[:"data-orientation"] = @orientation
      attrs[:"aria-orientation"] = @orientation if @type != "multiple"
    end
    attrs[:"data-disabled"] = "" if @disabled
    attrs[:"data-spacing"] = @spacing.to_s if @spacing
    attrs[:"data-variant"] = @variant if @variant

    attrs.compact
  end

  # Returns combined CSS classes for the toggle group container
  def toggle_group_classes
    classes_value = respond_to?(:classes, true) ? classes : @classes
    UI::ClassMerger.merge([
      toggle_group_base_classes,
      toggle_group_spacing_classes,
      toggle_group_variant_classes,
      classes_value
    ].compact.join(" "))
  end

  private

  # Base classes applied to all toggle groups
  def toggle_group_base_classes
    "group/toggle-group flex w-fit items-center rounded-md"
  end

  # Spacing classes based on @spacing
  def toggle_group_spacing_classes
    spacing = @spacing || 0
    if spacing == 0
      ""
    else
      "gap-#{spacing}"
    end
  end

  # Variant-specific classes (for outline with spacing=0, adds shadow)
  def toggle_group_variant_classes
    if @variant == "outline" && (@spacing.nil? || @spacing == 0)
      "shadow-xs"
    else
      ""
    end
  end
end
