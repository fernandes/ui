# frozen_string_literal: true

    # Shared behavior for Pagination Next component
    # Handles next button with icon and text
    module UI::PaginationNextBehavior
      # Additional classes for next button
      def next_additional_classes
        "gap-1 px-2.5 sm:pr-2.5"
      end

      # Merge additional classes with custom classes using TailwindMerge
      def next_classes
        TailwindMerge::Merger.new.merge([next_additional_classes, @classes].compact.join(" "))
      end

      # Merge aria-label with user attributes
      def next_attributes
        (@attributes || {}).merge({ "aria-label": "Go to next page" })
      end
    end
