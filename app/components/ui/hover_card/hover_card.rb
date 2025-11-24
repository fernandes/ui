# frozen_string_literal: true

module UI
  module HoverCard
    # HoverCard - Phlex implementation
    #
    # Container for hover card trigger and content.
    # Uses HoverCardBehavior for shared styling logic.
    #
    # @example Basic usage
    #   render UI::HoverCard::HoverCard.new do
    #     render UI::HoverCard::Trigger.new { "Hover me" }
    #     render UI::HoverCard::Content.new { "Hover card content" }
    #   end
    class HoverCard < Phlex::HTML
      include UI::HoverCard::HoverCardBehavior

      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        div(**hover_card_html_attributes, &block)
      end
    end
  end
end
