# frozen_string_literal: true

module UI
  module Tabs
    # Tabs container component (Phlex)
    # Root component for tabbed interface with keyboard navigation
    #
    # @example Basic usage
    #   render UI::Tabs::Tabs.new(default_value: "account") do
    #     render UI::Tabs::List.new do
    #       render UI::Tabs::Trigger.new(value: "account") { "Account" }
    #       render UI::Tabs::Trigger.new(value: "password") { "Password" }
    #     end
    #     render UI::Tabs::Content.new(value: "account") { "Account content" }
    #     render UI::Tabs::Content.new(value: "password") { "Password content" }
    #   end
    #
    # @example Vertical orientation
    #   render UI::Tabs::Tabs.new(default_value: "tab1", orientation: "vertical") do
    #     # Tabs will be vertically oriented
    #   end
    class Tabs < Phlex::HTML
      include UI::Tabs::TabsBehavior

      # @param default_value [String] initial active tab value
      # @param orientation [String] "horizontal" or "vertical"
      # @param activation_mode [String] "automatic" or "manual"
      # @param classes [String] additional CSS classes
      # @param attributes [Hash] additional HTML attributes
      def initialize(default_value: "", orientation: "horizontal", activation_mode: "automatic", classes: "", attributes: {}, **)
        @default_value = default_value
        @orientation = orientation
        @activation_mode = activation_mode
        @classes = classes
        @attributes = attributes
        super()
      end

      def view_template(&block)
        div(**tabs_html_attributes, &block)
      end
    end
  end
end
