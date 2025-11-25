# frozen_string_literal: true

module UI
  module Menubar
    # Content - Phlex implementation
    #
    # Container for menu items that appears when trigger is activated.
    #
    # @example Basic usage
    #   render UI::Menubar::Content.new do
    #     render UI::Menubar::Item.new { "New Tab" }
    #     render UI::Menubar::Separator.new
    #     render UI::Menubar::Item.new { "Exit" }
    #   end
    class Content < Phlex::HTML
      include UI::Menubar::MenubarContentBehavior

      # @param align [String] Alignment relative to trigger (start, center, end)
      # @param side [String] Side relative to trigger (top, bottom, left, right)
      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(align: "start", side: "bottom", classes: "", **attributes)
        @align = align
        @side = side
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        div(**menubar_content_html_attributes.deep_merge(@attributes)) do
          yield if block_given?
        end
      end
    end
  end
end
