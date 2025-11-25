# frozen_string_literal: true

module UI
  module Carousel
    class ItemComponent < ViewComponent::Base
      def initialize(classes: nil, **attributes)
        @classes = classes
        @attributes = attributes
      end

      def call
        extend UI::Carousel::CarouselItemBehavior
        content_tag :div, content, **carousel_item_html_attributes
      end
    end
  end
end
