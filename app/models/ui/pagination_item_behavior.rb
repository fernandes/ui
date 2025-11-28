# frozen_string_literal: true

    # Shared behavior for Pagination Item component
    # Handles list item wrapper for pagination elements
    module UI::PaginationItemBehavior
      # Build complete HTML attributes hash for pagination item
      def item_html_attributes
        base_attrs = @attributes || {}
        base_attrs.merge(
          "data-slot": "pagination-item"
        )
      end
    end
