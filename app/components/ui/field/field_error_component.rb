# frozen_string_literal: true

module UI
  module Field
    # FieldErrorComponent - ViewComponent implementation
    #
    # Error message display for form fields with accessibility support.
    # Uses FieldErrorBehavior concern for shared styling logic.
    #
    # @example With single error
    #   <%= render UI::Field::FieldErrorComponent.new(errors: ["Email is required"]) %>
    #
    # @example With multiple errors
    #   <%= render UI::Field::FieldErrorComponent.new(errors: ["Email is required", "Email is invalid"]) %>
    #
    # @example With block
    #   <%= render UI::Field::FieldErrorComponent.new do %>
    #     Error message
    #   <% end %>
    class FieldErrorComponent < ViewComponent::Base
      include UI::FieldErrorBehavior

      # @param errors [Array] Array of error messages
      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(errors: nil, classes: "", **attributes)
        @errors = errors
        @classes = classes
        @attributes = attributes
      end

      def call
        return unless has_errors? || content?

        if has_errors?
          render_errors
        else
          render_content
        end
      end

      private

      attr_reader :classes, :attributes

      def render_errors
        if single_error?
          content_tag :p, **field_error_html_attributes do
            error_message(@errors.first)
          end
        else
          content_tag :ul, **field_error_html_attributes do
            safe_join(@errors.map { |error|
              content_tag :li, error_message(error)
            })
          end
        end
      end

      def render_content
        content_tag :p, **field_error_html_attributes do
          content
        end
      end
    end
  end
end
