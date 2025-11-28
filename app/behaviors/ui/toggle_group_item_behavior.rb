# frozen_string_literal: true

require "tailwind_merge"

module UI
  # ToggleGroupItemBehavior
  #
  # Shared behavior for ToggleGroupItem component across ERB, ViewComponent, and Phlex implementations.
  # This module provides consistent styling for items within a toggle group, inheriting variant/size from parent.
  module ToggleGroupItemBehavior
    # Returns HTML attributes for the toggle group item element
    def toggle_group_item_html_attributes
      attrs = {
        class: toggle_group_item_classes,
        type: "button",
        role: @group_type == "single" ? "radio" : "button",
        disabled: @disabled ? true : nil,
        "aria-pressed": @group_type == "multiple" ? (@pressed ? "true" : "false") : nil,
        "aria-checked": @group_type == "single" ? (@pressed ? "true" : "false") : nil,
        data: {
          "ui--toggle-group-target": "item",
          action: "click->ui--toggle-group#toggle",
          value: @value,
          state: @pressed ? "on" : "off"
        }
      }

      # Add state attribute for CSS targeting
      attrs[:"data-state"] = @pressed ? "on" : "off"
      attrs[:"data-disabled"] = "" if @disabled
      attrs[:"data-spacing"] = @spacing.to_s if @spacing

      attrs.compact
    end

    # Returns combined CSS classes for the toggle group item
    def toggle_group_item_classes
      classes_value = respond_to?(:classes, true) ? classes : @classes
      TailwindMerge::Merger.new.merge([
        toggle_group_item_base_classes,
        toggle_group_item_variant_classes,
        toggle_group_item_size_classes,
        toggle_group_item_spacing_classes,
        classes_value
      ].compact.join(" "))
    end

    private

    # Base classes applied to all toggle group items
    def toggle_group_item_base_classes
      "inline-flex items-center justify-center gap-2 text-sm font-medium hover:bg-muted hover:text-muted-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus:z-10 focus-visible:z-10 outline-none transition-[color,box-shadow] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive whitespace-nowrap w-auto min-w-0 shrink-0"
    end

    # Variant-specific classes based on @variant
    def toggle_group_item_variant_classes
      case @variant.to_s
      when "default"
        "bg-transparent"
      when "outline"
        "border border-input bg-transparent"
      else
        "bg-transparent"
      end
    end

    # Size-specific classes based on @size
    def toggle_group_item_size_classes
      case @size.to_s
      when "default"
        "h-9 px-3"
      when "sm"
        "h-8 px-2.5 text-xs"
      when "lg"
        "h-10 px-3.5"
      else
        "h-9 px-3"
      end
    end

    # Spacing-specific classes for rounded corners and borders
    def toggle_group_item_spacing_classes
      # Use data-[spacing=0] prefix to avoid issues with :first/:last pseudo-classes
      # being affected by ERB comments in the DOM
      "rounded-md data-[spacing=0]:rounded-none data-[spacing=0]:shadow-none data-[spacing=0]:first:rounded-l-md data-[spacing=0]:last:rounded-r-md"
    end
  end
end
