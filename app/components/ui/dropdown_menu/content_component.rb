# frozen_string_literal: true

module UI
  module DropdownMenu
    # ContentComponent - ViewComponent implementation
    class ContentComponent < ViewComponent::Base
      include UI::DropdownMenu::DropdownMenuContentBehavior

      def initialize(side_offset: 4, classes: "", **attributes)
        @side_offset = side_offset
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag :div, **dropdown_menu_content_html_attributes.merge(@attributes.except(:data)) do
          content
        end
      end
    end
  end
end
