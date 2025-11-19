# frozen_string_literal: true

module UI
  module DropdownMenu
    # DropdownMenuBehavior
    #
    # Shared behavior for DropdownMenu component across ERB, ViewComponent, and Phlex implementations.
    # This module provides consistent styling and HTML attribute generation.
    module DropdownMenuBehavior
      # Returns HTML attributes for the dropdown menu container
      def dropdown_menu_html_attributes
        {
          class: dropdown_menu_classes,
          data: dropdown_menu_data_attributes
        }
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
  end
end
