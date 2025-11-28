# frozen_string_literal: true

    # Accordion Item component (Phlex)
    # Individual collapsible item within an accordion
    #
    # @example Basic usage
    #   render UI::Item.new(value: "item-1") do
    #     render UI::Trigger.new { "Trigger text" }
    #     render UI::Content.new { "Content text" }
    #   end
    #
    # @example Start open
    #   render UI::Item.new(value: "item-1", initial_open: true) do
    #     # Item will be open by default
    #   end
    class UI::AccordionItem < Phlex::HTML
      include UI::AccordionItemBehavior

      attr_reader :value, :initial_open

      # @param value [String] unique identifier for this item
      # @param initial_open [Boolean] whether this item starts open
      # @param classes [String] additional CSS classes
      # @param attributes [Hash] additional HTML attributes
      def initialize(value: "", initial_open: false, classes: "", attributes: {}, **)
        @value = value
        @initial_open = initial_open
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        div(**item_html_attributes) do
          # Pass context to child components by rendering the block
          # Child components will receive item_value and initial_open through helpers
          instance_exec(&block) if block
        end
      end

      # Helper methods that child components can call to get parent context
      def item_value_context
        @value
      end

      def initial_open_context
        @initial_open
      end
    end
