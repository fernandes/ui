# frozen_string_literal: true

module UI
  module Field
    # FieldLegendComponent - ViewComponent implementation
    #
    # Legend element for FieldSet with variant support.
    # Uses FieldLegendBehavior concern for shared styling logic.
    #
    # @example With block
    #   <%= render UI::Field::FieldLegendComponent.new do %>
    #     Personal Information
    #   <% end %>
    #
    # @example With variant
    #   <%= render UI::Field::FieldLegendComponent.new(variant: "label") do %>
    #     Settings
    #   <% end %>
    class FieldLegendComponent < ViewComponent::Base
      include UI::FieldLegendBehavior

      # @param variant [String] Style variant: "legend" or "label"
      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(variant: "legend", classes: "", **attributes)
        @variant = variant
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag :legend, **field_legend_html_attributes do
          content
        end
      end
    end
  end
end
