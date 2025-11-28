# frozen_string_literal: true

    # Trigger - Phlex implementation
    #
    # The interactive element that shows/hides the tooltip on hover/focus.
    # Supports asChild pattern for composition with other components.
    #
    # @example Default trigger (renders as button)
    #   render UI::Trigger.new { "Hover me" }
    #
    # @example With asChild - compose with Button
    #   render UI::Trigger.new(as_child: true) do |attrs|
    #     render UI::Button.new(**attrs, variant: :outline) { "Hover" }
    #   end
    #
    # @example With asChild - custom element
    #   render UI::Trigger.new(as_child: true) do |attrs|
    #     span(**attrs, class: "cursor-help") { "Help" }
    #   end
    class UI::TooltipTrigger < Phlex::HTML
      include UI::TooltipTriggerBehavior

      # @param as_child [Boolean] If true, yields attributes to block instead of rendering button
      # @param attributes [Hash] Additional HTML attributes
      def initialize(as_child: false, **attributes)
        @as_child = as_child
        @attributes = attributes
      end

      def view_template(&block)
        trigger_attrs = tooltip_trigger_html_attributes.deep_merge(@attributes)

        if @as_child
          # asChild mode: yield attributes to block
          # The caller is responsible for rendering an element with these attributes
          yield(trigger_attrs) if block_given?
        else
          # Default mode: render as button
          button(**trigger_attrs, &block)
        end
      end
    end
