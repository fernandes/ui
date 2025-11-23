# frozen_string_literal: true

require "tailwind_merge"

module UI
  module Drawer
    # Shared behavior for Drawer Overlay component
    # Handles backdrop/overlay styling and attributes for Vaul drawer
    module DrawerOverlayBehavior
      # Base CSS classes for overlay backdrop
      # Animated background overlay with fade transition
      def drawer_overlay_base_classes
        [
          "fixed inset-0 z-50 bg-black/50",
          "transition-opacity duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
          "data-[state=closed]:opacity-0 data-[state=open]:opacity-100",
          "data-[state=open]:pointer-events-auto data-[state=closed]:pointer-events-none"
        ].join(" ")
      end

      # Merge base classes with custom classes using TailwindMerge
      def drawer_overlay_classes
        TailwindMerge::Merger.new.merge([drawer_overlay_base_classes].compact.join(" "))
      end

      # Container wrapper classes
      # Always visible to allow animations - control visibility via pointer-events
      def drawer_overlay_container_base_classes
        "fixed inset-0 z-50 data-[state=open]:pointer-events-auto data-[state=closed]:pointer-events-none"
      end

      # Merge container base classes with custom classes
      def drawer_overlay_container_classes
        TailwindMerge::Merger.new.merge([drawer_overlay_container_base_classes, @classes].compact.join(" "))
      end

      # Data attributes for container
      def drawer_overlay_container_data_attributes
        {
          ui__drawer_target: "container"
        }
      end

      # Data attributes for overlay backdrop (Stimulus only)
      def drawer_overlay_data_attributes
        {
          ui__drawer_target: "overlay",
          action: "click->ui--drawer#closeOnOverlayClick"
        }
      end

      # Merge user-provided data attributes for container
      def merged_drawer_overlay_container_data_attributes
        user_data = @attributes&.fetch(:data, {}) || {}
        user_data.merge(drawer_overlay_container_data_attributes)
      end

      # Build complete HTML attributes hash for container wrapper
      def drawer_overlay_container_html_attributes
        base_attrs = @attributes&.except(:data) || {}
        base_attrs.merge(
          class: drawer_overlay_container_classes,
          "data-state": @open ? "open" : "closed",
          data: merged_drawer_overlay_container_data_attributes
        )
      end

      # Build complete HTML attributes hash for overlay backdrop
      def drawer_overlay_html_attributes
        {
          class: drawer_overlay_classes,
          "data-state": @open ? "open" : "closed",
          "data-vaul-overlay": "",
          data: drawer_overlay_data_attributes
        }
      end
    end
  end
end
