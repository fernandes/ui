# frozen_string_literal: true

module UI
  module DropdownMenu
    # DropdownMenuCheckboxItemBehavior
    #
    # Shared behavior for DropdownMenuCheckboxItem component across ERB, ViewComponent, and Phlex implementations.
    module DropdownMenuCheckboxItemBehavior
      # Returns HTML attributes for the checkbox item
      def dropdown_menu_checkbox_item_html_attributes
        attrs = {
          class: dropdown_menu_checkbox_item_classes,
          data: dropdown_menu_checkbox_item_data_attributes,
          role: "menuitemcheckbox",
          "aria-checked": @checked,
          tabindex: "-1"
        }

        attrs
      end

      # Returns combined CSS classes for the checkbox item
      def dropdown_menu_checkbox_item_classes
        classes_value = respond_to?(:classes, true) ? classes : @classes
        base_classes = "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"

        TailwindMerge::Merger.new.merge([base_classes, classes_value].compact.join(" "))
      end

      # Returns data attributes for Stimulus
      def dropdown_menu_checkbox_item_data_attributes
        attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
        data_attrs = (attributes_value&.fetch(:data, {}) || {}).merge({
          "ui--dropdown-target": "item",
          action: "mouseenter->ui--dropdown#trackHoveredItem click->ui--dropdown#toggleCheckbox",
          state: @checked ? "checked" : "unchecked"
        })

        data_attrs[:disabled] = true if @disabled
        data_attrs
      end

      # Renders the checkbox indicator
      def checkbox_indicator
        # This will be implemented in the actual components
        @checked
      end
    end
  end
end
