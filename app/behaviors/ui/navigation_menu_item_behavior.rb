# frozen_string_literal: true

    # ItemBehavior
    #
    # Shared behavior for NavigationMenu Item component.
    module UI::NavigationMenuItemBehavior
      # Returns HTML attributes for the item
      def navigation_menu_item_html_attributes
        attrs = {
          class: navigation_menu_item_classes,
          data: navigation_menu_item_data_attributes
        }
        attrs
      end

      # Returns combined CSS classes for the item
      def navigation_menu_item_classes
        classes_value = respond_to?(:classes, true) ? classes : @classes
        TailwindMerge::Merger.new.merge([
          "group/navigation-menu-item relative",
          classes_value
        ].compact.join(" "))
      end

      # Returns data attributes
      def navigation_menu_item_data_attributes
        attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
        base_data = {
          slot: "navigation-menu-item",
          "ui--navigation-menu-target": "item"
        }

        # Add value if provided (for controlled state)
        base_data[:value] = @value if defined?(@value) && @value

        (attributes_value&.fetch(:data, {}) || {}).merge(base_data)
      end
    end
