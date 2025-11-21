# frozen_string_literal: true

module UI
  module ContextMenu
    # ShortcutComponent - ViewComponent implementation
    class ShortcutComponent < ViewComponent::Base
      include UI::ContextMenu::ContextMenuShortcutBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def call
        attrs = context_menu_shortcut_html_attributes

        content_tag :span, **attrs.merge(@attributes) do
          content
        end
      end
    end
  end
end
