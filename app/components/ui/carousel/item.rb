# frozen_string_literal: true

module UI
  module Carousel
    class Item < Phlex::HTML
      def initialize(classes: nil, **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        extend UI::Carousel::CarouselItemBehavior
        div(**carousel_item_html_attributes, &block)
      end
    end
  end
end
