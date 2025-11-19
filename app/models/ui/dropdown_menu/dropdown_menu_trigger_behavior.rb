# frozen_string_literal: true

module UI
  module DropdownMenu
    # DropdownMenuTriggerBehavior
    #
    # Shared behavior for DropdownMenuTrigger component across ERB, ViewComponent, and Phlex implementations.
    module DropdownMenuTriggerBehavior
      # Returns HTML attributes for the trigger
      def dropdown_menu_trigger_html_attributes
        {
          class: dropdown_menu_trigger_classes,
          data: dropdown_menu_trigger_data_attributes
        }
      end

      # Returns combined CSS classes for the trigger
      def dropdown_menu_trigger_classes
        classes_value = respond_to?(:classes, true) ? classes : @classes
        TailwindMerge::Merger.new.merge([classes_value].compact.join(" "))
      end

      # Returns data attributes for Stimulus
      def dropdown_menu_trigger_data_attributes
        attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
        (attributes_value&.fetch(:data, {}) || {}).merge({
          "ui--dropdown-target": "trigger",
          action: "click->ui--dropdown#toggle"
        })
      end
    end
  end
end
