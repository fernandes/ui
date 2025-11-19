# frozen_string_literal: true

module UI
  module DropdownMenu
    # LabelComponent - ViewComponent implementation
    class LabelComponent < ViewComponent::Base
      include UI::DropdownMenu::DropdownMenuLabelBehavior

      def initialize(inset: false, classes: "", **attributes)
        @inset = inset
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag :div, **dropdown_menu_label_html_attributes.merge(@attributes.except(:data)) do
          content
        end
      end
    end
  end
end
