# frozen_string_literal: true

require "tailwind_merge"

    # MenuItemBehavior
    #
    # Shared behavior for SidebarMenuItem component.
    module UI::SidebarMenuItemBehavior
      def sidebar_menu_item_html_attributes
        {
          class: sidebar_menu_item_classes,
          data: sidebar_menu_item_data_attributes
        }
      end

      def sidebar_menu_item_classes
        classes_value = respond_to?(:classes, true) ? classes : @classes
        TailwindMerge::Merger.new.merge([
          sidebar_menu_item_base_classes,
          classes_value
        ].compact.join(" "))
      end

      def sidebar_menu_item_data_attributes
        {
          slot: "sidebar-menu-item"
        }
      end

      private

      def sidebar_menu_item_base_classes
        "group/menu-item relative"
      end
    end
