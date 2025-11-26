# frozen_string_literal: true

module UI
  module NavigationMenu
    # Item - Phlex implementation
    #
    # Wrapper for individual navigation menu item.
    #
    # @example Basic usage with trigger and content
    #   render UI::NavigationMenu::Item.new do
    #     render UI::NavigationMenu::Trigger.new { "Products" }
    #     render UI::NavigationMenu::Content.new do
    #       # Links here
    #     end
    #   end
    #
    # @example Direct link without dropdown
    #   render UI::NavigationMenu::Item.new do
    #     render UI::NavigationMenu::Link.new(href: "/about") { "About" }
    #   end
    class Item < Phlex::HTML
      include UI::NavigationMenu::ItemBehavior

      # @param value [String] Optional value for controlled state
      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(value: nil, classes: "", **attributes)
        @value = value
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        li(**navigation_menu_item_html_attributes.deep_merge(@attributes)) do
          yield if block_given?
        end
      end
    end
  end
end
