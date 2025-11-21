# frozen_string_literal: true

module UI
  module Card
    class HeaderComponent < ViewComponent::Base
      include HeaderBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def call
        render_card_header { content }
      end
    end
  end
end
