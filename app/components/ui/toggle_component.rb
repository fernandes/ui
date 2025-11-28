# frozen_string_literal: true

    # ToggleComponent - ViewComponent implementation
    #
    # A two-state button that can be either on or off.
    # Uses ToggleBehavior module for shared styling logic.
    #
    # @example Basic usage
    #   <%= render UI::ToggleComponent.new do %>
    #     Toggle
    #   <% end %>
    #
    # @example With variant and size
    #   <%= render UI::ToggleComponent.new(variant: "outline", size: "lg", pressed: true) do %>
    #     Bookmarked
    #   <% end %>
    #
    # @example Disabled state
    #   <%= render UI::ToggleComponent.new(disabled: true) do %>
    #     Disabled
    #   <% end %>
    class UI::ToggleComponent < ViewComponent::Base
      include UI::ToggleBehavior

      # @param variant [String] Visual style variant (default, outline)
      # @param size [String] Size variant (default, sm, lg)
      # @param type [String] Button type attribute (button, submit, reset)
      # @param pressed [Boolean] Whether the toggle is pressed/active
      # @param disabled [Boolean] Whether the toggle is disabled
      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(variant: "default", size: "default", type: "button", pressed: false, disabled: false, classes: "", **attributes)
        @variant = variant
        @size = size
        @type = type
        @pressed = pressed
        @disabled = disabled
        @classes = classes
        @attributes = attributes
      end

      def call
        attrs = toggle_html_attributes
        attrs[:data] = attrs[:data].merge(@attributes.fetch(:data, {}))

        content_tag :button, content, **attrs.merge(@attributes.except(:data))
      end
    end
