# frozen_string_literal: true

module UI
  module Menubar
    # RadioGroup - Phlex implementation
    #
    # Container for radio items in the menu.
    #
    # @example Basic usage
    #   render UI::Menubar::RadioGroup.new(value: "option1") do
    #     render UI::Menubar::RadioItem.new(value: "option1", checked: true) { "Option 1" }
    #     render UI::Menubar::RadioItem.new(value: "option2") { "Option 2" }
    #   end
    class RadioGroup < Phlex::HTML
      include UI::Menubar::MenubarRadioGroupBehavior

      # @param value [String] Currently selected value
      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(value: nil, classes: "", **attributes)
        @value = value
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        div(**menubar_radio_group_html_attributes.deep_merge(@attributes)) do
          yield if block_given?
        end
      end
    end
  end
end
