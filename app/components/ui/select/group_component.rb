# frozen_string_literal: true

module UI
  module Select
    # GroupComponent - ViewComponent implementation
    #
    # Container for grouping select items with a label.
    #
    # @example Basic usage
    #   <%= render UI::Select::GroupComponent.new do %>
    #     <%= render UI::Select::LabelComponent.new { "North America" } %>
    #     <%= render UI::Select::ItemComponent.new(value: "america/new_york") { "Eastern Time" } %>
    #     <%= render UI::Select::ItemComponent.new(value: "america/chicago") { "Central Time" } %>
    #   <% end %>
    class GroupComponent < ViewComponent::Base
      include UI::SelectGroupBehavior

      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag :div, content, **select_group_html_attributes.deep_merge(@attributes)
      end
    end
  end
end
