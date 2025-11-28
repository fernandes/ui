# frozen_string_literal: true

    # ContextMenuBehavior
    #
    # Shared behavior for ContextMenu component across ERB, ViewComponent, and Phlex implementations.
    # This module provides consistent styling and HTML attribute generation.
    module UI::ContextMenuBehavior
      # Returns HTML attributes for the context menu container
      def context_menu_html_attributes
        {
          class: context_menu_classes,
          data: context_menu_data_attributes
        }
      end

      # Returns combined CSS classes for the context menu
      def context_menu_classes
        classes_value = respond_to?(:classes, true) ? classes : @classes
        TailwindMerge::Merger.new.merge([
          "relative inline-block",
          classes_value
        ].compact.join(" "))
      end

      # Returns data attributes for Stimulus controller
      def context_menu_data_attributes
        attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
        (attributes_value&.fetch(:data, {}) || {}).merge({
          controller: "ui--context-menu"
        })
      end
    end
