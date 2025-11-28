# frozen_string_literal: true

    # TriggerComponent - ViewComponent implementation
    #
    # Element that triggers the hover card on hover.
    # Uses HoverCardTriggerBehavior for shared styling logic.
    # Supports asChild pattern for composition.
    #
    # @example Basic usage
    #   <%= render UI::TriggerComponent.new { "Hover me" } %>
    #
    # @example With asChild - compose with Button (yields attributes)
    #   <%= render UI::TriggerComponent.new(as_child: true) do |trigger_attrs| %>
    #     <%= render UI::ButtonComponent.new(**trigger_attrs, variant: :link) { "@nextjs" } %>
    #   <% end %>
    #
    # @example With custom tag
    #   <%= render UI::TriggerComponent.new(tag: :a, href: "#") { "Link" } %>
    class UI::HoverCardTriggerComponent < ViewComponent::Base
      include UI::HoverCardTriggerBehavior

      # @param as_child [Boolean] If true, yields attributes to block instead of wrapping
      # @param tag [Symbol] HTML tag to use for the trigger (default: :span)
      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(as_child: false, tag: :span, classes: "", **attributes)
        @as_child = as_child
        @tag = tag
        @classes = classes
        @attributes = attributes
      end

      # Override render_in to pass trigger_attrs to block when as_child is true
      def render_in(view_context, &block)
        @view_context = view_context

        if @as_child && block
          # asChild pattern: call the block with trigger attributes
          # Block should use these attrs on the actual trigger element
          view_context.capture(trigger_html_attributes, &block)
        else
          super
        end
      end

      def call
        # Default: render with full styling and tabindex for keyboard focus
        attrs = trigger_html_attributes.merge(@attributes)
        attrs[:tabindex] ||= "0" if @tag == :span || @tag == :div
        content_tag @tag, **attrs do
          content
        end
      end
    end
