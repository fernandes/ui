# frozen_string_literal: true

    # ContentComponent - ViewComponent implementation
    #
    # The content that appears on hover.
    # Uses HoverCardContentBehavior for shared styling logic.
    #
    # @example Basic usage
    #   <%= render UI::ContentComponent.new { "Hover card content" } %>
    #
    # @example With custom alignment
    #   <%= render UI::ContentComponent.new(align: "start", side_offset: 8) do %>
    #     Content here
    #   <% end %>
    class UI::HoverCardContentComponent < ViewComponent::Base
      include UI::HoverCardContentBehavior

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
