# frozen_string_literal: true

class UI::CarouselNext < Phlex::HTML
  def initialize(classes: nil, **attributes)
    @classes = classes
    @attributes = attributes
  end

  def view_template(&)
    extend UI::CarouselNextBehavior

    render UI::Button.new(**carousel_next_html_attributes, classes: carousel_next_classes, variant: :outline, size: :icon) do
      raw(safe(helpers.lucide_icon("arrow-right", class: "size-4")))
      span(class: "sr-only") { "Next slide" }
    end
  end
end
