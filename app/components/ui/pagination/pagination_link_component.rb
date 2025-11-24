# frozen_string_literal: true

module UI
  module Pagination
    # Pagination Link component (ViewComponent)
    # Clickable link for page numbers
    class PaginationLinkComponent < ViewComponent::Base
      include UI::Pagination::PaginationLinkBehavior

      # @param href [String] URL for the link
      # @param active [Boolean] whether this link is for the current page
      # @param size [String] size variant: "icon", "default", "sm", "lg"
      # @param classes [String] additional CSS classes
      # @param attributes [Hash] additional HTML attributes
      def initialize(href: "#", active: false, size: "icon", classes: "", attributes: {})
        @href = href
        @active = active
        @size = size
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag :a, **link_html_attributes do
          content
        end
      end
    end
  end
end
