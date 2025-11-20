# frozen_string_literal: true

module UI
  module Item
    class Actions < Phlex::HTML
      include UI::Item::ItemActionsBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        div(**item_actions_html_attributes, &block)
      end
    end
  end
end
