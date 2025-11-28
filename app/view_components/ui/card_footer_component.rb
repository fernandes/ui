# frozen_string_literal: true

    class UI::CardFooterComponent < ViewComponent::Base
      include UI::CardFooterBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def call
        render_card_footer { content }
      end
    end
