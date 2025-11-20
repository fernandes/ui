# frozen_string_literal: true

module UI
  module Empty
    # EmptyComponent - ViewComponent implementation
    class EmptyComponent < ViewComponent::Base
      include UI::EmptyBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def call
        tag.div(**empty_html_attributes.merge(@attributes)) do
          content
        end
      end
    end
  end
end
