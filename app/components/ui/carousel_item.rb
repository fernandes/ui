# frozen_string_literal: true

    class UI::CarouselItem < Phlex::HTML
      def initialize(classes: nil, **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        extend UI::CarouselItemBehavior
        div(**carousel_item_html_attributes, &block)
      end
    end
