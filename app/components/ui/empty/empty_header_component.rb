# frozen_string_literal: true

module UI
  module Empty
    # EmptyHeaderComponent - ViewComponent implementation
    class EmptyHeaderComponent < ViewComponent::Base
      include UI::EmptyHeaderBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def call
        tag.div(**empty_header_html_attributes.merge(@attributes)) do
          content
        end
      end
    end
  end
end
