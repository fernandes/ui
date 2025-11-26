# frozen_string_literal: true

module UI
  module Resizable
    # ResizablePanelGroup container component (Phlex)
    # Wraps resizable panels with Stimulus controller
    #
    # @example Basic horizontal layout
    #   render UI::Resizable::PanelGroup.new(direction: "horizontal") do
    #     render UI::Resizable::Panel.new(default_size: 50) do
    #       "Left panel content"
    #     end
    #     render UI::Resizable::Handle.new
    #     render UI::Resizable::Panel.new(default_size: 50) do
    #       "Right panel content"
    #     end
    #   end
    #
    # @example Vertical layout
    #   render UI::Resizable::PanelGroup.new(direction: "vertical") do
    #     render UI::Resizable::Panel.new(default_size: 30) { "Top" }
    #     render UI::Resizable::Handle.new
    #     render UI::Resizable::Panel.new(default_size: 70) { "Bottom" }
    #   end
    class PanelGroup < Phlex::HTML
      include UI::Resizable::PanelGroupBehavior

      # @param direction [String] "horizontal" or "vertical" layout
      # @param keyboard_resize_by [Integer] percentage to resize by on keyboard input
      # @param classes [String] additional CSS classes
      # @param attributes [Hash] additional HTML attributes
      def initialize(direction: "horizontal", keyboard_resize_by: 10, classes: "", attributes: {}, **)
        @direction = direction
        @keyboard_resize_by = keyboard_resize_by
        @classes = classes
        @attributes = attributes
        super()
      end

      def view_template(&block)
        div(**panel_group_html_attributes, &block)
      end
    end
  end
end
