# frozen_string_literal: true

    # Alert Description - ViewComponent implementation
    #
    # Description text for an alert component.
    class UI::AlertDescriptionComponent < ViewComponent::Base
      include UI::AlertDescriptionBehavior

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
