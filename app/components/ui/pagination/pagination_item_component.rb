# frozen_string_literal: true

module UI
  module Pagination
    # Pagination Item component (ViewComponent)
    # List item wrapper for pagination elements
    class PaginationItemComponent < ViewComponent::Base
      include UI::Pagination::PaginationItemBehavior

      # @param attributes [Hash] additional HTML attributes
      def initialize(attributes: {})
        @attributes = attributes
      end

      def call
        content_tag :li, content, **item_html_attributes
      end
    end
  end
end
