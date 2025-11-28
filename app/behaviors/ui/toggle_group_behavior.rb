# frozen_string_literal: true

require "tailwind_merge"

module UI
  # ToggleGroupBehavior
  #
  # Shared behavior for ToggleGroup (Root) component across ERB, ViewComponent, and Phlex implementations.
  # This module provides consistent variant and size styling for the group container.
  module ToggleGroupBehavior
    # Returns HTML attributes for the toggle group container element
    def toggle_group_html_attributes
      attrs = {
        class: toggle_group_classes,
        role: @type == "single" ? "radiogroup" : "group",
        data: {
          controller: "ui--toggle-group",
          "ui--toggle-group-type-value": @type || "single",
          "ui--toggle-group-value-value": @value&.to_json || (@type == "multiple" ? "[]" : "null")
        }
      }

      # Add orientation for accessibility
      attrs[:"data-orientation"] = @orientation if @orientation
      attrs[:"data-spacing"] = @spacing.to_s if @spacing
      attrs[:"data-variant"] = @variant if @variant

      attrs.compact
    end

    # Returns combined CSS classes for the toggle group container
    def toggle_group_classes
      classes_value = respond_to?(:classes, true) ? classes : @classes
      TailwindMerge::Merger.new.merge([
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
end
