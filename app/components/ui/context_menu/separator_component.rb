# frozen_string_literal: true

module UI
  module ContextMenu
    # SeparatorComponent - ViewComponent implementation
    class SeparatorComponent < ViewComponent::Base
      include UI::ContextMenu::ContextMenuSeparatorBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag :div, "", **context_menu_separator_html_attributes.merge(@attributes)
      end
    end
  end
end
