# frozen_string_literal: true

require "tailwind_merge"

module UI
  module Sidebar
    # RailBehavior
    #
    # Shared behavior for SidebarRail component.
    module RailBehavior
      def sidebar_rail_html_attributes
        {
          class: sidebar_rail_classes,
          data: sidebar_rail_data_attributes,
          tabindex: "-1",
          aria: { label: "Toggle Sidebar" }
        }
      end

      def sidebar_rail_classes
        classes_value = respond_to?(:classes, true) ? classes : @classes
        TailwindMerge::Merger.new.merge([
          sidebar_rail_base_classes,
          classes_value
        ].compact.join(" "))
      end

      def sidebar_rail_data_attributes
        {
          slot: "sidebar-rail",
          action: "click->ui--sidebar#toggle"
        }
      end

      private

      def sidebar_rail_base_classes
        "absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear " \
        "after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-sidebar-border " \
        "group-data-[side=left]:-right-4 group-data-[side=right]:left-0 sm:flex " \
        "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize " \
        "[[data-side=right][data-state=collapsed]_&]:cursor-w-resize " \
        "group-data-[collapsible=offcanvas]:translate-x-0 " \
        "group-data-[collapsible=offcanvas]:after:left-full " \
        "group-data-[collapsible=offcanvas]:hover:bg-sidebar " \
        "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2 " \
        "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2"
      end
    end
  end
end
