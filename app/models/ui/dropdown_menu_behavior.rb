# frozen_string_literal: true

    # DropdownMenuBehavior
    #
    # Shared behavior for DropdownMenu component across ERB, ViewComponent, and Phlex implementations.
    # This module provides consistent styling and HTML attribute generation.
    module UI::DropdownMenuBehavior
      # Returns HTML attributes for the dropdown menu container
      # When used with asChild, these attributes will be yielded to the child
      def dropdown_menu_html_attributes
        attrs = {
          data: dropdown_menu_data_attributes
        }

        # Only add container classes if not using asChild
        # When asChild is true, we don't render a wrapper
        unless @as_child
          attrs[:class] = dropdown_menu_classes
        end

        attrs
      end

      # Returns combined CSS classes for the dropdown menu
      def dropdown_menu_classes
        classes_value = respond_to?(:classes, true) ? classes : @classes
        TailwindMerge::Merger.new.merge([
          "relative inline-block text-left",
          classes_value
        ].compact.join(" "))
      end

      # Returns data attributes for Stimulus controller
      def dropdown_menu_data_attributes
        attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
        (attributes_value&.fetch(:data, {}) || {}).merge({
          controller: "ui--dropdown",
          "ui--dropdown-placement-value": @placement,
          "ui--dropdown-offset-value": @offset,
          "ui--dropdown-flip-value": @flip
        })
      end
    end
