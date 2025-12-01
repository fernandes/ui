# frozen_string_literal: true

# Pagination Content component (Phlex)
# List container for pagination items
class UI::PaginationContent < Phlex::HTML
  include UI::PaginationContentBehavior

  # @param classes [String] additional CSS classes
  # @param attributes [Hash] additional HTML attributes
  def initialize(classes: "", attributes: {}, **)
    @classes = classes
    @attributes = attributes
    super()
  end

  def view_template(&block)
    ul(**content_html_attributes, &block)
  end
end
