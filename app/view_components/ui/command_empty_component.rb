# frozen_string_literal: true

class UI::CommandEmptyComponent < ViewComponent::Base
  include UI::CommandEmptyBehavior

  def initialize(classes: "", **attributes)
    @classes = classes
    @attributes = attributes
  end

  def call
    content_tag(:div, content, **command_empty_html_attributes.deep_merge(@attributes))
  end
end
