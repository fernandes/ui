# frozen_string_literal: true

require "tailwind_merge"

    # Shared behavior for Sheet Content component
    # Handles side variants and slide animations
    module UI::SheetContentBehavior
      SIDES = %w[top right bottom left].freeze

      # Base CSS classes for sheet content (all sides)
      # Match shadcn exactly - slide animations with proper pointer-events
      def sheet_content_base_classes
        [
          # Base structure (same as shadcn) - shadow only when open to avoid shadow bleeding when closed
          "bg-background fixed z-50 flex flex-col gap-4",
          "data-[state=open]:shadow-lg data-[state=closed]:shadow-none",
          # Pointer events control - prevent interaction when closed
          "data-[state=open]:pointer-events-auto data-[state=closed]:pointer-events-none",
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
      # Include translate classes to keep content off-screen when closed (after animation ends)
      def sheet_content_side_classes
        side = @side || "right"

        case side.to_s
        when "right"
          "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right data-[state=closed]:translate-x-full data-[state=open]:translate-x-0 inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm"
        when "left"
          "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left data-[state=closed]:-translate-x-full data-[state=open]:translate-x-0 inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm"
        when "top"
          "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top data-[state=closed]:-translate-y-full data-[state=open]:translate-y-0 inset-x-0 top-0 h-auto border-b"
        when "bottom"
          "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom data-[state=closed]:translate-y-full data-[state=open]:translate-y-0 inset-x-0 bottom-0 h-auto border-t"
        else
          # Default to right
          "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right data-[state=closed]:translate-x-full data-[state=open]:translate-x-0 inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm"
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
        # Add inert when closed to prevent focus on elements inside
        attrs[:inert] = true unless @open
        attrs
      end

      # CSS classes for the built-in close button
      def sheet_content_close_button_classes
        "ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none"
      end
    end
