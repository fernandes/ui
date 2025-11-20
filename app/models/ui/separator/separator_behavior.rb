# frozen_string_literal: true

module UI
  module Separator
    # SeparatorBehavior
    #
    # Shared behavior for Separator component across ERB, ViewComponent, and Phlex implementations.
    # This module provides consistent styling and HTML attribute generation.
    #
    # Based on shadcn/ui Separator: https://ui.shadcn.com/docs/components/separator
    # Based on Radix UI Separator: https://www.radix-ui.com/primitives/docs/components/separator
    module SeparatorBehavior
      # Returns HTML attributes for the separator element
      def separator_html_attributes
        attrs = {
          class: separator_classes,
          data: {
            slot: "separator",
            orientation: @orientation
          }
        }

        # Only add ARIA attributes when separator is not decorative
        unless @decorative
          attrs[:role] = "separator"
          attrs[:"aria-orientation"] = @orientation.to_s
        end

        attrs
      end

      # Returns combined CSS classes for the separator
      def separator_classes
        classes_value = respond_to?(:classes, true) ? classes : @classes
        TailwindMerge::Merger.new.merge([
          separator_base_classes,
          separator_orientation_classes,
          classes_value
        ].compact.join(" "))
      end

      private

      # Base classes applied to all separators
      # Matches shadcn/ui v4 exactly
      def separator_base_classes
        "shrink-0 bg-border"
      end

      # Orientation-specific classes based on @orientation
      # Matches shadcn/ui v4 exactly
      def separator_orientation_classes
        case @orientation.to_s
        when "vertical"
          "h-full w-px"
        else # horizontal (default)
          "h-px w-full"
        end
      end
    end
  end
end
