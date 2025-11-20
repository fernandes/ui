# frozen_string_literal: true

module UI
  module Select
    # Select Trigger - Phlex implementation
    #
    # Button that opens the select dropdown.
    # Supports asChild pattern for composition.
    #
    # @example Default button
    #   render UI::Select::Trigger.new(placeholder: "Select a fruit...")
    #
    # @example With asChild (custom button)
    #   render UI::Select::Trigger.new(as_child: true, placeholder: "Select plan...") do |attrs|
    #     button(**attrs, class: "custom-button") do
    #       span(data_ui__select_target: "valueDisplay") { "Select plan..." }
    #     end
    #   end
    class Trigger < Phlex::HTML
      include UI::SelectTriggerBehavior
      include UI::Shared::AsChildBehavior

      # @param as_child [Boolean] When true, yields attributes to block instead of rendering button
      # @param placeholder [String] Placeholder text when no value selected
      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(as_child: false, placeholder: "Select...", classes: "", **attributes)
        @as_child = as_child
        @placeholder = placeholder
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        trigger_attrs = select_trigger_html_attributes.deep_merge(@attributes)

        if @as_child
          # asChild mode: yield attributes to block
          yield(trigger_attrs) if block_given?
        else
          # Default mode: render as button
          button(**trigger_attrs) do
            span(data_ui__select_target: "valueDisplay") { @placeholder }
          end
        end
      end
    end
  end
end
