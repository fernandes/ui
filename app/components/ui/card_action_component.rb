# frozen_string_literal: true

    class UI::CardActionComponent < ViewComponent::Base
      include UI::CardActionBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def call
        render_card_action { content }
      end
    end
