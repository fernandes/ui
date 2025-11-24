# frozen_string_literal: true

module UI
  module HoverCard
    # TriggerComponent - ViewComponent implementation
    #
    # Element that triggers the hover card on hover.
    # Uses HoverCardTriggerBehavior for shared styling logic.
    # Supports asChild pattern for composition.
    #
    # @example Basic usage
    #   <%= render UI::HoverCard::TriggerComponent.new { "Hover me" } %>
    #
    # @example With asChild - compose with Button
    #   <%= render UI::HoverCard::TriggerComponent.new(as_child: true) do |attrs| %>
    #     <%= render UI::Button::ButtonComponent.new(**attrs, variant: :link) { "@nextjs" } %>
    #   <% end %>
    #
    # @example With custom tag
    #   <%= render UI::HoverCard::TriggerComponent.new(tag: :a, href: "#") { "Link" } %>
    class TriggerComponent < ViewComponent::Base
      include UI::HoverCard::HoverCardTriggerBehavior

      # @param as_child [Boolean] If true, wraps content with data attributes
      # @param tag [Symbol] HTML tag to use for the trigger (default: :span)
      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(as_child: false, tag: :span, classes: "", **attributes)
        @as_child = as_child
        @tag = tag
        @classes = classes
        @attributes = attributes
      end

      def call
        if @as_child
          # Wrap content with data attributes
          content_tag @tag, **trigger_html_attributes do
            content
          end
        else
          # Default: render with full styling
          content_tag @tag, **trigger_html_attributes.merge(@attributes) do
            content
          end
        end
      end
    end
  end
end
