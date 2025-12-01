# frozen_string_literal: true

# Pagination Item component (Phlex)
# List item wrapper for pagination elements
class UI::PaginationItem < Phlex::HTML
  include UI::PaginationItemBehavior

  # @param attributes [Hash] additional HTML attributes
  def initialize(attributes: {}, **)
    @attributes = attributes
    super()
  end

  def view_template(&block)
    li(**item_html_attributes, &block)
  end
end
