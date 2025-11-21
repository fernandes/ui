# frozen_string_literal: true

module UI
  module Card
    class ContentComponent < ViewComponent::Base
      include ContentBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def call
        render_card_content { content }
      end
    end
  end
end
