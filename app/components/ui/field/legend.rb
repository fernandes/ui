# frozen_string_literal: true

module UI
  module Field
    # Legend - Phlex implementation
    #
    # Legend element for FieldSet with variant support.
    # Uses FieldLegendBehavior concern for shared styling logic.
    #
    # @example Basic usage
    #   render UI::Field::Legend.new { "Personal Information" }
    #
    # @example With variant
    #   render UI::Field::Legend.new(variant: "label") { "Settings" }
    class Legend < Phlex::HTML
      include UI::FieldLegendBehavior

      # @param variant [String] Style variant: "legend" or "label"
      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(variant: "legend", classes: "", **attributes)
        @variant = variant
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        legend(**field_legend_html_attributes) do
          yield if block_given?
        end
      end
    end
  end
end
