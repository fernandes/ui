# frozen_string_literal: true

module UI
  module InputGroup
    # Text - Phlex implementation
    #
    # A text element for displaying static text within input groups.
    # Uses InputGroupTextBehavior concern for shared styling logic.
    #
    # @example Simple text
    #   render UI::InputGroup::Text.new { "@" }
    #
    # @example With icon
    #   render UI::InputGroup::Text.new do
    #     unsafe_raw '<svg class="size-4">...</svg>'
    #     plain "Username"
    #   end
    class Text < Phlex::HTML
      include UI::InputGroupTextBehavior

      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        span(**input_group_text_html_attributes) do
          yield if block_given?
        end
      end
    end
  end
end
