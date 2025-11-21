# frozen_string_literal: true

module UI
  module Card
    class Footer < Phlex::HTML
      include FooterBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&)
        div(**card_footer_html_attributes.deep_merge(@attributes), &)
      end
    end
  end
end
