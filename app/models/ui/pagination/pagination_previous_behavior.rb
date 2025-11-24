# frozen_string_literal: true

module UI
  module Pagination
    # Shared behavior for Pagination Previous component
    # Handles previous button with icon and text
    module PaginationPreviousBehavior
      # Additional classes for previous button
      def previous_additional_classes
        "gap-1 px-2.5 sm:pl-2.5"
      end

      # Merge additional classes with custom classes using TailwindMerge
      def previous_classes
        TailwindMerge::Merger.new.merge([previous_additional_classes, @classes].compact.join(" "))
      end

      # Merge aria-label with user attributes
      def previous_attributes
        (@attributes || {}).merge({ "aria-label": "Go to previous page" })
      end
    end
  end
end
