# frozen_string_literal: true

module UI
  module InputGroup
    # InputGroupTextComponent - ViewComponent implementation
    #
    # A text element for displaying static text within input groups.
    # Uses InputGroupTextBehavior concern for shared styling logic.
    #
    # @example Simple text
    #   <%= render UI::InputGroup::InputGroupTextComponent.new do %>
    #     @
    #   <% end %>
    #
    # @example With icon
    #   <%= render UI::InputGroup::InputGroupTextComponent.new do %>
    #     <svg class="size-4">...</svg>
    #     Username
    #   <% end %>
    class InputGroupTextComponent < ViewComponent::Base
      include InputGroupTextBehavior

      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag :span, **input_group_text_html_attributes do
          content
        end
      end
    end
  end
end
