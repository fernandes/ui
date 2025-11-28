# frozen_string_literal: true

    # RadioItem - Phlex implementation
    #
    # A menu item with radio functionality.
    #
    # @example Basic usage
    #   render UI::RadioItem.new(value: "option1", checked: true) { "Option 1" }
    class UI::MenubarRadioItem < Phlex::HTML
      include UI::MenubarRadioItemBehavior

      # @param value [String] Value for this radio item
      # @param checked [Boolean] Initial checked state
      # @param disabled [Boolean] Disable the item
      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(value: nil, checked: false, disabled: false, classes: "", **attributes)
        @value = value
        @checked = checked
        @disabled = disabled
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        div(**menubar_radio_item_html_attributes.deep_merge(@attributes)) do
          # Radio indicator container
          span(class: "absolute left-2 flex size-3.5 items-center justify-center") do
            if @checked
              render_radio_icon
            end
          end
          yield if block_given?
        end
      end

      private

      def render_radio_icon
        svg(
          xmlns: "http://www.w3.org/2000/svg",
          width: "24",
          height: "24",
          viewBox: "0 0 24 24",
          fill: "currentColor",
          stroke: "currentColor",
          stroke_width: "2",
          stroke_linecap: "round",
          stroke_linejoin: "round",
          class: "size-2",
          data: { state: "checked" }
        ) do |svg|
          svg.circle(cx: "12", cy: "12", r: "10")
        end
      end
    end
