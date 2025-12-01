# frozen_string_literal: true

# Pagination Ellipsis component (Phlex)
# Visual indicator for skipped pages
class UI::PaginationEllipsis < Phlex::HTML
  include UI::PaginationEllipsisBehavior

  # @param classes [String] additional CSS classes
  # @param attributes [Hash] additional HTML attributes
  def initialize(classes: "", attributes: {}, **)
    @classes = classes
    @attributes = attributes
    super()
  end

  def view_template(&)
    span(**ellipsis_html_attributes) do
      svg(xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round", class: "size-4") do |s|
        s.circle(cx: "12", cy: "12", r: "1")
        s.circle(cx: "19", cy: "12", r: "1")
        s.circle(cx: "5", cy: "12", r: "1")
      end
      span(class: "sr-only") { "More pages" }
    end
  end
end
