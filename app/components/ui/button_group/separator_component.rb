# frozen_string_literal: true

module UI
  module ButtonGroup
    # SeparatorComponent - ViewComponent implementation
    #
    # Visually divides buttons within a button group.
    # Extends UI::Separator::SeparatorComponent with button group specific styling.
    #
    # Based on shadcn/ui ButtonGroup: https://ui.shadcn.com/docs/components/button-group
    #
    # @example Basic separator
    #   <%= render UI::ButtonGroup::ButtonGroupComponent.new do %>
    #     <%= render UI::Button::ButtonComponent.new(variant: :secondary) { "Copy" } %>
    #     <%= render UI::ButtonGroup::SeparatorComponent.new %>
    #     <%= render UI::Button::ButtonComponent.new(variant: :secondary) { "Paste" } %>
    #   <% end %>
    class SeparatorComponent < ViewComponent::Base
      include UI::Separator::SeparatorBehavior
      include UI::ButtonGroup::SeparatorBehavior

      # @param orientation [Symbol, String] Direction of the separator (:horizontal, :vertical)
      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(orientation: :vertical, decorative: true, classes: "", **attributes)
        @orientation = orientation
        @decorative = decorative
        @classes = classes
        @attributes = attributes
      end

      def call
        tag.div(**separator_html_attributes.deep_merge(@attributes))
      end
    end
  end
end
