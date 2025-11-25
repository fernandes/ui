# frozen_string_literal: true

module UI
  module Carousel
    class PreviousComponent < ViewComponent::Base
      def initialize(classes: nil, **attributes)
        @classes = classes
        @attributes = attributes
      end

      def call
        extend UI::Carousel::CarouselPreviousBehavior
        render UI::Button::ButtonComponent.new(**carousel_previous_html_attributes, classes: carousel_previous_classes, variant: :ghost, size: :icon) do
          safe_join([
            tag.svg(
              xmlns: "http://www.w3.org/2000/svg",
              width: "24",
              height: "24",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              stroke_width: "2",
              stroke_linecap: "round",
              stroke_linejoin: "round",
              class: "size-4"
            ) do
              tag.path(d: "m15 18-6-6 6-6")
            end,
            content_tag(:span, "Previous slide", class: "sr-only")
          ])
        end
      end
    end
  end
end
