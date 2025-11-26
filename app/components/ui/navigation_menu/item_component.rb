# frozen_string_literal: true

module UI
  module NavigationMenu
    # ItemComponent - ViewComponent implementation
    #
    # Wrapper for individual navigation menu item.
    class ItemComponent < ViewComponent::Base
      include UI::NavigationMenu::ItemBehavior

      # @param value [String] Optional value for controlled state
      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(value: nil, classes: "", **attributes)
        @value = value
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag :li, **navigation_menu_item_html_attributes.deep_merge(@attributes) do
          content
        end
      end
    end
  end
end
