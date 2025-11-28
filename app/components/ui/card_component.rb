# frozen_string_literal: true

    class UI::CardComponent < ViewComponent::Base
      include UI::CardBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def call
        render_card { content }
      end
    end
