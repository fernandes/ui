# frozen_string_literal: true

require "tailwind_merge"

module UI
  module Sheet
    # Shared behavior for Sheet Header component
    module SheetHeaderBehavior
      # Returns HTML attributes for the sheet header
      def sheet_header_html_attributes
        {
          class: sheet_header_classes
        }
      end

      # Returns combined CSS classes for the sheet header
      def sheet_header_classes
        TailwindMerge::Merger.new.merge([
          sheet_header_base_classes,
          @classes
        ].compact.join(" "))
      end

      # Base classes applied to sheet header
      # Different from Dialog: uses gap-1.5 and p-4
      def sheet_header_base_classes
        "flex flex-col gap-1.5 p-4"
      end
    end
  end
end
