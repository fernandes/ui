# frozen_string_literal: true

module UI
  module Item
    class Separator < Phlex::HTML
      include UI::Item::ItemSeparatorBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        hr(**item_separator_html_attributes, &block)
      end
    end
  end
end
