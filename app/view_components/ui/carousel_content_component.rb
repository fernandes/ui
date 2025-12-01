# frozen_string_literal: true

class UI::CarouselContentComponent < ViewComponent::Base
  def initialize(classes: nil, **attributes)
    @classes = classes
    @attributes = attributes
  end

  def call
    extend UI::CarouselContentBehavior

    content_tag :div, **carousel_content_html_attributes do
      content_tag :div, content, **carousel_content_container_html_attributes
    end
  end
end
