# frozen_string_literal: true

    # RadioItemComponent - ViewComponent implementation
    class UI::DropdownMenuRadioItemComponent < ViewComponent::Base
      include UI::DropdownMenuRadioItemBehavior

      def initialize(value:, checked: false, disabled: false, classes: "", **attributes)
        @value = value
        @checked = checked
        @disabled = disabled
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag :div, **dropdown_menu_radio_item_html_attributes.merge(@attributes.except(:data)) do
          safe_join([
            radio_indicator_html,
            content
          ])
        end
      end

      private

      def radio_indicator_html
        content_tag :span, class: "pointer-events-none absolute left-2 flex size-3.5 items-center justify-center" do
          if @checked
            content_tag :span, data: { state: "checked" } do
              content_tag :svg, xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round", class: "lucide lucide-circle size-2 fill-current" do
                tag.circle(cx: "12", cy: "12", r: "10")
              end
            end
          end
        end
      end
    end
