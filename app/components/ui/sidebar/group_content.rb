# frozen_string_literal: true

module UI
  module Sidebar
    # GroupContent - Phlex implementation
    #
    # Container for content within a sidebar group.
    # Typically wraps a SidebarMenu.
    #
    # @example Basic usage
    #   render UI::Sidebar::GroupContent.new do
    #     render UI::Sidebar::Menu.new { ... }
    #   end
    #
    # @example Inside a collapsible group
    #   render UI::Collapsible::Content.new do
    #     render UI::Sidebar::GroupContent.new do
    #       render UI::Sidebar::Menu.new { ... }
    #     end
    #   end
    class GroupContent < Phlex::HTML
      include UI::Sidebar::GroupContentBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        all_attributes = sidebar_group_content_html_attributes

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
