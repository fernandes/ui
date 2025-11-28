# frozen_string_literal: true

    # ItemComponent - ViewComponent implementation
    class UI::DropdownMenuItemComponent < ViewComponent::Base
      include UI::DropdownMenuItemBehavior

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
