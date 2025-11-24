# frozen_string_literal: true

module UI
  module Pagination
    # Pagination Ellipsis component (ViewComponent)
    # Visual indicator for skipped pages
    class PaginationEllipsisComponent < ViewComponent::Base
      include UI::Pagination::PaginationEllipsisBehavior

      # @param classes [String] additional CSS classes
      # @param attributes [Hash] additional HTML attributes
      def initialize(classes: "", attributes: {})
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag :span, **ellipsis_html_attributes do
          content_tag(:svg, xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round", class: "size-4") do
            content_tag(:circle, nil, cx: "12", cy: "12", r: "1") +
            content_tag(:circle, nil, cx: "19", cy: "12", r: "1") +
            content_tag(:circle, nil, cx: "5", cy: "12", r: "1")
          end +
          content_tag(:span, "More pages", class: "sr-only")
        end
      end
    end
  end
end
