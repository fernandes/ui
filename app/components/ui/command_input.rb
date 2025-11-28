# frozen_string_literal: true

    class UI::CommandInput < Phlex::HTML
      include UI::CommandInputBehavior

      def initialize(placeholder: "Type a command or search...", classes: "", **attributes)
        @placeholder = placeholder
        @classes = classes
        @attributes = attributes
      end

      def view_template
        div(class: command_input_wrapper_classes) do
          svg(
            class: "mr-2 h-4 w-4 shrink-0 opacity-50",
            xmlns: "http://www.w3.org/2000/svg",
            width: "24",
            height: "24",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            stroke_width: "2",
            stroke_linecap: "round",
            stroke_linejoin: "round"
          ) do |s|
            s.circle(cx: "11", cy: "11", r: "8")
            s.path(d: "m21 21-4.3-4.3")
          end
          input(**command_input_html_attributes.deep_merge(@attributes))
        end
      end
    end
