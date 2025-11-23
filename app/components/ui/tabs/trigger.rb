# frozen_string_literal: true

module UI
  module Tabs
    # TabsTrigger component (Phlex)
    # Button that activates associated content panel
    #
    # @example Basic usage
    #   render UI::Tabs::Trigger.new(value: "account") { "Account" }
    #
    # @example Disabled trigger
    #   render UI::Tabs::Trigger.new(value: "disabled", disabled: true) { "Disabled" }
    class Trigger < Phlex::HTML
      include UI::Tabs::TabsTriggerBehavior

      # @param value [String] unique identifier for this trigger
      # @param default_value [String] currently active tab value
      # @param orientation [String] "horizontal" or "vertical"
      # @param disabled [Boolean] whether trigger is disabled
      # @param classes [String] additional CSS classes
      # @param attributes [Hash] additional HTML attributes
      def initialize(value: "", default_value: "", orientation: "horizontal", disabled: false, classes: "", attributes: {}, **)
        @value = value
        @default_value = default_value
        @orientation = orientation
        @disabled = disabled
        @classes = classes
        @attributes = attributes
        super()
      end

      def view_template(&block)
        button(**trigger_html_attributes, &block)
      end
    end
  end
end
