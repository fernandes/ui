# frozen_string_literal: true

module UI
  module HoverCard
    # ContentComponent - ViewComponent implementation
    #
    # The content that appears on hover.
    # Uses HoverCardContentBehavior for shared styling logic.
    #
    # @example Basic usage
    #   <%= render UI::HoverCard::ContentComponent.new { "Hover card content" } %>
    #
    # @example With custom alignment
    #   <%= render UI::HoverCard::ContentComponent.new(align: "start", side_offset: 8) do %>
    #     Content here
    #   <% end %>
    class ContentComponent < ViewComponent::Base
      include UI::HoverCard::HoverCardContentBehavior

      # @param align [String] Alignment of the content ("start", "center", "end")
      # @param side_offset [Integer] Distance in pixels from the trigger
      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(align: "center", side_offset: 4, classes: "", **attributes)
        @align = align
        @side_offset = side_offset
        @classes = classes
        @attributes = attributes
      end

      def call
        attrs = content_html_attributes

        content_tag :div, **attrs.merge(@attributes) do
          content
        end
      end
    end
  end
end
