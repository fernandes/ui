# frozen_string_literal: true

    class UI::RadioButton < Phlex::HTML
      include UI::RadioButtonBehavior

      def initialize(
        name: nil,
        id: nil,
        value: nil,
        checked: false,
        disabled: false,
        required: false,
        classes: "",
        **attributes
      )
        @name = name
        @id = id
        @value = value
        @checked = checked
        @disabled = disabled
        @required = required
        @classes = classes
        @attributes = attributes
      end

      def view_template
        div(class: "relative inline-flex items-center justify-center") do
          input(**radio_button_html_attributes)
          indicator_icon
        end
      end

      private

      def indicator_icon
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
          class: "fill-primary absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity",
          data: { slot: "radio-group-indicator" }
        ) { |s| s.circle(cx: "12", cy: "12", r: "10") }
      end
    end
