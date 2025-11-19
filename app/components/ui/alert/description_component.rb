# frozen_string_literal: true

module UI
  module Alert
    # Alert Description - ViewComponent implementation
    #
    # Description text for an alert component.
    class DescriptionComponent < ViewComponent::Base
      include UI::Alert::AlertDescriptionBehavior

      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def call
        tag.div(**alert_description_html_attributes) do
          content
        end
      end
    end
  end
end
