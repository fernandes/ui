# frozen_string_literal: true

class UI::CarouselNextComponent < ViewComponent::Base
  def initialize(classes: nil, **attributes)
    @classes = classes
    @attributes = attributes
  end

  def call
    extend UI::CarouselNextBehavior

    render UI::ButtonComponent.new(**carousel_next_html_attributes, classes: carousel_next_classes, variant: :outline, size: :icon) do
      safe_join([
        helpers.lucide_icon("arrow-right", class: "size-4"),
        content_tag(:span, "Next slide", class: "sr-only")
      ])
    end
  end
end
