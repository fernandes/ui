# frozen_string_literal: true

module UI
  module Alert
    # Alert - ViewComponent implementation
    #
    # A callout component for displaying important information to users.
    class AlertComponent < ViewComponent::Base
      include UI::Alert::AlertBehavior

      # @param variant [Symbol] Visual style variant (:default, :destructive)
      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(variant: :default, classes: "", **attributes)
        @variant = variant
        @classes = classes
        @attributes = attributes
      end

      def call
        tag.div(**alert_html_attributes) do
          content
        end
      end
    end
  end
end
