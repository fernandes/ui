# frozen_string_literal: true

module UI
  module Sidebar
    # MenuAction - Phlex implementation
    #
    # Action button within a sidebar menu item, appears on hover/focus.
    # Typically used for dropdown menus or quick actions.
    #
    # @example Basic usage
    #   render UI::Sidebar::MenuAction.new do
    #     render UI::Icon.new(name: "ellipsis")
    #   end
    #
    # @example Show on hover
    #   render UI::Sidebar::MenuAction.new(show_on_hover: true) do
    #     render UI::Icon.new(name: "ellipsis")
    #   end
    #
    # @example With dropdown using asChild
    #   render UI::Sidebar::MenuAction.new(as_child: true) do |action_attrs|
    #     render UI::DropdownMenu::DropdownMenu.new do
    #       render UI::DropdownMenu::Trigger.new(as_child: true) do |trigger_attrs|
    #         button(**action_attrs.deep_merge(trigger_attrs)) do
    #           render UI::Icon.new(name: "ellipsis")
    #         end
    #       end
    #       render UI::DropdownMenu::Content.new do
    #         # ... menu items
    #       end
    #     end
    #   end
    class MenuAction < Phlex::HTML
      include UI::Sidebar::MenuActionBehavior

      def initialize(show_on_hover: false, as_child: false, classes: "", **attributes)
        @show_on_hover = show_on_hover
        @as_child = as_child
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        if @as_child
          yield sidebar_menu_action_html_attributes.deep_merge(@attributes)
        else
          all_attributes = sidebar_menu_action_html_attributes

          if @attributes.key?(:class)
            merged_class = TailwindMerge::Merger.new.merge([
              all_attributes[:class],
              @attributes[:class]
            ].compact.join(" "))
            all_attributes = all_attributes.merge(class: merged_class)
          end

          all_attributes = all_attributes.deep_merge(@attributes.except(:class))

          button(**all_attributes, &block)
        end
      end
    end
  end
end
