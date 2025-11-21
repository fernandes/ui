# frozen_string_literal: true

module UI
  module Card
    class Description < Phlex::HTML
      include DescriptionBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&)
        div(**card_description_html_attributes.deep_merge(@attributes), &)
      end
    end
  end
end
