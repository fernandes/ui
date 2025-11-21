# frozen_string_literal: true

module UI
  module Card
    class CardComponent < ViewComponent::Base
      include CardBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def call
        render_card { content }
      end
    end
  end
end
