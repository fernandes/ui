# frozen_string_literal: true

# Tooltip - Phlex implementation
#
# Root container for tooltip. Manages tooltip state via Stimulus controller.
#
# Supports asChild pattern for composition without wrapper elements.
#
# @example Basic usage
#   render UI::Tooltip.new do
#     render UI::Trigger.new { "Hover me" }
#     render UI::Content.new { "Tooltip text" }
#   end
#
# @example With asChild trigger
#   render UI::Tooltip.new do
#     render UI::Trigger.new(as_child: true) do |attrs|
#       render UI::Button.new(**attrs) { "Hover" }
#     end
#     render UI::Content.new { "Tooltip text" }
#   end
#
# @example With asChild - pass attributes to custom element
#   render UI::Tooltip.new(as_child: true) do |tooltip_attrs|
#     render UI::InputGroupAddon.new(**tooltip_attrs) do
#       render UI::TooltipTrigger.new(as_child: true) do |trigger_attrs|
#         render UI::InputGroupButton.new(**trigger_attrs) { "Info" }
#       end
#       render UI::TooltipContent.new { "Content" }
#     end
#   end
class UI::Tooltip < Phlex::HTML
  include UI::TooltipBehavior

  # @param as_child [Boolean] When true, yields attributes to block instead of rendering wrapper
  # @param attributes [Hash] Additional HTML attributes
  def initialize(as_child: false, **attributes)
    @as_child = as_child
    @attributes = attributes
  end

  def view_template(&block)
    tooltip_attrs = tooltip_html_attributes.deep_merge(@attributes)

    if @as_child
      # Yield data attributes to block - child receives controller setup
      yield(tooltip_attrs) if block_given?
    else
      # Default: render wrapper div with controller
      div(**tooltip_attrs) do
        yield if block_given?
      end
    end
  end
end
