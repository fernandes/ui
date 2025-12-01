# frozen_string_literal: true

# Accordion Content component (ViewComponent)
# Collapsible content area within an accordion item
#
# @example Basic usage
#   <%= render UI::AccordionContentComponent.new(item_value: "item-1") do %>
#     This is the accordion content
#   <% end %>
class UI::AccordionContentComponent < ViewComponent::Base
  include UI::AccordionContentBehavior

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
    content_tag :div, **content_html_attributes do
      content_tag :div, content, class: "pt-0 pb-4"
    end
  end
end
