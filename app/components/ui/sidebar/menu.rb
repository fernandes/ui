# frozen_string_literal: true

module UI
  module Sidebar
    # Menu - Phlex implementation
    #
    # List container for sidebar menu items.
    #
    # @example Basic usage
    #   render UI::Sidebar::Menu.new do
    #     render UI::Sidebar::MenuItem.new do
    #       render UI::Sidebar::MenuButton.new do
    #         render UI::Icon.new(name: "home")
    #         plain "Home"
    #       end
    #     end
    #   end
    class Menu < Phlex::HTML
      include UI::Sidebar::MenuBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        all_attributes = sidebar_menu_html_attributes

        if @attributes.key?(:class)
          merged_class = TailwindMerge::Merger.new.merge([
            all_attributes[:class],
            @attributes[:class]
          ].compact.join(" "))
          all_attributes = all_attributes.merge(class: merged_class)
        end

        all_attributes = all_attributes.deep_merge(@attributes.except(:class))

        ul(**all_attributes, &block)
      end
    end
  end
end
