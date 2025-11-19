# frozen_string_literal: true

module UI
  module DropdownMenu
    # SubTrigger - Phlex implementation
    #
    # Item that opens a submenu on hover.
    # Uses DropdownMenuSubTriggerBehavior concern for shared styling logic.
    #
    # @example Submenu trigger
    #   render UI::DropdownMenu::SubTrigger.new { "More Options" }
    class SubTrigger < Phlex::HTML
      include UI::DropdownMenu::DropdownMenuSubTriggerBehavior

      # @param inset [Boolean] Whether to add left padding for alignment
      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(inset: false, classes: "", **attributes)
        @inset = inset
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        div(**dropdown_menu_sub_trigger_html_attributes.deep_merge(@attributes)) do
          yield if block_given?
          render_chevron_icon
        end
      end

      private

      def render_chevron_icon
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
          class: "ml-auto lucide lucide-chevron-right"
        ) do |s|
          s.path(d: "m9 18 6-6-6-6")
        end
      end
    end
  end
end
