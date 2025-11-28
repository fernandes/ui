# frozen_string_literal: true

    # ResizableHandle component (ViewComponent)
    # Draggable handle between resizable panels
    #
    # @example Basic handle
    #   <%= render UI::HandleComponent.new %>
    #
    # @example Handle with visible grip icon
    #   <%= render UI::HandleComponent.new(with_handle: true) %>
    class UI::ResizableHandleComponent < ViewComponent::Base
      include UI::ResizableHandleBehavior

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
