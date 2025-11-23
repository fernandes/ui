# frozen_string_literal: true

require "tailwind_merge"

module UI
  module Drawer
    # Shared behavior for Drawer Header component
    # Reuses Dialog header pattern with drawer-specific spacing
    module DrawerHeaderBehavior
      # Base CSS classes for drawer header
      def drawer_header_base_classes
        [
          "flex flex-col gap-0.5 p-4",
          # Center text for bottom/top drawers, left-align on desktop
          "group-data-[vaul-drawer-direction=bottom]/drawer-content:text-center",
          "group-data-[vaul-drawer-direction=top]/drawer-content:text-center",
          "md:gap-1.5 md:text-left"
        ].join(" ")
      end

      # Merge base classes with custom classes using TailwindMerge
      def drawer_header_classes
        TailwindMerge::Merger.new.merge([drawer_header_base_classes, @classes].compact.join(" "))
      end

      # Build complete HTML attributes hash for header
      def drawer_header_html_attributes
        base_attrs = @attributes || {}
        base_attrs.merge(class: drawer_header_classes)
      end
    end
  end
end
