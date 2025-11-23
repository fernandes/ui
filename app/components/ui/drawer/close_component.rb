# frozen_string_literal: true

module UI
  module Drawer
    # Drawer close component (ViewComponent)
    # Close button for drawer
    #
    # @example
    #   <%= render UI::Drawer::CloseComponent.new { "Cancel" } %>
    #
    # @example With custom variant
    #   <%= render UI::Drawer::CloseComponent.new(variant: :ghost) { "Close" } %>
    class CloseComponent < ViewComponent::Base
      include UI::Drawer::DrawerCloseBehavior

      # @param variant [Symbol] button variant (:default, :outline, :ghost, etc.)
      # @param size [Symbol] button size (:default, :sm, :lg, etc.)
      # @param classes [String] additional CSS classes
      # @param attributes [Hash] additional HTML attributes
      def initialize(variant: :outline, size: :default, classes: "", attributes: {})
        @variant = variant
        @size = size
        @classes = classes
        @attributes = attributes
      end

      def call
        render UI::Button::ButtonComponent.new(
          variant: @variant,
          size: @size,
          classes: @classes,
          **drawer_close_data_attributes.merge(@attributes)
        ) do
          content
        end
      end
    end
  end
end
