# frozen_string_literal: true

    class UI::CardContentComponent < ViewComponent::Base
      include UI::CardContentBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def call
        render_card_content { content }
      end
    end
