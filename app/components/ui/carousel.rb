# frozen_string_literal: true

class UI::Carousel < Phlex::HTML
  def initialize(classes: nil, orientation: "horizontal", opts: {}, plugins: nil, **attributes)
    @classes = classes
    @orientation = orientation
    @opts = opts
    @plugins = plugins
    @attributes = attributes
  end

  def view_template(&block)
    extend UI::CarouselBehavior

    div(**carousel_html_attributes, &block)
  end
end
