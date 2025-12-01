# frozen_string_literal: true

# TabsList component (ViewComponent)
# Container for tab trigger buttons
#
# @example Basic usage
#   <%= render UI::TabsListComponent.new do %>
#     <%= render UI::TabsTriggerComponent.new(value: "tab1") { "Tab 1" } %>
#     <%= render UI::TabsTriggerComponent.new(value: "tab2") { "Tab 2" } %>
#   <% end %>
class UI::TabsListComponent < ViewComponent::Base
  include UI::TabsListBehavior

  # @param orientation [String] "horizontal" or "vertical"
  # @param classes [String] additional CSS classes
  # @param attributes [Hash] additional HTML attributes
  def initialize(orientation: "horizontal", classes: "", attributes: {})
    @orientation = orientation
    @classes = classes
    @attributes = attributes
  end

  def call
    attrs = list_html_attributes

    content_tag :div, **attrs.merge(@attributes) do
      content
    end
  end
end
