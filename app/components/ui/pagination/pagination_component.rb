# frozen_string_literal: true

module UI
  module Pagination
    # Pagination component (ViewComponent)
    # Container for pagination navigation
    class PaginationComponent < ViewComponent::Base
      include UI::Pagination::PaginationBehavior

      # @param classes [String] additional CSS classes
      # @param attributes [Hash] additional HTML attributes
      def initialize(classes: "", attributes: {})
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag :nav, content, **pagination_html_attributes
      end
    end
  end
end
