# frozen_string_literal: true

# Popover - Phlex implementation
#
# Container for popover trigger and content.
# Uses PopoverBehavior concern for shared styling logic.
#
# Supports asChild pattern for composition without wrapper elements.
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
#
# @example With asChild - pass attributes to custom element
#   render UI::Popover.new(as_child: true) do |popover_attrs|
#     render UI::InputGroupAddon.new(**popover_attrs) do
#       render UI::PopoverTrigger.new(as_child: true) do |trigger_attrs|
#         render UI::InputGroupButton.new(**trigger_attrs) { "Info" }
#       end
#       render UI::PopoverContent.new { "Content" }
#     end
#   end
class UI::Popover < Phlex::HTML
  include UI::PopoverBehavior

  # @param as_child [Boolean] When true, yields attributes to block instead of rendering wrapper
  # @param placement [String] Placement of the popover (e.g., "bottom", "top-start")
  # @param offset [Integer] Distance in pixels from the trigger
  # @param trigger [String] Trigger type ("click" or "hover")
  # @param hover_delay [Integer] Delay in milliseconds for hover trigger
  # @param classes [String] Additional CSS classes to merge
  # @param attributes [Hash] Additional HTML attributes
  def initialize(
    as_child: false,
    placement: "bottom",
    offset: 4,
    trigger: "click",
    hover_delay: 200,
    classes: "",
    align: nil,
    side_offset: nil,
    **attributes
  )
    @as_child = as_child
    @placement = placement
    @offset = side_offset || offset
    @trigger = trigger
    @hover_delay = hover_delay
    @classes = classes
    @align = align
    @attributes = attributes
  end

  def view_template(&block)
    popover_attrs = popover_html_attributes.deep_merge(@attributes)

    if @as_child
      # Yield data attributes to block - child receives controller setup
      yield(popover_attrs) if block_given?
    else
      # Default: render wrapper div with controller
      div(**popover_attrs) do
        yield if block_given?
      end
    end
  end
end
