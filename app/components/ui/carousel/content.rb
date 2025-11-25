# frozen_string_literal: true

module UI
  module Carousel
    class Content < Phlex::HTML
      def initialize(classes: nil, **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        extend UI::Carousel::CarouselContentBehavior
        div(**carousel_content_html_attributes) do
          div(**carousel_content_container_html_attributes, &block)
        end
      end
    end
  end
end
