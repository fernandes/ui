# frozen_string_literal: true

module UI
  module Popover
    # ContentComponent - ViewComponent implementation
    #
    # The floating content panel.
    # Uses PopoverContentBehavior concern for shared styling logic.
    #
    # @example Basic usage
    #   <%= render UI::Popover::ContentComponent.new do %>
    #     Popover content here
    #   <% end %>
    #
    # @example With custom styling
    #   <%= render UI::Popover::ContentComponent.new(classes: "w-80 p-6") do %>
    #     Content
    #   <% end %>
    class ContentComponent < ViewComponent::Base
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
        content_attrs = popover_content_html_attributes

        # Merge data attributes properly
        if @attributes[:data]
          content_attrs[:data] = content_attrs[:data].merge(@attributes[:data])
        end

        content_tag :div, **content_attrs.deep_merge(@attributes.except(:data)) do
          content
        end
      end
    end
  end
end
