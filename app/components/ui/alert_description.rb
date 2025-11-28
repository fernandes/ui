# frozen_string_literal: true

    # Alert Description - Phlex implementation
    #
    # Description text for an alert component.
    #
    # @example
    #   render UI::Description.new do
    #     "Your account has been successfully updated."
    #   end
    class UI::AlertDescription < Phlex::HTML
      include UI::AlertDescriptionBehavior

      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        div(**alert_description_html_attributes) do
          yield if block_given?
        end
      end
    end
