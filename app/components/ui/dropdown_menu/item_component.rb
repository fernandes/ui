# frozen_string_literal: true

module UI
  module DropdownMenu
    # ItemComponent - ViewComponent implementation
    class ItemComponent < ViewComponent::Base
      include UI::DropdownMenu::DropdownMenuItemBehavior

      def initialize(href: nil, inset: false, variant: "default", classes: "", **attributes)
        @href = href
        @inset = inset
        @variant = variant
        @classes = classes
        @attributes = attributes
      end

      def call
        tag_name = @href ? :a : :div
        content_tag tag_name, **dropdown_menu_item_html_attributes.merge(@attributes.except(:data)) do
          content
        end
      end
    end
  end
end
