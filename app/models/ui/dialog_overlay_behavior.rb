# frozen_string_literal: true

require "tailwind_merge"

    # Shared behavior for Dialog Overlay component
    # Handles backdrop/overlay styling and attributes
    module UI::DialogOverlayBehavior
      # Base CSS classes for overlay backdrop
      # Use opacity-0 and pointer-events-none when closed for smooth animations
      def dialog_overlay_base_classes
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:opacity-0 data-[state=open]:opacity-100 data-[state=open]:pointer-events-auto data-[state=closed]:pointer-events-none fixed inset-0 z-50 bg-black/50"
      end

      # Merge base classes with custom classes using TailwindMerge
      def dialog_overlay_classes
        TailwindMerge::Merger.new.merge([dialog_overlay_base_classes].compact.join(" "))
      end

      # Container wrapper classes
      # Use invisible (visibility: hidden) when closed, visible when open
      def dialog_overlay_container_base_classes
        "data-[state=closed]:invisible data-[state=open]:visible fixed inset-0 z-50"
      end

      # Merge container base classes with custom classes
      def dialog_overlay_container_classes
        TailwindMerge::Merger.new.merge([dialog_overlay_container_base_classes, @classes].compact.join(" "))
      end

      # Data attributes for container
      def dialog_overlay_container_data_attributes
        {
          ui__dialog_target: "container"
        }
      end

      # Data attributes for overlay backdrop
      def dialog_overlay_data_attributes
        {
          ui__dialog_target: "overlay",
          action: "click->ui--dialog#closeOnOverlayClick"
        }
      end

      # Merge user-provided data attributes for container
      def merged_dialog_overlay_container_data_attributes
        user_data = @attributes&.fetch(:data, {}) || {}
        user_data.merge(dialog_overlay_container_data_attributes)
      end

      # Build complete HTML attributes hash for container wrapper
      def dialog_overlay_container_html_attributes
        base_attrs = @attributes&.except(:data) || {}
        base_attrs.merge(
          class: dialog_overlay_container_classes,
          "data-state": @open ? "open" : "closed",
          data: merged_dialog_overlay_container_data_attributes
        )
      end

      # Build complete HTML attributes hash for overlay backdrop
      def dialog_overlay_html_attributes
        {
          class: dialog_overlay_classes,
          "data-state": @open ? "open" : "closed",
          data: dialog_overlay_data_attributes
        }
      end
    end
