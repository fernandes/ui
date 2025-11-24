# frozen_string_literal: true

module UI
  module Popover
    # PopoverComponent - ViewComponent implementation
    #
    # Container for popover trigger and content.
    # Uses PopoverBehavior concern for shared styling logic.
    #
    # @example Basic usage
    #   <%= render UI::Popover::PopoverComponent.new do %>
    #     <%= render UI::Popover::TriggerComponent.new do %>
    #       <button>Click me</button>
    #     <% end %>
    #     <%= render UI::Popover::ContentComponent.new do %>
    #       Popover content
    #     <% end %>
    #   <% end %>
    #
    # @example With custom placement
    #   <%= render UI::Popover::PopoverComponent.new(placement: "top", offset: 8) do %>
    #     ...
    #   <% end %>
    class PopoverComponent < ViewComponent::Base
      include PopoverBehavior

      # @param placement [String] Placement of the popover (e.g., "bottom", "top-start")
      # @param offset [Integer] Distance in pixels from the trigger
      # @param trigger [String] Trigger type ("click" or "hover")
      # @param hover_delay [Integer] Delay in milliseconds for hover trigger
      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(
        placement: "bottom",
        offset: 4,
        trigger: "click",
        hover_delay: 200,
        classes: "",
        align: nil,
        side_offset: nil,
        **attributes
      )
        @placement = placement
        @offset = side_offset || offset
        @trigger = trigger
        @hover_delay = hover_delay
        @classes = classes
        @align = align
        @attributes = attributes
      end

      def call
        content_tag :div, **popover_html_attributes do
          content
        end
      end
    end
  end
end
