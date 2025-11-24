# frozen_string_literal: true

module UI
  module Field
    # FieldDescriptionComponent - ViewComponent implementation
    #
    # Helper text for form fields.
    # Uses FieldDescriptionBehavior concern for shared styling logic.
    #
    # @example With block
    #   <%= render UI::Field::FieldDescriptionComponent.new do %>
    #     Helper text
    #   <% end %>
    class FieldDescriptionComponent < ViewComponent::Base
      include UI::FieldDescriptionBehavior

      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag :p, **field_description_html_attributes do
          content
        end
      end
    end
  end
end
