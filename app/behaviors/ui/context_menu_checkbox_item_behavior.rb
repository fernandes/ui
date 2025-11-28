# frozen_string_literal: true

    # ContextMenuCheckboxItemBehavior
    #
    # Shared behavior for ContextMenuCheckboxItem component across ERB, ViewComponent, and Phlex implementations.
    module UI::ContextMenuCheckboxItemBehavior
      # Returns HTML attributes for the checkbox item
      def context_menu_checkbox_item_html_attributes
        {
          class: context_menu_checkbox_item_classes,
          data: context_menu_checkbox_item_data_attributes,
          role: "menuitemcheckbox",
          "aria-checked": @checked.to_s,
          tabindex: "-1"
        }
      end

      # Returns combined CSS classes for the checkbox item
      def context_menu_checkbox_item_classes
        classes_value = respond_to?(:classes, true) ? classes : @classes
        base_classes = "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"

        TailwindMerge::Merger.new.merge([base_classes, classes_value].compact.join(" "))
      end

      # Returns data attributes for the checkbox item
      def context_menu_checkbox_item_data_attributes
        attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
        existing_action = (attributes_value&.fetch(:data, {}) || {}).fetch(:action, "")
        combined_action = [existing_action, "mouseenter->ui--context-menu#trackHoveredItem"].reject(&:empty?).join(" ")

        (attributes_value&.fetch(:data, {}) || {}).merge({
          "ui--context-menu-target": "item",
          action: combined_action,
          state: @checked ? "checked" : "unchecked"
        })
      end
    end
