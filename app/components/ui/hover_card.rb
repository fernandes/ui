# frozen_string_literal: true

# HoverCard - Phlex implementation
#
# Container for hover card trigger and content.
# Uses HoverCardBehavior for shared styling logic.
#
# @example Basic usage
#   render UI::HoverCard.new do
#     render UI::Trigger.new { "Hover me" }
#     render UI::Content.new { "Hover card content" }
#   end
class UI::HoverCard < Phlex::HTML
  include UI::HoverCardBehavior

  # @param classes [String] Additional CSS classes to merge
  # @param attributes [Hash] Additional HTML attributes
  def initialize(classes: "", **attributes)
    @classes = classes
    @attributes = attributes
  end

  def view_template(&block)
    div(**hover_card_html_attributes, &block)
  end
end
