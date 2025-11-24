# frozen_string_literal: true

module UI
  module Field
    # FieldTitleComponent - ViewComponent implementation
    #
    # Title with label styling inside FieldContent.
    # Uses FieldTitleBehavior concern for shared styling logic.
    #
    # @example With block
    #   <%= render UI::Field::FieldTitleComponent.new do %>
    #     Section Title
    #   <% end %>
    class FieldTitleComponent < ViewComponent::Base
      include UI::FieldTitleBehavior

      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag :div, **field_title_html_attributes do
          content
        end
      end
    end
  end
end
