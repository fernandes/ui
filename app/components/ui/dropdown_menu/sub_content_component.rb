# frozen_string_literal: true

module UI
  module DropdownMenu
    # SubContentComponent - ViewComponent implementation
    class SubContentComponent < ViewComponent::Base
      include UI::DropdownMenu::DropdownMenuSubContentBehavior

      def initialize(side: "right", align: "start", classes: "", **attributes)
        @side = side
        @align = align
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag :div, **dropdown_menu_sub_content_html_attributes.merge(@attributes.except(:data)) do
          content
        end
      end
    end
  end
end
