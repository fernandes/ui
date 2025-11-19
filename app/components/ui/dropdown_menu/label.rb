# frozen_string_literal: true

module UI
  module DropdownMenu
    # Label - Phlex implementation
    #
    # Label for menu sections to organize items.
    # Uses DropdownMenuLabelBehavior concern for shared styling logic.
    #
    # @example Basic label
    #   render UI::DropdownMenu::Label.new { "My Account" }
    class Label < Phlex::HTML
      include UI::DropdownMenu::DropdownMenuLabelBehavior

      # @param inset [Boolean] Whether to add left padding for alignment
      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(inset: false, classes: "", **attributes)
        @inset = inset
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        div(**dropdown_menu_label_html_attributes.deep_merge(@attributes)) do
          yield if block_given?
        end
      end
    end
  end
end
