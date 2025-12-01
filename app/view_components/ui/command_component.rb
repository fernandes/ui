# frozen_string_literal: true

class UI::CommandComponent < ViewComponent::Base
  include UI::CommandBehavior

  def initialize(loop: true, autofocus: false, classes: "", **attributes)
    @loop = loop
    @autofocus = autofocus
    @classes = classes
    @attributes = attributes
  end

  def call
    content_tag(:div, content, **command_html_attributes.deep_merge(@attributes))
  end
end
