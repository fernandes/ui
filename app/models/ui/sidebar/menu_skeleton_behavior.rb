# frozen_string_literal: true

require "tailwind_merge"

module UI
  module Sidebar
    # MenuSkeletonBehavior
    #
    # Shared behavior for SidebarMenuSkeleton component.
    module MenuSkeletonBehavior
      def sidebar_menu_skeleton_html_attributes
        {
          class: sidebar_menu_skeleton_classes,
          data: sidebar_menu_skeleton_data_attributes
        }
      end

      def sidebar_menu_skeleton_classes
        classes_value = respond_to?(:classes, true) ? classes : @classes
        TailwindMerge::Merger.new.merge([
          sidebar_menu_skeleton_base_classes,
          classes_value
        ].compact.join(" "))
      end

      def sidebar_menu_skeleton_data_attributes
        {
          slot: "sidebar-menu-skeleton"
        }
      end

      private

      def sidebar_menu_skeleton_base_classes
        "flex h-8 items-center gap-2 rounded-md px-2"
      end
    end
  end
end
