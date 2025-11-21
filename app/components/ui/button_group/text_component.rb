# frozen_string_literal: true

module UI
  module ButtonGroup
    # TextComponent - ViewComponent implementation
    #
    # Displays text within a button group.
    # Uses TextBehavior module for shared styling logic.
    #
    # Based on shadcn/ui ButtonGroup: https://ui.shadcn.com/docs/components/button-group
    #
    # @example Basic text
    #   <%= render UI::ButtonGroup::ButtonGroupComponent.new do %>
    #     <%= render UI::ButtonGroup::TextComponent.new { "Label" } %>
    #     <%= render UI::Button::ButtonComponent.new(variant: :outline) { "Button" } %>
    #   <% end %>
    class TextComponent < ViewComponent::Base
      include UI::ButtonGroup::TextBehavior

      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def call
        tag.div(**text_html_attributes.deep_merge(@attributes)) do
          content
        end
      end
    end
  end
end
