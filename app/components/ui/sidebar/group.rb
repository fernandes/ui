# frozen_string_literal: true

module UI
  module Sidebar
    # Group - Phlex implementation
    #
    # Container for grouping related sidebar items.
    # Can be made collapsible using UI::Collapsible.
    #
    # @example Basic usage (non-collapsible)
    #   render UI::Sidebar::Group.new do
    #     render UI::Sidebar::GroupLabel.new { "Section" }
    #     render UI::Sidebar::GroupContent.new do
    #       render UI::Sidebar::Menu.new { ... }
    #     end
    #   end
    #
    # @example Collapsible group (using UI::Collapsible)
    #   render UI::Collapsible::Collapsible.new(open: true, as_child: true) do |collapsible_attrs|
    #     render UI::Sidebar::Group.new(**collapsible_attrs) do
    #       render UI::Collapsible::Trigger.new(as_child: true) do |trigger_attrs|
    #         render UI::Sidebar::GroupLabel.new(**trigger_attrs) { "Section" }
    #       end
    #       render UI::Collapsible::Content.new do
    #         render UI::Sidebar::GroupContent.new do
    #           render UI::Sidebar::Menu.new { ... }
    #         end
    #       end
    #     end
    #   end
    class Group < Phlex::HTML
      include UI::Sidebar::GroupBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        all_attributes = sidebar_group_html_attributes

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
