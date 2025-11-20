# frozen_string_literal: true

module UI
  module Select
    # ItemComponent - ViewComponent implementation
    #
    # Individual selectable option in the dropdown.
    #
    # @example Basic usage
    #   <%= render UI::Select::ItemComponent.new(value: "apple") { "Apple" } %>
    #
    # @example Disabled item
    #   <%= render UI::Select::ItemComponent.new(value: "angular", disabled: true) { "Angular (Coming Soon)" } %>
    class ItemComponent < ViewComponent::Base
      include UI::SelectItemBehavior

      # @param value [String] Value of this option
      # @param disabled [Boolean] Whether the item is disabled
      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(value: nil, disabled: false, classes: "", **attributes)
        @value = value
        @disabled = disabled
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag :div, **select_item_html_attributes.deep_merge(@attributes) do
          safe_join([
            content_tag(:span, content, class: "flex-1"),
            content_tag(:svg,
              content_tag(:path, nil, d: "M20 6 9 17l-5-5"),
              data: { ui__select_target: "itemCheck" },
              class: "ml-auto size-4 opacity-0 transition-opacity",
              xmlns: "http://www.w3.org/2000/svg",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              stroke_width: "2",
              stroke_linecap: "round",
              stroke_linejoin: "round"
            )
          ])
        end
      end
    end
  end
end
