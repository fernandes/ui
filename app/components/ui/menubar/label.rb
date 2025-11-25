# frozen_string_literal: true

module UI
  module Menubar
    # Label - Phlex implementation
    #
    # Non-interactive label/header for menu sections.
    #
    # @example Basic usage
    #   render UI::Menubar::Label.new { "Account" }
    #
    # @example With inset
    #   render UI::Menubar::Label.new(inset: true) { "Settings" }
    class Label < Phlex::HTML
      include UI::Menubar::MenubarLabelBehavior

      # @param inset [Boolean] Add left padding to align with checkbox/radio items
      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(inset: false, classes: "", **attributes)
        @inset = inset
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        div(**menubar_label_html_attributes.deep_merge(@attributes)) do
          yield if block_given?
        end
      end
    end
  end
end
