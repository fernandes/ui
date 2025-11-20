# frozen_string_literal: true

module UI
  module Item
    class Footer < Phlex::HTML
      include UI::Item::ItemFooterBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        div(**item_footer_html_attributes, &block)
      end
    end
  end
end
