# frozen_string_literal: true

module UI
  module HoverCard
    # Trigger - Phlex implementation
    #
    # Element that triggers the hover card on hover.
    # Uses HoverCardTriggerBehavior for shared styling logic.
    # Supports asChild pattern for composition.
    #
    # @example Basic usage
    #   render UI::HoverCard::Trigger.new { "Hover me" }
    #
    # @example With asChild - compose with Button
    #   render UI::HoverCard::Trigger.new(as_child: true) do |attrs|
    #     render UI::Button::Button.new(**attrs, variant: :link) { "@nextjs" }
    #   end
    #
    # @example With custom tag
    #   render UI::HoverCard::Trigger.new(tag: :a, href: "#") { "Link trigger" }
    class Trigger < Phlex::HTML
      include UI::HoverCard::HoverCardTriggerBehavior

      # @param as_child [Boolean] If true, yields attributes to block instead of rendering wrapper
      # @param tag [Symbol] HTML tag to use for the trigger (default: :span)
      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(as_child: false, tag: :span, classes: "", **attributes)
        @as_child = as_child
        @tag = tag
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        trigger_attrs = trigger_html_attributes

        if @as_child
          # Yield attributes to block - child must accept and apply them
          yield(trigger_attrs) if block_given?
        else
          # Add tabindex for keyboard focus on non-focusable elements
          trigger_attrs[:tabindex] ||= "0" if [:span, :div].include?(@tag)
          # Default: render as specified tag (span by default)
          public_send(@tag, **trigger_attrs, &block)
        end
      end
    end
  end
end
