# frozen_string_literal: true

module UI
  module Popover
    # PopoverContentComponent - ViewComponent implementation
    #
    # The floating content panel.
    # Uses PopoverContentBehavior concern for shared styling logic.
    #
    # @example Basic usage
    #   <%= render UI::Popover::PopoverContentComponent.new do %>
    #     Popover content here
    #   <% end %>
    #
    # @example With custom styling
    #   <%= render UI::Popover::PopoverContentComponent.new(classes: "w-80 p-6") do %>
    #     Content
    #   <% end %>
    class PopoverContentComponent < ViewComponent::Base
      include PopoverContentBehavior

      # @param side [String] Side of the trigger to show the content ("top", "bottom", "left", "right")
      # @param align [String] Alignment relative to the trigger ("start", "center", "end")
      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(side: "bottom", align: "center", classes: "", **attributes)
        @side = side
        @align = align
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag :div, **popover_content_html_attributes do
          content
        end
      end
    end
  end
end
