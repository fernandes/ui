# frozen_string_literal: true

module UI
  module Menubar
    # Shortcut - Phlex implementation
    #
    # Displays keyboard shortcut hint for menu items.
    #
    # @example Basic usage
    #   render UI::Menubar::Item.new do
    #     plain "New Tab"
    #     render UI::Menubar::Shortcut.new { "Ctrl+T" }
    #   end
    class Shortcut < Phlex::HTML
      include UI::Menubar::MenubarShortcutBehavior

      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        span(**menubar_shortcut_html_attributes.deep_merge(@attributes)) do
          yield if block_given?
        end
      end
    end
  end
end
