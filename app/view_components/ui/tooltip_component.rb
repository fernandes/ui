# frozen_string_literal: true

# TooltipComponent - ViewComponent implementation
#
# Root container for tooltip. Manages tooltip state via Stimulus controller.
#
# Supports asChild pattern for composition without wrapper elements.
#
# @example Basic usage
#   <%= render UI::TooltipComponent.new do %>
#     <%= render UI::TooltipTriggerComponent.new { "Hover me" } %>
#     <%= render UI::TooltipContentComponent.new { "Tooltip text" } %>
#   <% end %>
#
# @example With asChild - pass attributes to custom element
#   <%= render UI::TooltipComponent.new(as_child: true) do |tooltip| %>
#     <%= render UI::InputGroupAddonComponent.new(**tooltip.tooltip_attrs) do %>
#       <%= render UI::TooltipTriggerComponent.new(as_child: true) do |trigger| %>
#         <%= render UI::InputGroupButtonComponent.new(**trigger.trigger_attrs) { "Info" } %>
#       <% end %>
#       <%= render UI::TooltipContentComponent.new { "Content" } %>
#     <% end %>
#   <% end %>
class UI::TooltipComponent < ViewComponent::Base
  include UI::TooltipBehavior

  # @param as_child [Boolean] When true, yields self to block for attribute access
  # @param attributes [Hash] Additional HTML attributes
  def initialize(as_child: false, **attributes)
    @as_child = as_child
    @attributes = attributes
  end

  # Returns tooltip attributes for as_child mode
  def tooltip_attrs
    tooltip_html_attributes.deep_merge(@attributes)
  end

  def call
    if @as_child
      # asChild mode: yield self to block, child accesses tooltip_attrs
      content
    else
      # Default: render wrapper div with controller
      content_tag :div, **tooltip_html_attributes.merge(@attributes.except(:data)) do
        content
      end
    end
  end
end
