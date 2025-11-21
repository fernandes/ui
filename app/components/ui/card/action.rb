# frozen_string_literal: true

module UI
  module Card
    class Action < Phlex::HTML
      include ActionBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&)
        div(**card_action_html_attributes.deep_merge(@attributes), &)
      end
    end
  end
end
