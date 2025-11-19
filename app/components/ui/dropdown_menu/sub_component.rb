# frozen_string_literal: true

module UI
  module DropdownMenu
    # SubComponent - ViewComponent implementation
    class SubComponent < ViewComponent::Base
      include UI::DropdownMenu::DropdownMenuSubBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag :div, **dropdown_menu_sub_html_attributes.merge(@attributes.except(:data)) do
          content
        end
      end
    end
  end
end
