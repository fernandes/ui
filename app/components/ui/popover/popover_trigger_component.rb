# frozen_string_literal: true

module UI
  module Popover
    # PopoverTriggerComponent - ViewComponent implementation
    #
    # Button or element that triggers the popover.
    # Uses PopoverTriggerBehavior concern for shared styling logic.
    #
    # @example Basic usage
    #   <%= render UI::Popover::PopoverTriggerComponent.new do %>
    #     <button>Click me</button>
    #   <% end %>
    #
    # @example As child (wraps content without adding wrapper)
    #   <%= render UI::Popover::PopoverTriggerComponent.new(as_child: true) do %>
    #     <button>Click me</button>
    #   <% end %>
    class PopoverTriggerComponent < ViewComponent::Base
      include PopoverTriggerBehavior

      # @param as_child [Boolean] If true, adds data attributes to child without wrapper
      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(as_child: false, classes: "", **attributes)
        @as_child = as_child
        @classes = classes
        @attributes = attributes
      end

      def call
        if @as_child
          # Just add data attributes to the child
          content_tag :div, **@attributes.merge(data: { popover_target: "trigger" }) do
            content
          end
        else
          # Render with classes
          content_tag :div, **popover_trigger_html_attributes do
            content
          end
        end
      end
    end
  end
end
