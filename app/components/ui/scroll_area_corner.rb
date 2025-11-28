# frozen_string_literal: true

    # Corner - Phlex implementation
    #
    # Intersection element between vertical and horizontal scrollbars.
    #
    # @example Default usage (automatically used by ScrollArea)
    #   render UI::Corner.new
    class UI::ScrollAreaCorner < Phlex::HTML
      include UI::ScrollAreaCornerBehavior
      include UI::SharedAsChildBehavior

      # @param as_child [Boolean] When true, yields attributes to block instead of rendering div
      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(as_child: false, classes: "", **attributes)
        @as_child = as_child
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        corner_attrs = scroll_area_corner_html_attributes.deep_merge(@attributes)

        if @as_child && block_given?
          # asChild mode: yield attributes to block
          yield(corner_attrs)
        else
          # Default mode: render as empty div
          div(**corner_attrs)
        end
      end
    end
