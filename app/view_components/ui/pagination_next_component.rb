# frozen_string_literal: true

# Pagination Next component (ViewComponent)
# Next page button with icon and text
class UI::PaginationNextComponent < ViewComponent::Base
  include UI::PaginationNextBehavior

  # @param href [String] URL for the next page
  # @param classes [String] additional CSS classes
  # @param attributes [Hash] additional HTML attributes
  def initialize(href: "#", classes: "", attributes: {})
    @href = href
    @classes = classes
    @attributes = attributes
  end

  def call
    render UI::PaginationLinkComponent.new(
      href: @href,
      size: "default",
      classes: next_classes,
      attributes: next_attributes
    ) do
      content_tag(:span, "Next", class: "hidden sm:block") +
        content_tag(:svg, xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round", class: "size-4") do
          content_tag(:path, nil, d: "m9 18 6-6-6-6")
        end
    end
  end
end
