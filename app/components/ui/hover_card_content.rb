# frozen_string_literal: true

# Content - Phlex implementation
#
# The content that appears on hover.
# Uses HoverCardContentBehavior for shared styling logic.
#
# @example Basic usage
#   render UI::Content.new { "Hover card content here" }
#
# @example With custom alignment
#   render UI::Content.new(align: "start", side_offset: 8) do
#     plain "Content"
#   end
class UI::HoverCardContent < Phlex::HTML
  include UI::HoverCardContentBehavior

  # @param align [String] Alignment of the content ("start", "center", "end")
  # @param side_offset [Integer] Distance in pixels from the trigger
  # @param classes [String] Additional CSS classes to merge
  # @param attributes [Hash] Additional HTML attributes
  def initialize(align: "center", side_offset: 4, classes: "", **attributes)
    @align = align
    @side_offset = side_offset
    @classes = classes
    @attributes = attributes
  end

  def view_template(&block)
    div(**content_html_attributes, &block)
  end
end
