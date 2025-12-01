# frozen_string_literal: true

# EmptyHeaderComponent - ViewComponent implementation
class UI::EmptyHeaderComponent < ViewComponent::Base
  include UI::EmptyHeaderBehavior

  def initialize(classes: "", **attributes)
    @classes = classes
    @attributes = attributes
  end

  def call
    tag.div(**empty_header_html_attributes.merge(@attributes)) do
      content
    end
  end
end
