# frozen_string_literal: true

module UI
  module NavigationMenu
    # Trigger - Phlex implementation
    #
    # Button that toggles the navigation menu content.
    # Includes an animated chevron icon.
    #
    # @example Basic usage
    #   render UI::NavigationMenu::Trigger.new { "Products" }
    #
    # @example First trigger (receives initial focus)
    #   render UI::NavigationMenu::Trigger.new(first: true) { "Home" }
    class Trigger < Phlex::HTML
      include UI::NavigationMenu::TriggerBehavior

      # @param first [Boolean] Whether this is the first trigger (gets tabindex=0)
      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(first: false, classes: "", **attributes)
        @first = first
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        button(**navigation_menu_trigger_html_attributes.deep_merge(@attributes)) do
          yield if block_given?
          render_chevron
        end
      end

      private

      def render_chevron
        svg(
          xmlns: "http://www.w3.org/2000/svg",
          width: "24",
          height: "24",
          viewbox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          stroke_width: "2",
          stroke_linecap: "round",
          stroke_linejoin: "round",
          class: navigation_menu_trigger_chevron_classes,
          aria_hidden: "true"
        ) do |svg|
          svg.path(d: "m6 9 6 6 6-6")
        end
      end
    end
  end
end
