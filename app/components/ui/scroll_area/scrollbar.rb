# frozen_string_literal: true

module UI
  module ScrollArea
    # Scrollbar - Phlex implementation
    #
    # Custom scrollbar track that contains the draggable thumb.
    #
    # @example Vertical scrollbar (default)
    #   render UI::ScrollArea::Scrollbar.new(orientation: "vertical")
    #
    # @example Horizontal scrollbar
    #   render UI::ScrollArea::Scrollbar.new(orientation: "horizontal")
    class Scrollbar < Phlex::HTML
      include UI::ScrollAreaScrollbarBehavior
      include UI::Shared::AsChildBehavior

      # @param as_child [Boolean] When true, yields attributes to block instead of rendering div
      # @param orientation [String] "vertical" or "horizontal"
      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(as_child: false, orientation: "vertical", classes: "", **attributes)
        @as_child = as_child
        @orientation = orientation
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        scrollbar_attrs = scroll_area_scrollbar_html_attributes.deep_merge(@attributes)

        # Add Stimulus target
        scrollbar_attrs[:data] ||= {}
        scrollbar_attrs[:data][:"ui--scroll-area-target"] = "scrollbar"

        if @as_child && block_given?
          # asChild mode: yield attributes to block, but also render thumb if not provided
          yield(scrollbar_attrs)
          render UI::ScrollArea::Thumb.new unless block_given?
        else
          # Default mode: render as div with thumb
          div(**scrollbar_attrs) do
            render UI::ScrollArea::Thumb.new
          end
        end
      end
    end
  end
end
