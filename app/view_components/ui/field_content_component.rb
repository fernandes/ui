# frozen_string_literal: true

    # FieldContentComponent - ViewComponent implementation
    #
    # Flex column that groups control and descriptions.
    # Uses FieldContentBehavior concern for shared styling logic.
    #
    # @example Basic usage
    #   <%= render UI::FieldContentComponent.new do %>
    #     Content here
    #   <% end %>
    class UI::FieldContentComponent < ViewComponent::Base
      include UI::FieldContentBehavior

      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag :div, **field_content_html_attributes do
          content
        end
      end
    end
