# frozen_string_literal: true

module UI
  module Pagination
    # Shared behavior for Pagination Content component
    # Handles the list container for pagination items
    module PaginationContentBehavior
      # Base CSS classes for pagination content
      def content_base_classes
        "flex flex-row items-center gap-1"
      end

      # Merge base classes with custom classes using TailwindMerge
      def content_classes
        TailwindMerge::Merger.new.merge([content_base_classes, @classes].compact.join(" "))
      end

      # Build complete HTML attributes hash for pagination content
      def content_html_attributes
        base_attrs = @attributes&.except(:data) || {}
        base_attrs.merge(
          "data-slot": "pagination-content",
          class: content_classes
        )
      end
    end
  end
end
