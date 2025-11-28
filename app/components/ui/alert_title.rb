# frozen_string_literal: true

    # Alert Title - Phlex implementation
    #
    # Title text for an alert component.
    #
    # @example
    #   render UI::Title.new { "Important Notice" }
    class UI::AlertTitle < Phlex::HTML
      include UI::AlertTitleBehavior

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
