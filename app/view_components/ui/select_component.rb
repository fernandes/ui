# frozen_string_literal: true

# SelectComponent - ViewComponent implementation
#
# A custom select component with keyboard navigation, scrollable viewport, and form integration.
# Root container that wraps trigger, content, and items.
#
# @example Basic usage
#   <%= render UI::SelectComponent.new(value: "apple") do %>
#     <%= render UI::TriggerComponent.new(placeholder: "Select a fruit...") %>
#     <%= render UI::ContentComponent.new do %>
#       <%= render UI::ItemComponent.new(value: "apple") { "Apple" } %>
#       <%= render UI::ItemComponent.new(value: "banana") { "Banana" } %>
#     <% end %>
#   <% end %>
class UI::SelectComponent < ViewComponent::Base
  include UI::SelectBehavior

  # @param value [String] Currently selected value
  # @param classes [String] Additional CSS classes to merge
  # @param as_child [Boolean] If true, renders without wrapper div but preserves controller on inner element
  # @param attributes [Hash] Additional HTML attributes
  def initialize(value: nil, classes: "", as_child: false, **attributes)
    @value = value
    @classes = classes
    @as_child = as_child
    @attributes = attributes
  end

  def call
    attrs = select_html_attributes.deep_merge(@attributes)
    if @as_child
      # When as_child, we still need a wrapper for the Stimulus controller
      # but we use a minimal inline wrapper that doesn't break flex layouts
      # Override class to use 'contents' which makes the element invisible to layout
      attrs[:class] = "contents"
      content_tag :span, content, **attrs
    else
      content_tag :div, content, **attrs
    end
  end
end
