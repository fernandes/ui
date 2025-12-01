# frozen_string_literal: true

# EmptyMediaComponent - ViewComponent implementation
class UI::EmptyMediaComponent < ViewComponent::Base
  include UI::EmptyMediaBehavior

  def initialize(variant: "default", classes: "", **attributes)
    @variant = variant
    @classes = classes
    @attributes = attributes
  end

  def call
    tag.div(**empty_media_html_attributes.merge(@attributes)) do
      content
    end
  end
end
