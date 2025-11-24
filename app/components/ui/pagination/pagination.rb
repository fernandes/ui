# frozen_string_literal: true

module UI
  module Pagination
    # Pagination component (Phlex)
    # Container for pagination navigation
    class Pagination < Phlex::HTML
      include UI::Pagination::PaginationBehavior

      # @param classes [String] additional CSS classes
      # @param attributes [Hash] additional HTML attributes
      def initialize(classes: "", attributes: {}, **)
        @classes = classes
        @attributes = attributes
        super()
      end

      def view_template(&block)
        nav(**pagination_html_attributes, &block)
      end
    end
  end
end
