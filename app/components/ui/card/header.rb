# frozen_string_literal: true

module UI
  module Card
    class Header < Phlex::HTML
      include HeaderBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&)
        div(**card_header_html_attributes.deep_merge(@attributes), &)
      end
    end
  end
end
