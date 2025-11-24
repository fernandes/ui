# frozen_string_literal: true

module UI
  module Pagination
    # Pagination Previous component (ViewComponent)
    # Previous page button with icon and text
    class PaginationPreviousComponent < ViewComponent::Base
      include UI::Pagination::PaginationPreviousBehavior

      # @param href [String] URL for the previous page
      # @param classes [String] additional CSS classes
      # @param attributes [Hash] additional HTML attributes
      def initialize(href: "#", classes: "", attributes: {})
        @href = href
        @classes = classes
        @attributes = attributes
      end

      def call
        render PaginationLinkComponent.new(
          href: @href,
          size: "default",
          classes: previous_classes,
          attributes: previous_attributes
        ) do
          content_tag(:svg, xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round", class: "size-4") do
            content_tag(:path, nil, d: "m15 18-6-6 6-6")
          end +
          content_tag(:span, "Previous", class: "hidden sm:block")
        end
      end
    end
  end
end
