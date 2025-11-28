# frozen_string_literal: true

    # RadioItem - Phlex implementation
    #
    # A menu item with radio button functionality.
    # Uses ContextMenuRadioItemBehavior concern for shared styling logic.
    #
    # @example Basic usage
    #   render UI::RadioItem.new(checked: true) { "Option 1" }
    class UI::ContextMenuRadioItem < Phlex::HTML
      include UI::ContextMenuRadioItemBehavior

      # @param checked [Boolean] Whether the radio is checked
      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(checked: false, classes: "", **attributes)
        @checked = checked
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        div(**context_menu_radio_item_html_attributes.deep_merge(@attributes)) do
          span(class: "pointer-events-none absolute left-2 flex size-3.5 items-center justify-center") do
            if @checked
              render_circle_icon
            end
          end
          yield if block_given?
        end
      end

      private

      def render_circle_icon
        svg(
          xmlns: "http://www.w3.org/2000/svg",
          width: "24",
          height: "24",
          viewbox: "0 0 24 24",
          fill: "currentColor",
          stroke: "currentColor",
          stroke_width: "2",
          stroke_linecap: "round",
          stroke_linejoin: "round",
          class: "size-2"
        ) do |s|
          s.circle(cx: "12", cy: "12", r: "10")
        end
      end
    end
