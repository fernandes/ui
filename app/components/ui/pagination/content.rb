# frozen_string_literal: true

module UI
  module Pagination
    # Pagination Content component (Phlex)
    # List container for pagination items
    class Content < Phlex::HTML
      include UI::Pagination::PaginationContentBehavior

      # @param classes [String] additional CSS classes
      # @param attributes [Hash] additional HTML attributes
      def initialize(classes: "", attributes: {}, **)
        @classes = classes
        @attributes = attributes
        super()
      end

      def view_template(&block)
        ul(**content_html_attributes, &block)
      end
    end
  end
end
