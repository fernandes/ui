# frozen_string_literal: true

module UI
  module ScrollArea
    # ThumbComponent - ViewComponent implementation
    #
    # Draggable scroll indicator inside the scrollbar.
    #
    # @example Default usage (automatically used by ScrollbarComponent)
    #   <%= render UI::ScrollArea::ThumbComponent.new %>
    class ThumbComponent < ViewComponent::Base
      include UI::ScrollAreaThumbBehavior

      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def call
        thumb_attrs = scroll_area_thumb_html_attributes.deep_merge(@attributes)

        # Add Stimulus target and action for drag
        thumb_attrs[:data] ||= {}
        thumb_attrs[:data][:"ui--scroll-area-target"] = "thumb"
        thumb_attrs[:data][:action] = "pointerdown->ui--scroll-area#startDrag"

        content_tag :div, nil, **thumb_attrs
      end
    end
  end
end
