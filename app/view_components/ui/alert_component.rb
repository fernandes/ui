# frozen_string_literal: true

    # Alert - ViewComponent implementation
    #
    # A callout component for displaying important information to users.
    class UI::AlertComponent < ViewComponent::Base
      include UI::AlertBehavior

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
