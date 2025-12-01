# frozen_string_literal: true

class UI::TextareaComponent < ViewComponent::Base
  include UI::TextareaBehavior

  def initialize(name: nil, placeholder: "", value: "", rows: nil, classes: "", **attributes)
    @name = name
    @placeholder = placeholder
    @value = value
    @rows = rows
    @classes = classes
    @attributes = attributes
  end

  def call
    content_tag :textarea, @value, **textarea_html_attributes.merge(@attributes)
  end
end
