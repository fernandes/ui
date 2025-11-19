# frozen_string_literal: true

module UI
  module Accordion
    # Accordion Trigger component (Phlex)
    # Button that toggles accordion item open/closed
    #
    # @example Basic usage
    #   render UI::Accordion::Trigger.new(item_value: "item-1") do
    #     "Click to toggle"
    #   end
    class Trigger < Phlex::HTML
      include UI::Accordion::AccordionTriggerBehavior

      # @param item_value [String] value from parent Item
      # @param initial_open [Boolean] initial state from parent Item
      # @param classes [String] additional CSS classes
      # @param attributes [Hash] additional HTML attributes
      def initialize(item_value: nil, initial_open: false, classes: "", attributes: {}, **)
        @item_value = item_value
        @initial_open = initial_open
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        h3(class: "flex", "data-orientation": @orientation || "vertical", "data-state": trigger_state) do
          button(**trigger_html_attributes) do
            yield if block_given?
            # Render caret icon using Phlex DSL
            render_caret_icon
          end
        end
      end

      private

      def render_caret_icon
        svg(
          xmlns: "http://www.w3.org/2000/svg",
          width: "24",
          height: "24",
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          "stroke-width": "2",
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          class: "text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-[var(--duration-accordion)]"
        ) do |s|
          s.polyline(points: "6 9 12 15 18 9")
        end
      end
    end
  end
end
