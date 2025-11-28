# frozen_string_literal: true

    # TabsList component (Phlex)
    # Container for tab trigger buttons
    #
    # @example Basic usage
    #   render UI::List.new do
    #     render UI::Trigger.new(value: "tab1") { "Tab 1" }
    #     render UI::Trigger.new(value: "tab2") { "Tab 2" }
    #   end
    class UI::TabsList < Phlex::HTML
      include UI::TabsListBehavior

      # @param orientation [String] "horizontal" or "vertical"
      # @param classes [String] additional CSS classes
      # @param attributes [Hash] additional HTML attributes
      def initialize(orientation: "horizontal", classes: "", attributes: {}, **)
        @orientation = orientation
        @classes = classes
        @attributes = attributes
        super()
      end

      def view_template(&block)
        div(**list_html_attributes, &block)
      end
    end
