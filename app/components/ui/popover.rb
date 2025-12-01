# frozen_string_literal: true

# Popover - Phlex implementation
#
# Container for popover trigger and content.
# Uses PopoverBehavior concern for shared styling logic.
#
# @example Basic usage
#   render UI::Popover.new do
#     render UI::Trigger.new do
#       button { "Click me" }
#     end
#     render UI::Content.new do
#       plain "Popover content"
#     end
#   end
class UI::Popover < Phlex::HTML
  include UI::PopoverBehavior

  # @param placement [String] Placement of the popover (e.g., "bottom", "top-start")
  # @param offset [Integer] Distance in pixels from the trigger
  # @param trigger [String] Trigger type ("click" or "hover")
  # @param hover_delay [Integer] Delay in milliseconds for hover trigger
  # @param classes [String] Additional CSS classes to merge
  # @param attributes [Hash] Additional HTML attributes
  def initialize(
    placement: "bottom",
    offset: 4,
    trigger: "click",
    hover_delay: 200,
    classes: "",
    align: nil,
    side_offset: nil,
    **attributes
  )
    @placement = placement
    @offset = side_offset || offset
    @trigger = trigger
    @hover_delay = hover_delay
    @classes = classes
    @align = align
    @attributes = attributes
  end

  def view_template(&block)
    div(**popover_html_attributes, &block)
  end
end
