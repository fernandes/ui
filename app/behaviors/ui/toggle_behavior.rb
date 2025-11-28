# frozen_string_literal: true

require "tailwind_merge"

module UI
  # ToggleBehavior
  #
  # Shared behavior for Toggle component across ERB, ViewComponent, and Phlex implementations.
  # This module provides consistent variant and size styling, along with HTML attribute generation.
  module ToggleBehavior
    # Renders the toggle HTML
    # This method can be used by both ERB partials and ViewComponents
    # @param content_block [Proc] Block that returns the toggle content
    # @return [String] HTML string for the toggle
    def render_toggle(&content_block)
      all_attributes = toggle_html_attributes.deep_merge(@attributes)
      content_tag(:button, **all_attributes, &content_block)
    end

    # Returns HTML attributes for the toggle element
    def toggle_html_attributes
      attrs = {
        class: toggle_classes,
        type: @type || "button",
        disabled: @disabled ? true : nil,
        "aria-pressed": @pressed ? "true" : "false",
        data: {
          controller: "ui--toggle",
          action: "click->ui--toggle#toggle",
          "ui--toggle-pressed-value": @pressed ? "true" : "false"
        }
      }

      # Add state attribute for CSS targeting
      attrs[:"data-state"] = @pressed ? "on" : "off"
      attrs[:"data-disabled"] = "" if @disabled

      attrs.compact
    end

    # Returns combined CSS classes for the toggle
    def toggle_classes
      classes_value = respond_to?(:classes, true) ? classes : @classes
      TailwindMerge::Merger.new.merge([
        toggle_base_classes,
        toggle_variant_classes,
        toggle_size_classes,
        classes_value
      ].compact.join(" "))
    end

    private

    # Base classes applied to all toggles
    def toggle_base_classes
      "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium hover:bg-muted hover:text-muted-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none transition-[color,box-shadow] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive whitespace-nowrap"
    end

    # Variant-specific classes based on @variant
    def toggle_variant_classes
      case @variant.to_s
      when "default"
        "bg-transparent"
      when "outline"
        "border border-input bg-transparent shadow-xs hover:bg-accent hover:text-accent-foreground"
      else
        "bg-transparent"
      end
    end

    # Size-specific classes based on @size
    def toggle_size_classes
      case @size.to_s
      when "default"
        "h-9 px-2 min-w-9"
      when "sm"
        "h-8 px-1.5 min-w-8"
      when "lg"
        "h-10 px-2.5 min-w-10"
      else
        "h-9 px-2 min-w-9"
      end
    end
  end
end
