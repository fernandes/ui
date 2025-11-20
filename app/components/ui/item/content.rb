# frozen_string_literal: true

module UI
  module Item
    class Content < Phlex::HTML
      include UI::Item::ItemContentBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        div(**item_content_html_attributes, &block)
      end
    end
  end
end
