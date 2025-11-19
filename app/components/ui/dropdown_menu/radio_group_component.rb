# frozen_string_literal: true

module UI
  module DropdownMenu
    # RadioGroupComponent - ViewComponent implementation
    class RadioGroupComponent < ViewComponent::Base
      include UI::DropdownMenu::DropdownMenuRadioGroupBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag :div, **dropdown_menu_radio_group_html_attributes.merge(@attributes.except(:data)) do
          content
        end
      end
    end
  end
end
