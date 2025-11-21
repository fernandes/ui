# frozen_string_literal: true

module UI
  module Card
    class TitleComponent < ViewComponent::Base
      include TitleBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def call
        render_card_title { content }
      end
    end
  end
end
