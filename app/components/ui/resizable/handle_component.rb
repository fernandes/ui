# frozen_string_literal: true

module UI
  module Resizable
    # ResizableHandle component (ViewComponent)
    # Draggable handle between resizable panels
    #
    # @example Basic handle
    #   <%= render UI::Resizable::HandleComponent.new %>
    #
    # @example Handle with visible grip icon
    #   <%= render UI::Resizable::HandleComponent.new(with_handle: true) %>
    class HandleComponent < ViewComponent::Base
      include UI::Resizable::HandleBehavior

      # @param with_handle [Boolean] show visible grip icon
      # @param classes [String] additional CSS classes
      # @param attributes [Hash] additional HTML attributes
      def initialize(with_handle: false, classes: "", attributes: {})
        @with_handle = with_handle
        @classes = classes
        @attributes = attributes
      end

      def call
        attrs = handle_html_attributes
        attrs[:data] = attrs[:data].merge(@attributes.fetch(:data, {}))

        content_tag :div, **attrs.merge(@attributes.except(:data)) do
          if @with_handle
            content_tag :div, class: grip_container_classes do
              helpers.lucide_icon("grip-vertical", class: "h-2.5 w-2.5")
            end
          end
        end
      end
    end
  end
end
