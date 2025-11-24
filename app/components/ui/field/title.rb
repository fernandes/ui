# frozen_string_literal: true

module UI
  module Field
    # Title - Phlex implementation
    #
    # Title with label styling inside FieldContent.
    # Uses FieldTitleBehavior concern for shared styling logic.
    #
    # @example Basic usage
    #   render UI::Field::Title.new { "Section Title" }
    class Title < Phlex::HTML
      include UI::FieldTitleBehavior

      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        div(**field_title_html_attributes) do
          yield if block_given?
        end
      end
    end
  end
end
