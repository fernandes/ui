# frozen_string_literal: true

    # HoverCardComponent - ViewComponent implementation
    #
    # Container for hover card trigger and content.
    # Uses HoverCardBehavior for shared styling logic.
    #
    # @example Basic usage
    #   <%= render UI::HoverCardComponent.new do %>
    #     <%= render UI::TriggerComponent.new { "Hover me" } %>
    #     <%= render UI::ContentComponent.new { "Content" } %>
    #   <% end %>
    class UI::HoverCardComponent < ViewComponent::Base
      include UI::HoverCardBehavior

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
