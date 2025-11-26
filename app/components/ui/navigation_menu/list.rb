# frozen_string_literal: true

module UI
  module NavigationMenu
    # List - Phlex implementation
    #
    # Container for navigation menu items.
    #
    # @example Basic usage
    #   render UI::NavigationMenu::List.new do
    #     render UI::NavigationMenu::Item.new do
    #       render UI::NavigationMenu::Trigger.new { "Menu" }
    #     end
    #   end
    class List < Phlex::HTML
      include UI::NavigationMenu::ListBehavior

      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        ul(**navigation_menu_list_html_attributes.deep_merge(@attributes)) do
          yield if block_given?
        end
      end
    end
  end
end
