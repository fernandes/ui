# frozen_string_literal: true

module UI
  module DropdownMenu
    # DropdownMenuComponent - ViewComponent implementation
    #
    # Container for dropdown menus with Stimulus controller for interactivity.
    # Uses DropdownMenuBehavior concern for shared styling logic.
    class DropdownMenuComponent < ViewComponent::Base
      include UI::DropdownMenu::DropdownMenuBehavior

      def initialize(placement: "bottom-start", offset: 4, flip: true, classes: "", **attributes)
        @placement = placement
        @offset = offset
        @flip = flip
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag :div, **dropdown_menu_html_attributes.merge(@attributes.except(:data)) do
          content
        end
      end
    end
  end
end
