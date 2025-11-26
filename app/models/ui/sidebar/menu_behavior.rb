# frozen_string_literal: true

require "tailwind_merge"

module UI
  module Sidebar
    # MenuBehavior
    #
    # Shared behavior for SidebarMenu component.
    module MenuBehavior
      def sidebar_menu_html_attributes
        {
          class: sidebar_menu_classes,
          data: sidebar_menu_data_attributes
        }
      end

      def sidebar_menu_classes
        classes_value = respond_to?(:classes, true) ? classes : @classes
        TailwindMerge::Merger.new.merge([
          sidebar_menu_base_classes,
          classes_value
        ].compact.join(" "))
      end

      def sidebar_menu_data_attributes
        {
          slot: "sidebar-menu"
        }
      end

      private

      def sidebar_menu_base_classes
        "flex w-full min-w-0 flex-col gap-1"
      end
    end
  end
end
