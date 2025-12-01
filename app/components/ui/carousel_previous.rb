# frozen_string_literal: true

class UI::CarouselPrevious < Phlex::HTML
  def initialize(classes: nil, **attributes)
    @classes = classes
    @attributes = attributes
  end

  def view_template(&)
    extend UI::CarouselPreviousBehavior

    render UI::Button.new(**carousel_previous_html_attributes, classes: carousel_previous_classes, variant: :outline, size: :icon) do
      raw(safe(helpers.lucide_icon("arrow-left", class: "size-4")))
      span(class: "sr-only") { "Previous slide" }
    end
  end
end
