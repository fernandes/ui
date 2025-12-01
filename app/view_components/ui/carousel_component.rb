# frozen_string_literal: true

class UI::CarouselComponent < ViewComponent::Base
  def initialize(classes: nil, orientation: "horizontal", opts: {}, plugins: nil, **attributes)
    @classes = classes
    @orientation = orientation
    @opts = opts
    @plugins = plugins
    @attributes = attributes
  end

  def call
    extend UI::CarouselBehavior

    content_tag :div, content, **carousel_html_attributes
  end
end
