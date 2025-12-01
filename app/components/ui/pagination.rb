# frozen_string_literal: true

# Pagination component (Phlex)
# Container for pagination navigation
class UI::Pagination < Phlex::HTML
  include UI::PaginationBehavior

  # @param classes [String] additional CSS classes
  # @param attributes [Hash] additional HTML attributes
  def initialize(classes: "", attributes: {}, **)
    @classes = classes
    @attributes = attributes
    super()
  end

  def view_template(&block)
    nav(**pagination_html_attributes, &block)
  end
end
