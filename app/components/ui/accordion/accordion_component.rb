# frozen_string_literal: true

module UI
  module Accordion
    # Accordion container component (ViewComponent)
    # Wraps collapsible accordion items with Stimulus controller
    #
    # @example Basic usage
    #   <%= render UI::Accordion::AccordionComponent.new do %>
    #     <%= render UI::Accordion::AccordionItemComponent.new(value: "item-1") do %>
    #       <%= render UI::Accordion::AccordionTriggerComponent.new { "Is it accessible?" } %>
    #       <%= render UI::Accordion::AccordionContentComponent.new { "Yes. It adheres to the WAI-ARIA design pattern." } %>
    #     <% end %>
    #   <% end %>
    #
    # @example Multiple items open
    #   <%= render UI::Accordion::AccordionComponent.new(type: "multiple") do %>
    #     <!-- Multiple items can be open at once -->
    #   <% end %>
    class AccordionComponent < ViewComponent::Base
      include UI::Accordion::AccordionBehavior

      # @param type [String] "single" (only one item open at a time) or "multiple" (multiple items can be open)
      # @param collapsible [Boolean] whether the open item can be collapsed in "single" mode
      # @param classes [String] additional CSS classes
      # @param attributes [Hash] additional HTML attributes
      def initialize(type: "single", collapsible: false, classes: "", attributes: {})
        @type = type
        @collapsible = collapsible
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag :div, content, **accordion_html_attributes
      end
    end
  end
end
