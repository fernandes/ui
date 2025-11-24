# frozen_string_literal: true

module UI
  module Field
    # FieldComponent - ViewComponent implementation
    #
    # Core wrapper for a single form field with support for different orientations.
    # Uses FieldBehavior concern for shared styling logic.
    #
    # @example Basic usage
    #   <%= render UI::Field::FieldComponent.new do %>
    #     Field content here
    #   <% end %>
    #
    # @example With orientation
    #   <%= render UI::Field::FieldComponent.new(orientation: "horizontal") do %>
    #     Field content
    #   <% end %>
    #
    # @example With validation state
    #   <%= render UI::Field::FieldComponent.new(data_invalid: true) do %>
    #     Field content
    #   <% end %>
    class FieldComponent < ViewComponent::Base
      include UI::FieldBehavior

      # @param orientation [String] Layout orientation: "vertical", "horizontal", or "responsive"
      # @param data_invalid [Boolean] Whether field is in invalid state
      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(orientation: "vertical", data_invalid: nil, classes: "", **attributes)
        @orientation = orientation
        @data_invalid = data_invalid
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag :div, **field_html_attributes do
          content
        end
      end
    end
  end
end
