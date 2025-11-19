# frozen_string_literal: true

module UI
  module Alert
    # Alert Title - Phlex implementation
    #
    # Title text for an alert component.
    #
    # @example
    #   render UI::Alert::Title.new { "Important Notice" }
    class Title < Phlex::HTML
      include UI::Alert::AlertTitleBehavior

      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        div(**alert_title_html_attributes) do
          yield if block_given?
        end
      end
    end
  end
end
