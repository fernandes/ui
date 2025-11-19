# frozen_string_literal: true

module UI
  module Alert
    # Alert Title - ViewComponent implementation
    #
    # Title text for an alert component.
    class TitleComponent < ViewComponent::Base
      include UI::Alert::AlertTitleBehavior

      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def call
        tag.div(**alert_title_html_attributes) do
          content
        end
      end
    end
  end
end
