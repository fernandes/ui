# frozen_string_literal: true

    # Badge - ViewComponent implementation
    #
    # Displays a badge or a component that looks like a badge.
    class UI::BadgeComponent < ViewComponent::Base
      include UI::BadgeBehavior

      # @param variant [Symbol, String] Visual style variant (:default, :secondary, :destructive, :outline)
      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(variant: :default, classes: "", **attributes)
        @variant = variant
        @classes = classes
        @attributes = attributes
      end

      def call
        tag.span(**badge_html_attributes.deep_merge(@attributes)) do
          content
        end
      end
    end
