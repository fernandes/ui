# frozen_string_literal: true

    # CheckboxItemComponent - ViewComponent implementation
    class UI::DropdownMenuCheckboxItemComponent < ViewComponent::Base
      include UI::DropdownMenuCheckboxItemBehavior

      def initialize(checked: false, disabled: false, classes: "", **attributes)
        @checked = checked
        @disabled = disabled
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag :div, **dropdown_menu_checkbox_item_html_attributes.merge(@attributes.except(:data)) do
          safe_join([
            checkbox_indicator_html,
            content
          ])
        end
      end

      private

      def checkbox_indicator_html
        content_tag :span, class: "pointer-events-none absolute left-2 flex size-3.5 items-center justify-center" do
          if @checked
            content_tag :span, data: { state: "checked" } do
              content_tag :svg, xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round", class: "lucide lucide-check size-4" do
                tag.path(d: "M20 6 9 17l-5-5")
              end
            end
          end
        end
      end
    end
