# frozen_string_literal: true

module UI
  module Menubar
    # SubContent - Phlex implementation
    #
    # Container for submenu items.
    #
    # @example Basic usage
    #   render UI::Menubar::SubContent.new do
    #     render UI::Menubar::Item.new { "Email" }
    #     render UI::Menubar::Item.new { "Message" }
    #   end
    class SubContent < Phlex::HTML
      include UI::Menubar::MenubarSubContentBehavior

      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        div(**menubar_sub_content_html_attributes.deep_merge(@attributes)) do
          yield if block_given?
        end
      end
    end
  end
end
