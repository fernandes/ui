# frozen_string_literal: true

module UI
  module HoverCard
    # HoverCardComponent - ViewComponent implementation
    #
    # Container for hover card trigger and content.
    # Uses HoverCardBehavior for shared styling logic.
    #
    # @example Basic usage
    #   <%= render UI::HoverCard::HoverCardComponent.new do %>
    #     <%= render UI::HoverCard::TriggerComponent.new { "Hover me" } %>
    #     <%= render UI::HoverCard::ContentComponent.new { "Content" } %>
    #   <% end %>
    class HoverCardComponent < ViewComponent::Base
      include UI::HoverCard::HoverCardBehavior

      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def call
        attrs = hover_card_html_attributes

        content_tag :div, **attrs.merge(@attributes) do
          content
        end
      end
    end
  end
end
