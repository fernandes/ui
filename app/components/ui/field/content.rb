# frozen_string_literal: true

module UI
  module Field
    # Content - Phlex implementation
    #
    # Flex column that groups control and descriptions.
    # Uses FieldContentBehavior concern for shared styling logic.
    #
    # @example Basic usage
    #   render UI::Field::Content.new { "Content here" }
    class Content < Phlex::HTML
      include UI::FieldContentBehavior

      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        div(**field_content_html_attributes) do
          yield if block_given?
        end
      end
    end
  end
end
