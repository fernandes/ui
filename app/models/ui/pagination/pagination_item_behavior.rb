# frozen_string_literal: true

module UI
  module Pagination
    # Shared behavior for Pagination Item component
    # Handles list item wrapper for pagination elements
    module PaginationItemBehavior
      # Build complete HTML attributes hash for pagination item
      def item_html_attributes
        base_attrs = @attributes || {}
        base_attrs.merge(
          "data-slot": "pagination-item"
        )
      end
    end
  end
end
