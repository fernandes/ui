# frozen_string_literal: true

    # DropdownMenuRadioGroupBehavior
    #
    # Shared behavior for DropdownMenuRadioGroup component across ERB, ViewComponent, and Phlex implementations.
    module UI::DropdownMenuRadioGroupBehavior
      # Returns HTML attributes for the radio group
      def dropdown_menu_radio_group_html_attributes
        {
          class: dropdown_menu_radio_group_classes,
          role: "group"
        }
      end

      # Returns combined CSS classes for the radio group
      def dropdown_menu_radio_group_classes
        classes_value = respond_to?(:classes, true) ? classes : @classes
        TailwindMerge::Merger.new.merge([classes_value].compact.join(" "))
      end
    end
