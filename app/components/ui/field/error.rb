# frozen_string_literal: true

module UI
  module Field
    # Error - Phlex implementation
    #
    # Error message display for form fields with accessibility support.
    # Uses FieldErrorBehavior concern for shared styling logic.
    #
    # @example With single error
    #   render UI::Field::Error.new(errors: ["Email is required"])
    #
    # @example With multiple errors
    #   render UI::Field::Error.new(errors: ["Email is required", "Email is invalid"])
    #
    # @example With block
    #   render UI::Field::Error.new { "Error message" }
    class Error < Phlex::HTML
      include UI::FieldErrorBehavior

      # @param errors [Array] Array of error messages
      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(errors: nil, classes: "", **attributes)
        @errors = errors
        @classes = classes
        @attributes = attributes
        @block_given = false
      end

      def view_template(&block)
        @block_given = block_given?
        return unless has_errors? || @block_given

        if has_errors?
          render_errors
        else
          render_content(&block)
        end
      end

      private

      def render_errors
        if single_error?
          p(**field_error_html_attributes) do
            plain error_message(@errors.first)
          end
        else
          ul(**field_error_html_attributes) do
            @errors.each do |error|
              li { plain error_message(error) }
            end
          end
        end
      end

      def render_content(&block)
        p(**field_error_html_attributes) do
          yield if block_given?
        end
      end
    end
  end
end
