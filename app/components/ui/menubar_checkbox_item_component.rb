# frozen_string_literal: true

    # CheckboxItemComponent - ViewComponent implementation
    #
    # A toggleable checkbox menu item.
    #
    # @example Basic usage
    #   render UI::CheckboxItemComponent.new(checked: true) { "Show Toolbar" }
    class UI::MenubarCheckboxItemComponent < ViewComponent::Base
      include UI::MenubarCheckboxItemBehavior

      def initialize(checked: false, disabled: false, classes: "", **attributes)
        @checked = checked
        @disabled = disabled
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag :div, **menubar_checkbox_item_html_attributes.deep_merge(@attributes) do
          render_check_icon + content_tag(:span, content)
        end
      end

      private

      def render_check_icon
        content_tag :span, class: "absolute left-2 flex size-3.5 items-center justify-center" do
          if @checked
            helpers.tag.svg(
              xmlns: "http://www.w3.org/2000/svg",
              width: "24",
              height: "24",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              "stroke-width": "2",
              "stroke-linecap": "round",
              "stroke-linejoin": "round",
              class: "size-4"
            ) do
              helpers.tag.path(d: "M20 6 9 17l-5-5")
            end
          end
        end.html_safe
      end
    end
