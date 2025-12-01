# frozen_string_literal: true

# ButtonGroupComponent - ViewComponent implementation
#
# A container that groups related buttons together with consistent styling.
# Uses ButtonGroupBehavior module for shared styling logic.
#
# Based on shadcn/ui ButtonGroup: https://ui.shadcn.com/docs/components/button-group
#
# @example Horizontal button group (default)
#   <%= render UI::ButtonGroupComponent.new do %>
#     <%= render UI::ButtonComponent.new(variant: :outline) { "Button 1" } %>
#     <%= render UI::ButtonComponent.new(variant: :outline) { "Button 2" } %>
#   <% end %>
#
# @example Vertical button group
#   <%= render UI::ButtonGroupComponent.new(orientation: :vertical) do %>
#     <%= render UI::ButtonComponent.new(variant: :outline, size: :icon) { "+" } %>
#     <%= render UI::ButtonComponent.new(variant: :outline, size: :icon) { "-" } %>
#   <% end %>
class UI::ButtonGroupComponent < ViewComponent::Base
  include UI::ButtonGroupBehavior

  # @param orientation [Symbol, String] Direction of the button group (:horizontal, :vertical)
  # @param classes [String] Additional CSS classes to merge
  # @param attributes [Hash] Additional HTML attributes
  def initialize(orientation: :horizontal, classes: "", **attributes)
    @orientation = orientation
    @classes = classes
    @attributes = attributes
  end

  def call
    tag.div(**button_group_html_attributes.deep_merge(@attributes)) do
      content
    end
  end
end
