# frozen_string_literal: true

module UI
  module Card
    class FooterComponent < ViewComponent::Base
      include FooterBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def call
        render_card_footer { content }
      end
    end
  end
end
