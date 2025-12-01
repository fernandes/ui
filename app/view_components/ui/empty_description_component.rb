# frozen_string_literal: true

# EmptyDescriptionComponent - ViewComponent implementation
class UI::EmptyDescriptionComponent < ViewComponent::Base
  include UI::EmptyDescriptionBehavior

  def initialize(classes: "", **attributes)
    @classes = classes
    @attributes = attributes
  end

  def call
    tag.p(**empty_description_html_attributes.merge(@attributes)) do
      content
    end
  end
end
