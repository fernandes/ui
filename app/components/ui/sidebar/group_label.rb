# frozen_string_literal: true

module UI
  module Sidebar
    # GroupLabel - Phlex implementation
    #
    # Label/header for a sidebar group.
    # Can be used with UI::Collapsible::Trigger for collapsible groups.
    #
    # @example Basic usage
    #   render UI::Sidebar::GroupLabel.new { "Section" }
    #
    # @example With asChild for collapsible trigger
    #   render UI::Collapsible::Trigger.new(as_child: true) do |trigger_attrs|
    #     render UI::Sidebar::GroupLabel.new(**trigger_attrs) do
    #       "Section"
    #       render UI::Icon.new(name: "chevron-right", class: "ml-auto transition-transform group-data-[state=open]:rotate-90")
    #     end
    #   end
    class GroupLabel < Phlex::HTML
      include UI::Sidebar::GroupLabelBehavior

      def initialize(as_child: false, classes: "", **attributes)
        @as_child = as_child
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        if @as_child
          yield sidebar_group_label_html_attributes.deep_merge(@attributes)
        else
          all_attributes = sidebar_group_label_html_attributes

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
end
