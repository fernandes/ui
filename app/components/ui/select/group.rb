# frozen_string_literal: true

module UI
  module Select
    # Select Group - Phlex implementation
    #
    # Container for grouping select items with a label.
    # Supports asChild pattern for composition.
    #
    # @example Basic usage
    #   render UI::Select::Group.new do
    #     render UI::Select::Label.new { "North America" }
    #     render UI::Select::Item.new(value: "america/new_york") { "Eastern Time" }
    #     render UI::Select::Item.new(value: "america/chicago") { "Central Time" }
    #   end
    class Group < Phlex::HTML
      include UI::SelectGroupBehavior
      include UI::Shared::AsChildBehavior

      # @param as_child [Boolean] When true, yields attributes to block instead of rendering div
      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(as_child: false, classes: "", **attributes)
        @as_child = as_child
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        group_attrs = select_group_html_attributes.deep_merge(@attributes)

        if @as_child
          # asChild mode: yield attributes to block
          yield(group_attrs) if block_given?
        else
          # Default mode: render as div
          div(**group_attrs, &block)
        end
      end
    end
  end
end
