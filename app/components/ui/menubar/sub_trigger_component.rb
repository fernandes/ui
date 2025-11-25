# frozen_string_literal: true

module UI
  module Menubar
    # SubTriggerComponent - ViewComponent implementation
    #
    # Menu item that opens a submenu.
    #
    # @example Basic usage
    #   render UI::Menubar::SubTriggerComponent.new { "Share" }
    class SubTriggerComponent < ViewComponent::Base
      include UI::Menubar::MenubarSubTriggerBehavior

      def initialize(inset: false, disabled: false, classes: "", **attributes)
        @inset = inset
        @disabled = disabled
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag :div, **menubar_sub_trigger_html_attributes.deep_merge(@attributes) do
          safe_join([content, render_chevron_icon])
        end
      end

      private

      def render_chevron_icon
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
          class: "ml-auto size-4"
        ) do
          helpers.tag.path(d: "m9 18 6-6-6-6")
        end.html_safe
      end
    end
  end
end
