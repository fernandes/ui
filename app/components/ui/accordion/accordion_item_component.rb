# frozen_string_literal: true

module UI
  module Accordion
    # Accordion Item component (ViewComponent)
    # Individual collapsible item within an accordion
    #
    # @example Basic usage
    #   <%= render UI::Accordion::AccordionItemComponent.new(value: "item-1") do %>
    #     <%= render UI::Accordion::AccordionTriggerComponent.new { "Trigger text" } %>
    #     <%= render UI::Accordion::AccordionContentComponent.new { "Content text" } %>
    #   <% end %>
    #
    # @example Start open
    #   <%= render UI::Accordion::AccordionItemComponent.new(value: "item-1", initial_open: true) do %>
    #     <!-- Item will be open by default -->
    #   <% end %>
    class AccordionItemComponent < ViewComponent::Base
      include UI::Accordion::AccordionItemBehavior

      # Expose item_value and initial_open to child components via content_tag_options
      attr_reader :value, :initial_open

      # @param value [String] unique identifier for this item
      # @param initial_open [Boolean] whether this item starts open
      # @param classes [String] additional CSS classes
      # @param attributes [Hash] additional HTML attributes
      def initialize(value: "", initial_open: false, classes: "", attributes: {})
        @value = value
        @initial_open = initial_open
        @classes = classes
        @attributes = attributes
      end

      def call
        # Store context for child components (trigger and content)
        # ViewComponent renders slots in parent context, so we use helpers method
        content_tag :div, content, **item_html_attributes
      end

      # Helper method to expose item context to child components
      def item_context
        { item_value: @value, initial_open: @initial_open }
      end
    end
  end
end
