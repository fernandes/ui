# frozen_string_literal: true

class UI::CarouselPreviousComponent < ViewComponent::Base
  def initialize(classes: nil, **attributes)
    @classes = classes
    @attributes = attributes
  end

  def call
    extend UI::CarouselPreviousBehavior

    render UI::ButtonComponent.new(**carousel_previous_html_attributes, classes: carousel_previous_classes, variant: :outline, size: :icon) do
      safe_join([
        lucide_icon("arrow-left", class: "size-4"),
        content_tag(:span, "Previous slide", class: "sr-only")
      ])
    end
  end
end
