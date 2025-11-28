# frozen_string_literal: true

    # RadioGroup - Phlex implementation
    #
    # Container for radio items providing semantic grouping.
    # Uses DropdownMenuRadioGroupBehavior concern for shared styling logic.
    #
    # @example Radio group
    #   render UI::RadioGroup.new do
    #     render UI::RadioItem.new(value: "top", checked: true) { "Top" }
    #     render UI::RadioItem.new(value: "bottom") { "Bottom" }
    #   end
    class UI::DropdownMenuRadioGroup < Phlex::HTML
      include UI::DropdownMenuRadioGroupBehavior

      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        div(**dropdown_menu_radio_group_html_attributes.deep_merge(@attributes)) do
          yield if block_given?
        end
      end
    end
