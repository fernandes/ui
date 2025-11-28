# frozen_string_literal: true

    # FieldSetComponent - ViewComponent implementation
    #
    # Semantic fieldset container for grouped fields.
    # Uses FieldSetBehavior concern for shared styling logic.
    #
    # @example Basic usage
    #   <%= render UI::FieldSetComponent.new do %>
    #     <%= render UI::FieldLegendComponent.new do %>
    #       Contact Information
    #     <% end %>
    #     Field groups here
    #   <% end %>
    class UI::FieldSetComponent < ViewComponent::Base
      include UI::FieldSetBehavior

      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag :fieldset, **field_set_html_attributes do
          content
        end
      end
    end
