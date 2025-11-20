# frozen_string_literal: true

module UI
  module Select
    # Select - Phlex implementation
    #
    # A custom select component with keyboard navigation, scrollable viewport, and form integration.
    # Root container that wraps trigger, content, and items.
    #
    # @example Basic usage
    #   render UI::Select::Select.new(value: "apple") do
    #     render UI::Select::Trigger.new(placeholder: "Select a fruit...")
    #     render UI::Select::Content.new do
    #       render UI::Select::Item.new(value: "apple") { "Apple" }
    #       render UI::Select::Item.new(value: "banana") { "Banana" }
    #     end
    #   end
    #
    # @example With groups
    #   render UI::Select::Select.new do
    #     render UI::Select::Trigger.new(placeholder: "Select timezone...")
    #     render UI::Select::Content.new do
    #       render UI::Select::Group.new do
    #         render UI::Select::Label.new { "North America" }
    #         render UI::Select::Item.new(value: "america/new_york") { "Eastern Time" }
    #       end
    #     end
    #   end
    class Select < Phlex::HTML
      include UI::SelectBehavior

      # @param value [String] Currently selected value
      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(value: nil, classes: "", **attributes)
        @value = value
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        div(**select_html_attributes.deep_merge(@attributes), &block)
      end
    end
  end
end
