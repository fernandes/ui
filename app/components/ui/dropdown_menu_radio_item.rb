# frozen_string_literal: true

    # RadioItem - Phlex implementation
    #
    # Menu item with radio state for exclusive selection within a group.
    # Uses DropdownMenuRadioItemBehavior concern for shared styling logic.
    #
    # @example Radio item
    #   render UI::RadioItem.new(value: "top", checked: true) { "Top" }
    class UI::DropdownMenuRadioItem < Phlex::HTML
      include UI::DropdownMenuRadioItemBehavior

      # @param value [String] Value of the radio item
      # @param checked [Boolean] Whether item is checked
      # @param disabled [Boolean] Whether item is disabled
      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(value:, checked: false, disabled: false, classes: "", **attributes)
        @value = value
        @checked = checked
        @disabled = disabled
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        div(**dropdown_menu_radio_item_html_attributes.deep_merge(@attributes)) do
          render_radio_indicator
          yield if block_given?
        end
      end

      private

      def render_radio_indicator
        span(class: "pointer-events-none absolute left-2 flex size-3.5 items-center justify-center") do
          if @checked
            span(data: { state: "checked" }) do
              svg(
                xmlns: "http://www.w3.org/2000/svg",
                width: "24",
                height: "24",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                stroke_width: "2",
                stroke_linecap: "round",
                stroke_linejoin: "round",
                class: "lucide lucide-circle size-2 fill-current"
              ) do |s|
                s.circle(cx: "12", cy: "12", r: "10")
              end
            end
          end
        end
      end
    end
