# frozen_string_literal: true

module UI
  module Empty
    # EmptyMediaComponent - ViewComponent implementation
    class EmptyMediaComponent < ViewComponent::Base
      include UI::EmptyMediaBehavior

      def initialize(variant: "default", classes: "", **attributes)
        @variant = variant
        @classes = classes
        @attributes = attributes
      end

      def call
        tag.div(**empty_media_html_attributes.merge(@attributes)) do
          content
        end
      end
    end
  end
end
