# frozen_string_literal: true

module UI
  module ButtonGroup
    # ButtonGroupComponent - ViewComponent implementation
    #
    # A container that groups related buttons together with consistent styling.
    # Uses ButtonGroupBehavior module for shared styling logic.
    #
    # Based on shadcn/ui ButtonGroup: https://ui.shadcn.com/docs/components/button-group
    #
    # @example Horizontal button group (default)
    #   <%= render UI::ButtonGroup::ButtonGroupComponent.new do %>
    #     <%= render UI::Button::ButtonComponent.new(variant: :outline) { "Button 1" } %>
    #     <%= render UI::Button::ButtonComponent.new(variant: :outline) { "Button 2" } %>
    #   <% end %>
    #
    # @example Vertical button group
    #   <%= render UI::ButtonGroup::ButtonGroupComponent.new(orientation: :vertical) do %>
    #     <%= render UI::Button::ButtonComponent.new(variant: :outline, size: :icon) { "+" } %>
    #     <%= render UI::Button::ButtonComponent.new(variant: :outline, size: :icon) { "-" } %>
    #   <% end %>
    class ButtonGroupComponent < ViewComponent::Base
      include UI::ButtonGroup::ButtonGroupBehavior

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
  end
end
