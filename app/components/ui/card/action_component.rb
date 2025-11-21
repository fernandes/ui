# frozen_string_literal: true

module UI
  module Card
    class ActionComponent < ViewComponent::Base
      include ActionBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def call
        render_card_action { content }
      end
    end
  end
end
