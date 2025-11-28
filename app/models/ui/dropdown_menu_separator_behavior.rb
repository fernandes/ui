# frozen_string_literal: true

    # DropdownMenuSeparatorBehavior
    #
    # Shared behavior for DropdownMenuSeparator component across ERB, ViewComponent, and Phlex implementations.
    module UI::DropdownMenuSeparatorBehavior
      # Returns HTML attributes for the separator
      def dropdown_menu_separator_html_attributes
        {
          class: dropdown_menu_separator_classes,
          role: "separator",
          "aria-orientation": "horizontal"
        }
      end

      # Returns combined CSS classes for the separator
      def dropdown_menu_separator_classes
        classes_value = respond_to?(:classes, true) ? classes : @classes
        base_classes = "bg-border -mx-1 my-1 h-px"

        TailwindMerge::Merger.new.merge([base_classes, classes_value].compact.join(" "))
      end
    end
