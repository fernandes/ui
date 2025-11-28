# frozen_string_literal: true

    # Tooltip - Phlex implementation
    #
    # Root container for tooltip. Manages tooltip state via Stimulus controller.
    #
    # @example Basic usage
    #   render UI::Tooltip.new do
    #     render UI::Trigger.new { "Hover me" }
    #     render UI::Content.new { "Tooltip text" }
    #   end
    #
    # @example With asChild trigger
    #   render UI::Tooltip.new do
    #     render UI::Trigger.new(as_child: true) do |attrs|
    #       render UI::Button.new(**attrs) { "Hover" }
    #     end
    #     render UI::Content.new { "Tooltip text" }
    #   end
    class UI::Tooltip < Phlex::HTML
      include UI::TooltipBehavior

      # @param attributes [Hash] Additional HTML attributes
      def initialize(**attributes)
        @attributes = attributes
      end

      def view_template(&block)
        div(**tooltip_html_attributes.deep_merge(@attributes), &block)
      end
    end
