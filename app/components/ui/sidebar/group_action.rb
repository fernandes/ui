# frozen_string_literal: true

module UI
  module Sidebar
    # GroupAction - Phlex implementation
    #
    # Action button within a sidebar group header.
    # Typically used for actions like "Add" or contextual menus.
    #
    # @example Basic usage
    #   render UI::Sidebar::GroupAction.new do
    #     render UI::Icon.new(name: "plus")
    #   end
    #
    # @example With asChild for custom trigger
    #   render UI::Sidebar::GroupAction.new(as_child: true) do |action_attrs|
    #     render UI::DropdownMenu::Trigger.new(**action_attrs) do
    #       render UI::Icon.new(name: "ellipsis")
    #     end
    #   end
    class GroupAction < Phlex::HTML
      include UI::Sidebar::GroupActionBehavior

      def initialize(as_child: false, classes: "", **attributes)
        @as_child = as_child
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        if @as_child
          yield sidebar_group_action_html_attributes.deep_merge(@attributes)
        else
          all_attributes = sidebar_group_action_html_attributes

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
