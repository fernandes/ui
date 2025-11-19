# frozen_string_literal: true

module UI
  module DropdownMenu
    # ShortcutComponent - ViewComponent implementation
    class ShortcutComponent < ViewComponent::Base
      include UI::DropdownMenu::DropdownMenuShortcutBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag :span, **dropdown_menu_shortcut_html_attributes.merge(@attributes.except(:data)) do
          content
        end
      end
    end
  end
end
