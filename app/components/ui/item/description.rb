# frozen_string_literal: true

module UI
  module Item
    class Description < Phlex::HTML
      include UI::Item::ItemDescriptionBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        p(**item_description_html_attributes, &block)
      end
    end
  end
end
