# frozen_string_literal: true

require "tailwind_merge"

module UI
  module Drawer
    # Shared behavior for Drawer Content component
    # Handles draggable panel styling, direction variants, and animations
    module DrawerContentBehavior
      # Base CSS classes for drawer content
      # Direction-aware positioning with animations
      def drawer_content_base_classes
        [
          # Base structure with group for child targeting
          "group/drawer-content bg-background fixed z-50 flex h-auto flex-col",

          # Pointer events control - prevent interaction when closed, enable when open
          "data-[state=open]:pointer-events-auto data-[state=closed]:pointer-events-none",

          # Note: NO CSS transitions - JavaScript controls all animations via inline styles
          # This prevents conflicts between CSS and JS transitions

          # Bottom direction (default)
          "data-[vaul-drawer-direction=bottom]:inset-x-0",
          "data-[vaul-drawer-direction=bottom]:bottom-0",
          "data-[vaul-drawer-direction=bottom]:mt-24",
          "data-[vaul-drawer-direction=bottom]:max-h-[80vh]",
          "data-[vaul-drawer-direction=bottom]:rounded-t-lg",
          "data-[vaul-drawer-direction=bottom]:border-t",
          "data-[vaul-drawer-direction=bottom]:data-[state=closed]:translate-y-full",
          "data-[vaul-drawer-direction=bottom]:data-[state=open]:translate-y-0",

          # Top direction
          "data-[vaul-drawer-direction=top]:inset-x-0",
          "data-[vaul-drawer-direction=top]:top-0",
          "data-[vaul-drawer-direction=top]:mb-24",
          "data-[vaul-drawer-direction=top]:max-h-[80vh]",
          "data-[vaul-drawer-direction=top]:rounded-b-lg",
          "data-[vaul-drawer-direction=top]:border-b",
          "data-[vaul-drawer-direction=top]:data-[state=closed]:-translate-y-full",
          "data-[vaul-drawer-direction=top]:data-[state=open]:translate-y-0",

          # Right direction
          "data-[vaul-drawer-direction=right]:inset-y-0",
          "data-[vaul-drawer-direction=right]:right-0",
          "data-[vaul-drawer-direction=right]:w-3/4",
          "data-[vaul-drawer-direction=right]:border-l",
          "data-[vaul-drawer-direction=right]:sm:max-w-sm",
          "data-[vaul-drawer-direction=right]:data-[state=closed]:translate-x-full",
          "data-[vaul-drawer-direction=right]:data-[state=open]:translate-x-0",

          # Left direction
          "data-[vaul-drawer-direction=left]:inset-y-0",
          "data-[vaul-drawer-direction=left]:left-0",
          "data-[vaul-drawer-direction=left]:w-3/4",
          "data-[vaul-drawer-direction=left]:border-r",
          "data-[vaul-drawer-direction=left]:sm:max-w-sm",
          "data-[vaul-drawer-direction=left]:data-[state=closed]:-translate-x-full",
          "data-[vaul-drawer-direction=left]:data-[state=open]:translate-x-0"
        ].join(" ")
      end

      # Merge base classes with custom classes using TailwindMerge
      def drawer_content_classes
        TailwindMerge::Merger.new.merge([drawer_content_base_classes, @classes].compact.join(" "))
      end

      # Data attributes for Stimulus target (go inside data: hash)
      def drawer_content_data_attributes
        attrs = {
          ui__drawer_target: "content"
        }

        # Add action for pointer events (drag handling)
        attrs[:action] = [
          "pointerdown->ui--drawer#handlePointerDown",
          "pointermove->ui--drawer#handlePointerMove",
          "pointerup->ui--drawer#handlePointerUp",
          "pointercancel->ui--drawer#handlePointerCancel"
        ].join(" ")

        attrs
      end

      # Merge user-provided data attributes
      def merged_drawer_content_data_attributes
        user_data = @attributes&.fetch(:data, {}) || {}
        user_data.merge(drawer_content_data_attributes)
      end

      # Build complete HTML attributes hash for drawer content
      def drawer_content_html_attributes
        direction = @direction || "bottom"

        base_attrs = @attributes&.except(:data) || {}
        base_attrs.merge(
          class: drawer_content_classes,
          role: "dialog",
          "aria-modal": "true",
          "data-state": @open ? "open" : "closed",
          "data-vaul-drawer": "",
          "data-vaul-drawer-direction": direction,
          data: merged_drawer_content_data_attributes
        )
      end
    end
  end
end
