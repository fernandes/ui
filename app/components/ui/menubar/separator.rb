# frozen_string_literal: true

module UI
  module Menubar
    # Separator - Phlex implementation
    #
    # Visual divider between menu items.
    #
    # @example Basic usage
    #   render UI::Menubar::Separator.new
    class Separator < Phlex::HTML
      include UI::Menubar::MenubarSeparatorBehavior

      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template
        div(**menubar_separator_html_attributes.deep_merge(@attributes))
      end
    end
  end
end
