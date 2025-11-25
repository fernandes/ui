# frozen_string_literal: true

module UI
  module Menubar
    # MenubarSubBehavior
    #
    # Shared behavior for MenubarSub component across ERB, ViewComponent, and Phlex implementations.
    # This is a wrapper for submenus within the menubar menu.
    module MenubarSubBehavior
      # Returns HTML attributes for the submenu wrapper
      def menubar_sub_html_attributes
        {
          class: menubar_sub_classes,
          data: menubar_sub_data_attributes
        }
      end

      # Returns combined CSS classes for the submenu wrapper
      def menubar_sub_classes
        classes_value = respond_to?(:classes, true) ? classes : @classes
        TailwindMerge::Merger.new.merge([
          "relative",
          classes_value
        ].compact.join(" "))
      end

      # Returns data attributes for the submenu wrapper
      def menubar_sub_data_attributes
        attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
        (attributes_value&.fetch(:data, {}) || {})
      end
    end
  end
end
