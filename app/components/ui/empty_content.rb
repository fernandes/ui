# frozen_string_literal: true

    # EmptyContent - Phlex implementation
    #
    # Displays the content of the empty state such as a button, input or a link.
    #
    # @example
    #   render UI::EmptyContent.new do
    #     render UI::Button.new { "Create Item" }
    #   end
    class UI::EmptyContent < Phlex::HTML
      include UI::EmptyContentBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        div(**empty_content_html_attributes.merge(@attributes), &block)
      end
    end
