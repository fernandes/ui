# frozen_string_literal: true

module UI
  module Kbd
    # Group - Phlex implementation
    #
    # Groups multiple keyboard keys together with consistent spacing.
    # Useful for representing keyboard combinations like "Ctrl + B".
    # Uses KbdGroupBehavior concern for shared styling logic.
    #
    # @example Basic usage
    #   render UI::Kbd::Group.new do
    #     render UI::Kbd::Kbd.new { "Ctrl" }
    #     plain "+"
    #     render UI::Kbd::Kbd.new { "B" }
    #   end
    class Group < Phlex::HTML
      include UI::KbdGroupBehavior

      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        kbd(**kbd_group_html_attributes) do
          yield if block_given?
        end
      end
    end
  end
end
