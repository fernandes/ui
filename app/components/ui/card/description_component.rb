# frozen_string_literal: true

module UI
  module Card
    class DescriptionComponent < ViewComponent::Base
      include DescriptionBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def call
        render_card_description { content }
      end
    end
  end
end
