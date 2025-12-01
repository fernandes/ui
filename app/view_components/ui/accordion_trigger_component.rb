# frozen_string_literal: true

# Accordion Trigger component (ViewComponent)
# Button that toggles accordion item open/closed
#
# @example Basic usage
#   <%= render UI::AccordionTriggerComponent.new(item_value: "item-1") do %>
#     Click to toggle
#   <% end %>
class UI::AccordionTriggerComponent < ViewComponent::Base
  include UI::AccordionTriggerBehavior

  # @param item_value [String] value from parent AccordionItem
  # @param initial_open [Boolean] initial state from parent AccordionItem
  # @param classes [String] additional CSS classes
  # @param attributes [Hash] additional HTML attributes
  def initialize(item_value: nil, initial_open: false, classes: "", attributes: {})
    @item_value = item_value
    @initial_open = initial_open
    @classes = classes
    @attributes = attributes
  end

  def call
    content_tag :h3, class: "flex", "data-orientation": @orientation || "vertical", "data-state": trigger_state do
      content_tag :button, **trigger_html_attributes do
        safe_join([content, caret_svg])
      end
    end
  end
end
