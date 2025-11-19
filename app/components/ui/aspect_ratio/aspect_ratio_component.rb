# frozen_string_literal: true

module UI
  module AspectRatio
    # AspectRatio - ViewComponent implementation
    #
    # Displays content within a desired aspect ratio.
    class AspectRatioComponent < ViewComponent::Base
      include UI::AspectRatio::AspectRatioBehavior

      # @param ratio [Float] The desired aspect ratio (width/height, e.g., 16/9)
      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(ratio: 1.0, classes: "", **attributes)
        @ratio = ratio
        @classes = classes
        @attributes = attributes
      end

      def call
        tag.div(**aspect_ratio_html_attributes) do
          tag.div(**aspect_ratio_padding_attributes) +
          tag.div(**aspect_ratio_content_attributes) do
            content
          end
        end
      end
    end
  end
end
