# frozen_string_literal: true

module UI
  module Checkbox
    class Checkbox < Phlex::HTML
      include UI::CheckboxBehavior

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
          input(**checkbox_html_attributes)
          checkmark_icon
        end
      end

      private

      def checkmark_icon
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
          class: "size-3.5 pointer-events-none absolute text-primary-foreground opacity-0 peer-checked:opacity-100 transition-opacity"
        ) { |s| s.path(d: "M20 6 9 17l-5-5") }
      end
    end
  end
end
