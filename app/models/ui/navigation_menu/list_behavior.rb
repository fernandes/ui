# frozen_string_literal: true

module UI
  module NavigationMenu
    # ListBehavior
    #
    # Shared behavior for NavigationMenu List component.
    module ListBehavior
      # Returns HTML attributes for the list
      def navigation_menu_list_html_attributes
        attrs = {
          class: navigation_menu_list_classes,
          data: navigation_menu_list_data_attributes
        }
        attrs
      end

      # Returns combined CSS classes for the list
      def navigation_menu_list_classes
        classes_value = respond_to?(:classes, true) ? classes : @classes
        TailwindMerge::Merger.new.merge([
          "group/navigation-menu-list flex flex-1 list-none items-center justify-center gap-1",
          classes_value
        ].compact.join(" "))
      end

      # Returns data attributes
      def navigation_menu_list_data_attributes
        attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
        base_data = {
          slot: "navigation-menu-list"
        }
        (attributes_value&.fetch(:data, {}) || {}).merge(base_data)
      end
    end
  end
end
