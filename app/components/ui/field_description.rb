# frozen_string_literal: true

    # Description - Phlex implementation
    #
    # Helper text for form fields.
    # Uses FieldDescriptionBehavior concern for shared styling logic.
    #
    # @example Basic usage
    #   render UI::Description.new { "Helper text" }
    class UI::FieldDescription < Phlex::HTML
      include UI::FieldDescriptionBehavior

      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        p(**field_description_html_attributes) do
          yield if block_given?
        end
      end
    end
