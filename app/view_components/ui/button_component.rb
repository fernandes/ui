# frozen_string_literal: true

    # ButtonComponent - ViewComponent implementation
    #
    # A versatile button component with multiple variants and sizes.
    # Uses ButtonBehavior module for shared styling logic.
    #
    # @example Basic usage
    #   <%= render UI::ButtonComponent.new do %>
    #     Click me
    #   <% end %>
    #
    # @example With variant and size
    #   <%= render UI::ButtonComponent.new(variant: "destructive", size: "lg") do %>
    #     Delete
    #   <% end %>
    #
    # @example Disabled state
    #   <%= render UI::ButtonComponent.new(disabled: true) do %>
    #     Disabled
    #   <% end %>
    class UI::ButtonComponent < ViewComponent::Base
      include UI::ButtonBehavior

      # @param variant [String] Visual style variant (default, destructive, outline, secondary, ghost, link)
      # @param size [String] Size variant (default, sm, lg, icon, icon-sm, icon-lg)
      # @param type [String] Button type attribute (button, submit, reset)
      # @param disabled [Boolean] Whether the button is disabled
      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(variant: "default", size: "default", type: "button", disabled: false, classes: "", **attributes)
        @variant = variant
        @size = size
        @type = type
        @disabled = disabled
        @classes = classes
        @attributes = attributes
      end

      def call
        render_button { content }
      end
    end
