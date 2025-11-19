# frozen_string_literal: true

module UI
  module Avatar
    # Avatar Image - ViewComponent implementation
    #
    # Displays the avatar image. Only renders when it has loaded successfully.
    class ImageComponent < ViewComponent::Base
      include UI::Avatar::AvatarImageBehavior

      # @param src [String] Image source URL
      # @param alt [String] Alternative text for the image
      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(src:, alt: "", classes: "", **attributes)
        @src = src
        @alt = alt
        @classes = classes
        @attributes = attributes
      end

      def call
        tag.img(**avatar_image_html_attributes.deep_merge(@attributes))
      end
    end
  end
end
