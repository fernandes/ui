# frozen_string_literal: true

# InputGroupButtonComponent - ViewComponent implementation
#
# A button component specifically styled for use within input groups.
# Uses InputGroupButtonBehavior concern for shared styling logic.
#
# @example Basic button
#   <%= render UI::InputGroupButtonComponent.new do %>
#     Search
#   <% end %>
#
# @example Icon button
#   <%= render UI::InputGroupButtonComponent.new(size: "icon-xs") do %>
#     <svg>...</svg>
#   <% end %>
class UI::InputGroupButtonComponent < ViewComponent::Base
  include UI::InputGroupButtonBehavior

  # @param size [String] Size variant: "xs", "sm", "icon-xs", "icon-sm"
  # @param variant [String] Button variant (default: "ghost")
  # @param type [String] Button type attribute (default: "button")
  # @param classes [String] Additional CSS classes to merge
  # @param attributes [Hash] Additional HTML attributes
  def initialize(size: "xs", variant: "ghost", type: "button", classes: "", **attributes)
    @size = size
    @variant = variant
    @type = type
    @classes = classes
    @attributes = attributes
  end

  def call
    render partial: "ui/button", locals: input_group_button_attributes.merge(content: content)
  end
end
