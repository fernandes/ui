# frozen_string_literal: true

    # TriggerComponent - ViewComponent implementation
    #
    # Button that opens the select dropdown.
    # Note: ViewComponent version uses template for asChild support
    #
    # @example Default button
    #   <%= render UI::TriggerComponent.new(placeholder: "Select a fruit...") %>
    class UI::SelectTriggerComponent < ViewComponent::Base
      include UI::SelectTriggerBehavior

      # @param placeholder [String] Placeholder text when no value selected
      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(placeholder: "Select...", classes: "", **attributes)
        @placeholder = placeholder
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag :button, **select_trigger_html_attributes.deep_merge(@attributes) do
          content_tag :span, @placeholder, data: { ui__select_target: "valueDisplay" }
        end
      end
    end
