# frozen_string_literal: true

module UI
  module ContextMenu
    # ContextMenuComponent - ViewComponent implementation
    class ContextMenuComponent < ViewComponent::Base
      include UI::ContextMenu::ContextMenuBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def call
        attrs = context_menu_html_attributes
        attrs[:data] = attrs[:data].merge(@attributes.fetch(:data, {}))

        content_tag :div, **attrs.merge(@attributes.except(:data)) do
          content
        end
      end
    end
  end
end
