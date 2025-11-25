# frozen_string_literal: true

module UI
  module Carousel
    class CarouselComponent < ViewComponent::Base
      def initialize(classes: nil, orientation: "horizontal", opts: {}, plugins: nil, **attributes)
        @classes = classes
        @orientation = orientation
        @opts = opts
        @plugins = plugins
        @attributes = attributes
      end

      def call
        extend UI::Carousel::CarouselBehavior
        content_tag :div, content, **carousel_html_attributes
      end
    end
  end
end
