# frozen_string_literal: true

module UI
  module Select
    # ScrollUpButtonComponent - ViewComponent implementation
    #
    # Button that appears when content is scrollable upward.
    # Automatically hidden when at top of list.
    #
    # @example Default usage (no customization needed)
    #   <%= render UI::Select::ScrollUpButtonComponent.new %>
    class ScrollUpButtonComponent < ViewComponent::Base
      include UI::SelectScrollUpButtonBehavior

      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag :div, **select_scroll_up_button_html_attributes.deep_merge(@attributes) do
          content_tag :svg, nil,
            class: "size-4",
            xmlns: "http://www.w3.org/2000/svg",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            stroke_width: "2",
            stroke_linecap: "round",
            stroke_linejoin: "round" do
              content_tag :path, nil, d: "m18 15-6-6-6 6"
            end
        end
      end
    end
  end
end
