# frozen_string_literal: true

    class UI::CardTitleComponent < ViewComponent::Base
      include UI::CardTitleBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def call
        render_card_title { content }
      end
    end
