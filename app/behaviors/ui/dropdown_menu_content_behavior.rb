# frozen_string_literal: true

    # DropdownMenuContentBehavior
    #
    # Shared behavior for DropdownMenuContent component across ERB, ViewComponent, and Phlex implementations.
    module UI::DropdownMenuContentBehavior
      # Returns HTML attributes for the content container
      def dropdown_menu_content_html_attributes
        {
          class: dropdown_menu_content_classes,
          data: dropdown_menu_content_data_attributes,
          role: "menu",
          tabindex: "-1"
        }
      end

      # Returns combined CSS classes for the content
      def dropdown_menu_content_classes
        classes_value = respond_to?(:classes, true) ? classes : @classes
        base_classes = "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--ui-dropdown-menu-content-available-height) min-w-[8rem] origin-(--ui-dropdown-menu-content-transform-origin) overflow-visible rounded-md border p-1 shadow-md absolute"

        TailwindMerge::Merger.new.merge([
          "hidden absolute",
          base_classes,
          classes_value
        ].compact.join(" "))
      end

      # Returns data attributes for Stimulus target
      def dropdown_menu_content_data_attributes
        attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
        (attributes_value&.fetch(:data, {}) || {}).merge({
          "ui--dropdown-target": "content",
          state: "closed"
        })
      end
    end
