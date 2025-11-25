# frozen_string_literal: true

module UI
  module Menubar
    # MenubarBehavior
    #
    # Shared behavior for Menubar component across ERB, ViewComponent, and Phlex implementations.
    # This module provides consistent styling and HTML attribute generation.
    module MenubarBehavior
      # Returns HTML attributes for the menubar container
      def menubar_html_attributes
        attrs = {
          class: menubar_classes,
          data: menubar_data_attributes,
          role: "menubar"
        }

        # Add aria-label if provided
        attrs[:"aria-label"] = @aria_label if defined?(@aria_label) && @aria_label

        attrs
      end

      # Returns combined CSS classes for the menubar
      def menubar_classes
        classes_value = respond_to?(:classes, true) ? classes : @classes
        TailwindMerge::Merger.new.merge([
          "bg-background flex h-9 items-center gap-1 rounded-md border p-1 shadow-xs",
          classes_value
        ].compact.join(" "))
      end

      # Returns data attributes for Stimulus controller
      def menubar_data_attributes
        attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
        base_data = {
          controller: "ui--menubar"
        }

        # Add loop value if specified
        base_data[:"ui--menubar-loop-value"] = @loop if defined?(@loop) && @loop

        (attributes_value&.fetch(:data, {}) || {}).merge(base_data)
      end
    end
  end
end
