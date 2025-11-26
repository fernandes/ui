# frozen_string_literal: true

module UI
  module Sidebar
    # Trigger - Phlex implementation
    #
    # Button that toggles the sidebar open/closed.
    #
    # @example Basic usage
    #   render UI::Sidebar::Trigger.new
    class Trigger < Phlex::HTML
      include UI::Sidebar::TriggerBehavior
      include Phlex::Rails::Helpers::ContentTag

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template
        all_attributes = sidebar_trigger_html_attributes.merge(type: "button")

        if @attributes.key?(:class)
          merged_class = TailwindMerge::Merger.new.merge([
            all_attributes[:class],
            @attributes[:class]
          ].compact.join(" "))
          all_attributes = all_attributes.merge(class: merged_class)
        end

        all_attributes = all_attributes.deep_merge(@attributes.except(:class))

        button(**all_attributes) do
          render_icon
          span(class: "sr-only") { "Toggle Sidebar" }
        end
      end

      private

      def render_icon
        # PanelLeft icon from Lucide
        svg(
          xmlns: "http://www.w3.org/2000/svg",
          width: "16",
          height: "16",
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          stroke_width: "2",
          stroke_linecap: "round",
          stroke_linejoin: "round",
          class: "size-4"
        ) do |s|
          s.rect(width: "18", height: "18", x: "3", y: "3", rx: "2")
          s.path(d: "M9 3v18")
        end
      end
    end
  end
end
