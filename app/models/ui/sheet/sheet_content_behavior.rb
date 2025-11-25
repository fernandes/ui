# frozen_string_literal: true

require "tailwind_merge"

module UI
  module Sheet
    # Shared behavior for Sheet Content component
    # Handles side variants and slide animations
    module SheetContentBehavior
      SIDES = %w[top right bottom left].freeze

      # Base CSS classes for sheet content (all sides)
      # Match shadcn exactly - no opacity/pointer-events, just slide animations
      def sheet_content_base_classes
        [
          # Base structure (same as shadcn)
          "bg-background fixed z-50 flex flex-col gap-4 shadow-lg",
          # Transition timing (same as shadcn)
          "transition ease-in-out",
          "data-[state=closed]:duration-300 data-[state=open]:duration-500",
          # Animation (same as shadcn)
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          # Prevent exit animation on page load (our addition)
          "data-[initial]:animate-none data-[initial]:invisible"
        ].join(" ")
      end

      # Side-specific CSS classes
      def sheet_content_side_classes
        side = @side || "right"

        case side.to_s
        when "right"
          "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm"
        when "left"
          "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm"
        when "top"
          "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b"
        when "bottom"
          "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t"
        else
          # Default to right
          "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm"
        end
      end

      # Merge base classes with side classes and custom classes
      def sheet_content_classes
        TailwindMerge::Merger.new.merge([
          sheet_content_base_classes,
          sheet_content_side_classes,
          @classes
        ].compact.join(" "))
      end

      # Data attributes for Stimulus target
      def sheet_content_data_attributes
        {
          ui__dialog_target: "content"
        }
      end

      # Merge user-provided data attributes
      def merged_sheet_content_data_attributes
        user_data = @attributes&.fetch(:data, {}) || {}
        user_data.merge(sheet_content_data_attributes)
      end

      # Build complete HTML attributes hash for sheet content
      def sheet_content_html_attributes
        base_attrs = @attributes&.except(:data) || {}
        attrs = base_attrs.merge(
          class: sheet_content_classes,
          role: "dialog",
          "aria-modal": "true",
          "data-state": @open ? "open" : "closed",
          data: merged_sheet_content_data_attributes
        )
        # Add data-initial when closed to prevent exit animations on page load
        attrs["data-initial"] = "" unless @open
        attrs
      end

      # CSS classes for the built-in close button
      def sheet_content_close_button_classes
        "ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none"
      end
    end
  end
end
