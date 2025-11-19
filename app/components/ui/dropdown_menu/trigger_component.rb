# frozen_string_literal: true

module UI
  module DropdownMenu
    # TriggerComponent - ViewComponent implementation
    class TriggerComponent < ViewComponent::Base
      include UI::DropdownMenu::DropdownMenuTriggerBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag :div, **dropdown_menu_trigger_html_attributes.merge(@attributes.except(:data)) do
          content
        end
      end
    end
  end
end
