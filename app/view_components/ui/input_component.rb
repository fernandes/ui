# frozen_string_literal: true

class UI::InputComponent < ViewComponent::Base
  include UI::InputBehavior

  def initialize(type: "text", placeholder: nil, value: nil, name: nil, id: nil, classes: "", **attributes)
    @type = type
    @placeholder = placeholder
    @value = value
    @name = name
    @id = id
    @classes = classes
    @attributes = attributes
  end

  def call
    tag.input(**input_html_attributes.merge(@attributes))
  end

  private

  attr_reader :classes, :attributes
end
