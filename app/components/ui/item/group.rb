# frozen_string_literal: true

module UI
  module Item
    class Group < Phlex::HTML
      include UI::Item::ItemGroupBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        div(**item_group_html_attributes, &block)
      end
    end
  end
end
