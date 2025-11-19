# frozen_string_literal: true

module UI
  module DropdownMenu
    # SeparatorComponent - ViewComponent implementation
    class SeparatorComponent < ViewComponent::Base
      include UI::DropdownMenu::DropdownMenuSeparatorBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag :div, "", **dropdown_menu_separator_html_attributes.merge(@attributes.except(:data))
      end
    end
  end
end
