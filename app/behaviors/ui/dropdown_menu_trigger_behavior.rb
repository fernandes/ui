# frozen_string_literal: true

    # DropdownMenuTriggerBehavior
    #
    # Shared behavior for DropdownMenuTrigger component across ERB, ViewComponent, and Phlex implementations.
    module UI::DropdownMenuTriggerBehavior
      # Returns HTML attributes for the trigger
      # When as_child is true, only data attributes are returned to avoid overriding child's classes
      def dropdown_menu_trigger_html_attributes
        attrs = {
          data: dropdown_menu_trigger_data_attributes,
          tabindex: "0",
          role: "button",
          "aria-haspopup": "menu"
        }

        # Only include class if it's not empty (to avoid overriding child component's classes)
        trigger_classes = dropdown_menu_trigger_classes
        attrs[:class] = trigger_classes unless trigger_classes.blank?

        attrs
      end

      # Returns combined CSS classes for the trigger
      def dropdown_menu_trigger_classes
        classes_value = respond_to?(:classes, true) ? classes : @classes
        TailwindMerge::Merger.new.merge([
          dropdown_menu_trigger_base_classes,
          classes_value
        ].compact.join(" "))
      end

      # Base classes for trigger (focus styles)
      def dropdown_menu_trigger_base_classes
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
      end

      # Returns data attributes for Stimulus
      def dropdown_menu_trigger_data_attributes
        attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
        (attributes_value&.fetch(:data, {}) || {}).merge({
          "ui--dropdown-target": "trigger",
          action: "click->ui--dropdown#toggle keydown.enter->ui--dropdown#toggle keydown.space->ui--dropdown#toggle"
        })
      end
    end
