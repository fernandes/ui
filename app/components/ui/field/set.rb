# frozen_string_literal: true

module UI
  module Field
    # Set - Phlex implementation
    #
    # Semantic fieldset container for grouped fields.
    # Uses FieldSetBehavior concern for shared styling logic.
    #
    # @example Basic usage
    #   render UI::Field::Set.new do
    #     render UI::Field::Legend.new { "Contact Information" }
    #   end
    class Set < Phlex::HTML
      include UI::FieldSetBehavior

      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        fieldset(**field_set_html_attributes) do
          yield if block_given?
        end
      end
    end
  end
end
