# frozen_string_literal: true

# TabsContent component (Phlex)
# Panel displaying content for active tab
#
# @example Basic usage
#   render UI::Content.new(value: "account") do
#     "Account settings content"
#   end
class UI::TabsContent < Phlex::HTML
  include UI::TabsContentBehavior

  # @param value [String] unique identifier for this content panel
  # @param default_value [String] currently active tab value
  # @param orientation [String] "horizontal" or "vertical"
  # @param classes [String] additional CSS classes
  # @param attributes [Hash] additional HTML attributes
  def initialize(value: "", default_value: "", orientation: "horizontal", classes: "", attributes: {}, **)
    @value = value
    @default_value = default_value
    @orientation = orientation
    @classes = classes
    @attributes = attributes
    super()
  end

  def view_template(&block)
    div(**content_html_attributes, &block)
  end
end
