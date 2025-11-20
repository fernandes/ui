# frozen_string_literal: true

module UI
  module Item
    class Media < Phlex::HTML
      include UI::Item::ItemMediaBehavior

      def initialize(variant: "default", classes: "", **attributes)
        @variant = variant
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        div(**item_media_html_attributes, &block)
      end
    end
  end
end
