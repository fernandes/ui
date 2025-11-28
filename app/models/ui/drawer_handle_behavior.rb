# frozen_string_literal: true

require "tailwind_merge"

    # Shared behavior for Drawer Handle component
    # Visual affordance for drag gesture (shown on bottom/top drawers only)
    module UI::DrawerHandleBehavior
      # Base CSS classes for handle container
      def drawer_handle_container_base_classes
        [
          "bg-muted mx-auto mt-4 hidden h-2 w-[100px] shrink-0 rounded-full",
          # Only show for bottom direction (matching shadcn/ui implementation)
          "group-data-[vaul-drawer-direction=bottom]/drawer-content:block"
        ].join(" ")
      end

      # Merge base classes with custom classes using TailwindMerge
      def drawer_handle_classes
        TailwindMerge::Merger.new.merge([drawer_handle_container_base_classes, @classes].compact.join(" "))
      end

      # Data attributes for handle (Stimulus target only)
      def drawer_handle_data_attributes
        user_data = @attributes&.fetch(:data, {}) || {}
        user_data.merge({
          ui__drawer_target: "handle"
        })
      end

      # Build complete HTML attributes hash for handle
      def drawer_handle_html_attributes
        base_attrs = @attributes&.except(:data) || {}
        base_attrs.merge(
          class: drawer_handle_classes,
          "aria-hidden": "true",
          "data-vaul-handle": "",
          data: drawer_handle_data_attributes
        )
      end
    end
