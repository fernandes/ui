# frozen_string_literal: true

module UI
  module Menubar
    # RadioItemComponent - ViewComponent implementation
    #
    # A radio menu item (only one can be selected).
    #
    # @example Basic usage
    #   render UI::Menubar::RadioItemComponent.new(value: "light", checked: true) { "Light" }
    class RadioItemComponent < ViewComponent::Base
      include UI::Menubar::MenubarRadioItemBehavior

      def initialize(value: nil, checked: false, disabled: false, classes: "", **attributes)
        @value = value
        @checked = checked
        @disabled = disabled
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag :div, **menubar_radio_item_html_attributes.deep_merge(@attributes) do
          render_radio_icon + content_tag(:span, content)
        end
      end

      private

      def render_radio_icon
        content_tag :span, class: "absolute left-2 flex size-3.5 items-center justify-center" do
          if @checked
            helpers.tag.svg(
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
              helpers.tag.circle(cx: "12", cy: "12", r: "10")
            end
          end
        end.html_safe
      end
    end
  end
end
