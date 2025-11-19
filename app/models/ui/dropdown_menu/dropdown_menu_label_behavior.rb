# frozen_string_literal: true

module UI
  module DropdownMenu
    # DropdownMenuLabelBehavior
    #
    # Shared behavior for DropdownMenuLabel component across ERB, ViewComponent, and Phlex implementations.
    module DropdownMenuLabelBehavior
      # Returns HTML attributes for the label
      def dropdown_menu_label_html_attributes
        {
          class: dropdown_menu_label_classes,
          data: dropdown_menu_label_data_attributes
        }
      end

      # Returns combined CSS classes for the label
      def dropdown_menu_label_classes
        classes_value = respond_to?(:classes, true) ? classes : @classes
        base_classes = "px-2 py-1.5 text-sm font-medium data-[inset=true]:pl-8"

        TailwindMerge::Merger.new.merge([base_classes, classes_value].compact.join(" "))
      end

      # Returns data attributes
      def dropdown_menu_label_data_attributes
        attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
        data_attrs = (attributes_value&.fetch(:data, {}) || {}).dup
        data_attrs[:inset] = @inset if @inset
        data_attrs
      end
    end
  end
end
