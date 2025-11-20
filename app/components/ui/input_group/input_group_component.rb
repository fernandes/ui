# frozen_string_literal: true

module UI
  module InputGroup
    # InputGroupComponent - ViewComponent implementation
    #
    # A wrapper component for grouping inputs with addons, buttons, and text.
    # Uses InputGroupBehavior concern for shared styling logic.
    #
    # @example Basic usage
    #   <%= render UI::InputGroup::InputGroupComponent.new do %>
    #     <%= render UI::InputGroup::InputGroupInputComponent.new(placeholder: "Enter text") %>
    #   <% end %>
    #
    # @example With addons
    #   <%= render UI::InputGroup::InputGroupComponent.new do %>
    #     <%= render UI::InputGroup::InputGroupAddonComponent.new(align: "inline-start") do %>
    #       @
    #     <% end %>
    #     <%= render UI::InputGroup::InputGroupInputComponent.new(placeholder: "username") %>
    #   <% end %>
    class InputGroupComponent < ViewComponent::Base
      include InputGroupBehavior

      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag :div, **input_group_html_attributes do
          content
        end
      end
    end
  end
end
