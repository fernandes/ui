# frozen_string_literal: true

    # InputGroupComponent - ViewComponent implementation
    #
    # A wrapper component for grouping inputs with addons, buttons, and text.
    # Uses InputGroupBehavior concern for shared styling logic.
    #
    # @example Basic usage
    #   <%= render UI::InputGroupComponent.new do %>
    #     <%= render UI::InputGroupInputComponent.new(placeholder: "Enter text") %>
    #   <% end %>
    #
    # @example With addons
    #   <%= render UI::InputGroupComponent.new do %>
    #     <%= render UI::InputGroupAddonComponent.new(align: "inline-start") do %>
    #       @
    #     <% end %>
    #     <%= render UI::InputGroupInputComponent.new(placeholder: "username") %>
    #   <% end %>
    class UI::InputGroupComponent < ViewComponent::Base
      include UI::InputGroupBehavior

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
