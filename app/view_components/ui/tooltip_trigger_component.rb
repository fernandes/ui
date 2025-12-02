# frozen_string_literal: true

# TriggerComponent - ViewComponent implementation
#
# The interactive element that shows/hides the tooltip on hover/focus.
# Supports asChild pattern for composition with other components.
#
# @example Basic usage
#   <%= render UI::TooltipTriggerComponent.new do %>
#     Hover me
#   <% end %>
#
# @example As child (yields attributes to block)
#   <%= render UI::TooltipTriggerComponent.new(as_child: true) do |trigger| %>
#     <%= render UI::InputGroupButtonComponent.new(**trigger.trigger_attrs) do %>
#       Info
#     <% end %>
#   <% end %>
class UI::TooltipTriggerComponent < ViewComponent::Base
  include UI::TooltipTriggerBehavior

  # @param as_child [Boolean] If true, yields attributes to block instead of rendering button
  # @param attributes [Hash] Additional HTML attributes
  def initialize(as_child: false, **attributes)
    @as_child = as_child
    @attributes = attributes
  end

  # Returns trigger attributes for as_child mode
  def trigger_attrs
    tooltip_trigger_html_attributes.deep_merge(@attributes)
  end

  def call
    if @as_child
      # asChild mode: yield self so caller can access trigger_attrs
      content
    else
      # Default mode: render as button with proper styling
      content_tag :button, **trigger_attrs do
        content
      end
    end
  end
end
