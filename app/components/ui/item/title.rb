# frozen_string_literal: true

module UI
  module Item
    class Title < Phlex::HTML
      include UI::Item::ItemTitleBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        div(**item_title_html_attributes, &block)
      end
    end
  end
end
