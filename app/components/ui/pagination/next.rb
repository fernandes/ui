# frozen_string_literal: true

module UI
  module Pagination
    # Pagination Next component (Phlex)
    # Next page button with icon and text
    class Next < Phlex::HTML
      include UI::Pagination::PaginationNextBehavior

      # @param href [String] URL for the next page
      # @param classes [String] additional CSS classes
      # @param attributes [Hash] additional HTML attributes
      def initialize(href: "#", classes: "", attributes: {}, **)
        @href = href
        @classes = classes
        @attributes = attributes
        super()
      end

      def view_template(&)
        render Link.new(
          href: @href,
          size: "default",
          classes: next_classes,
          attributes: next_attributes
        ) do
          span(class: "hidden sm:block") { "Next" }
          svg(xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round", class: "size-4") do |s|
            s.path(d: "m9 18 6-6-6-6")
          end
        end
      end
    end
  end
end
