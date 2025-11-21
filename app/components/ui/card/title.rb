# frozen_string_literal: true

module UI
  module Card
    class Title < Phlex::HTML
      include TitleBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&)
        div(**card_title_html_attributes.deep_merge(@attributes), &)
      end
    end
  end
end
