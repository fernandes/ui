# frozen_string_literal: true

module UI
  module Card
    class Content < Phlex::HTML
      include ContentBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&)
        div(**card_content_html_attributes.deep_merge(@attributes), &)
      end
    end
  end
end
