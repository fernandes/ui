# frozen_string_literal: true

module UI
  module Sidebar
    # MenuBadge - Phlex implementation
    #
    # Badge that appears at the end of a menu button.
    # Used to display counts or status indicators.
    #
    # @example Basic usage
    #   render UI::Sidebar::MenuItem.new do
    #     render UI::Sidebar::MenuButton.new do
    #       render UI::Icon.new(name: "inbox")
    #       span { "Inbox" }
    #     end
    #     render UI::Sidebar::MenuBadge.new { "24" }
    #   end
    class MenuBadge < Phlex::HTML
      include UI::Sidebar::MenuBadgeBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        all_attributes = sidebar_menu_badge_html_attributes

        if @attributes.key?(:class)
          merged_class = TailwindMerge::Merger.new.merge([
            all_attributes[:class],
            @attributes[:class]
          ].compact.join(" "))
          all_attributes = all_attributes.merge(class: merged_class)
        end

        all_attributes = all_attributes.deep_merge(@attributes.except(:class))

        div(**all_attributes, &block)
      end
    end
  end
end
