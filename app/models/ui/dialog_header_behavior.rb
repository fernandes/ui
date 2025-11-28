# frozen_string_literal: true

require "tailwind_merge"

    # Shared behavior for Dialog Header component
    module UI::DialogHeaderBehavior
      # Returns HTML attributes for the dialog header
      def dialog_header_html_attributes
        {
          class: dialog_header_classes
        }
      end

      # Returns combined CSS classes for the dialog header
      def dialog_header_classes
        TailwindMerge::Merger.new.merge([
          dialog_header_base_classes,
          @classes
        ].compact.join(" "))
      end

      # Base classes applied to dialog header
      def dialog_header_base_classes
        "flex flex-col gap-2 text-center sm:text-left"
      end
    end
