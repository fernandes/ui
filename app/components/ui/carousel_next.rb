# frozen_string_literal: true

class UI::CarouselNext < UI::Base
  def initialize(classes: nil, **attributes)
    @classes = classes
    @attributes = attributes
  end

  def view_template(&)
    extend UI::CarouselNextBehavior

    render UI::Button.new(**carousel_next_html_attributes, classes: carousel_next_classes, variant: :outline, size: :icon) do
      lucide_icon("arrow-right", class: "size-4")
      span(class: "sr-only") { "Next slide" }
    end
  end
end
