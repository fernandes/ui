# frozen_string_literal: true

module UI
  module Popover
    # TriggerComponent - ViewComponent implementation
    #
    # Button or element that triggers the popover.
    # Uses PopoverTriggerBehavior concern for shared styling logic.
    #
    # @example Basic usage
    #   <%= render UI::Popover::TriggerComponent.new do %>
    #     <button>Click me</button>
    #   <% end %>
    #
    # @example As child (wraps content without adding wrapper)
    #   <%= render UI::Popover::TriggerComponent.new(as_child: true) do %>
    #     <button>Click me</button>
    #   <% end %>
    class TriggerComponent < ViewComponent::Base
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
        trigger_attrs = popover_trigger_html_attributes.deep_merge(@attributes)

        if @as_child
          # asChild mode: merge attributes into child element
          # Parse the rendered content and add trigger attributes to the first element
          rendered = content.to_s

          # Use Nokogiri to parse and modify the HTML
          doc = Nokogiri::HTML::DocumentFragment.parse(rendered)
          first_element = doc.children.find { |node| node.element? }

          if first_element
            # Merge data attributes
            trigger_attrs.fetch(:data, {}).each do |key, value|
              # Convert Rails naming convention to HTML: _ becomes -, __ becomes --
              html_key = key.to_s.gsub("__", "--").gsub("_", "-")
              first_element["data-#{html_key}"] = value
            end

            # Merge other attributes
            trigger_attrs.except(:data).each do |key, value|
              first_element[key.to_s] = value
            end

            doc.to_html.html_safe
          else
            content
          end
        else
          # Default mode: render as div
          content_tag :div, **trigger_attrs do
            content
          end
        end
      end
    end
  end
end
