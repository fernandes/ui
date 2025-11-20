# frozen_string_literal: true

module UI
  module Empty
    # EmptyDescriptionComponent - ViewComponent implementation
    class EmptyDescriptionComponent < ViewComponent::Base
      include UI::EmptyDescriptionBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def call
        tag.p(**empty_description_html_attributes.merge(@attributes)) do
          content
        end
      end
    end
  end
end
