# frozen_string_literal: true

module UI
  module Alert
    # Alert Description - Phlex implementation
    #
    # Description text for an alert component.
    #
    # @example
    #   render UI::Alert::Description.new do
    #     "Your account has been successfully updated."
    #   end
    class Description < Phlex::HTML
      include UI::Alert::AlertDescriptionBehavior

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
  end
end
