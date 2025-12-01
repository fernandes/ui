# frozen_string_literal: true

class UI::CommandItemComponent < ViewComponent::Base
  include UI::CommandItemBehavior

  def initialize(value: nil, disabled: false, classes: "", **attributes)
    @value = value
    @disabled = disabled
    @classes = classes
    @attributes = attributes
  end

  def call
    content_tag(:div, content, **command_item_html_attributes.deep_merge(@attributes))
  end
end
