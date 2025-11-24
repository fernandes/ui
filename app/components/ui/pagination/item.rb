# frozen_string_literal: true

module UI
  module Pagination
    # Pagination Item component (Phlex)
    # List item wrapper for pagination elements
    class Item < Phlex::HTML
      include UI::Pagination::PaginationItemBehavior

      # @param attributes [Hash] additional HTML attributes
      def initialize(attributes: {}, **)
        @attributes = attributes
        super()
      end

      def view_template(&block)
        li(**item_html_attributes, &block)
      end
    end
  end
end
