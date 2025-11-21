# frozen_string_literal: true

module UI
  module ContextMenu
    # RadioGroupComponent - ViewComponent implementation
    class RadioGroupComponent < ViewComponent::Base
      include UI::ContextMenu::ContextMenuRadioGroupBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def call
        attrs = context_menu_radio_group_html_attributes

        content_tag :div, **attrs.merge(@attributes) do
          content
        end
      end
    end
  end
end
