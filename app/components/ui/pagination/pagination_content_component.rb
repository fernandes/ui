# frozen_string_literal: true

module UI
  module Pagination
    # Pagination Content component (ViewComponent)
    # List container for pagination items
    class PaginationContentComponent < ViewComponent::Base
      include UI::Pagination::PaginationContentBehavior

      # @param classes [String] additional CSS classes
      # @param attributes [Hash] additional HTML attributes
      def initialize(classes: "", attributes: {})
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag :ul, content, **content_html_attributes
      end
    end
  end
end
