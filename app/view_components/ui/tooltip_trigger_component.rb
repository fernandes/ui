# frozen_string_literal: true

    # TriggerComponent - ViewComponent implementation
    #
    # The interactive element that shows/hides the tooltip on hover/focus.
    # Supports asChild pattern for composition with other components.
    class UI::TooltipTriggerComponent < ViewComponent::Base
      include UI::TooltipTriggerBehavior

      # @param as_child [Boolean] If true, yields attributes to block instead of rendering button
      # @param attributes [Hash] Additional HTML attributes
      def initialize(as_child: false, **attributes)
        @as_child = as_child
        @attributes = attributes
      end

      def call
        trigger_attrs = tooltip_trigger_html_attributes.merge(@attributes.except(:data))

        # Default mode: render as button with proper styling
        content_tag :button, **trigger_attrs do
          content
        end
      end
    end
