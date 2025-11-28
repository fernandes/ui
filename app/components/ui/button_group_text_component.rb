# frozen_string_literal: true

    # TextComponent - ViewComponent implementation
    #
    # Displays text within a button group.
    # Uses ButtonGroupTextBehavior module for shared styling logic.
    #
    # Based on shadcn/ui ButtonGroup: https://ui.shadcn.com/docs/components/button-group
    #
    # @example Basic text
    #   <%= render UI::ButtonGroupComponent.new do %>
    #     <%= render UI::TextComponent.new { "Label" } %>
    #     <%= render UI::ButtonComponent.new(variant: :outline) { "Button" } %>
    #   <% end %>
    class UI::ButtonGroupTextComponent < ViewComponent::Base
      include UI::ButtonGroupTextBehavior

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
