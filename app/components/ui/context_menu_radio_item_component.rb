# frozen_string_literal: true

    # RadioItemComponent - ViewComponent implementation
    class UI::ContextMenuRadioItemComponent < ViewComponent::Base
      include UI::ContextMenuRadioItemBehavior

      def initialize(checked: false, classes: "", **attributes)
        @checked = checked
        @classes = classes
        @attributes = attributes
      end

      def call
        attrs = context_menu_radio_item_html_attributes
        attrs[:data] = attrs[:data].merge(@attributes.fetch(:data, {}))

        content_tag :div, **attrs.merge(@attributes.except(:data)) do
          safe_join([
            content_tag(:span, class: "pointer-events-none absolute left-2 flex size-3.5 items-center justify-center") do
              render_circle_icon if @checked
            end,
            content
          ])
        end
      end

      private

      def render_circle_icon
        content_tag(:svg,
          xmlns: "http://www.w3.org/2000/svg",
          width: "24",
          height: "24",
          viewBox: "0 0 24 24",
          fill: "currentColor",
          stroke: "currentColor",
          "stroke-width": "2",
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          class: "size-2"
        ) do
          content_tag(:circle, nil, cx: "12", cy: "12", r: "10")
        end
      end
    end
