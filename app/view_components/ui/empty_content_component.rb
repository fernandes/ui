# frozen_string_literal: true

# EmptyContentComponent - ViewComponent implementation
class UI::EmptyContentComponent < ViewComponent::Base
  include UI::EmptyContentBehavior

  def initialize(classes: "", **attributes)
    @classes = classes
    @attributes = attributes
  end

  def call
    tag.div(**empty_content_html_attributes.merge(@attributes)) do
      content
    end
  end
end
