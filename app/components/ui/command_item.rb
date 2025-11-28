# frozen_string_literal: true

    class UI::CommandItem < Phlex::HTML
      include UI::CommandItemBehavior

      def initialize(value: nil, disabled: false, classes: "", **attributes)
        @value = value
        @disabled = disabled
        @classes = classes
        @attributes = attributes
      end

      def view_template(&)
        div(**command_item_html_attributes.deep_merge(@attributes), &)
      end
    end
