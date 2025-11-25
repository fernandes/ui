# frozen_string_literal: true

module UI
  module Menubar
    # Trigger - Phlex implementation
    #
    # Button that toggles the menu content open/closed.
    #
    # @example Basic usage
    #   render UI::Menubar::Trigger.new(first: true) { "File" }
    class Trigger < Phlex::HTML
      include UI::Menubar::MenubarTriggerBehavior

      # @param first [Boolean] Whether this is the first trigger (gets tabindex=0)
      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(first: false, classes: "", **attributes)
        @first = first
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        button(**menubar_trigger_html_attributes.deep_merge(@attributes)) do
          yield if block_given?
        end
      end
    end
  end
end
