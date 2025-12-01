# frozen_string_literal: true

# EmptyComponent - ViewComponent implementation
class UI::EmptyComponent < ViewComponent::Base
  include UI::EmptyBehavior

  def initialize(classes: "", **attributes)
    @classes = classes
    @attributes = attributes
  end

  def call
    tag.div(**empty_html_attributes.merge(@attributes)) do
      content
    end
  end
end
