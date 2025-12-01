# frozen_string_literal: true

class UI::TableHeadComponent < ViewComponent::Base
  include UI::TableHeadBehavior

  def initialize(classes: "", **attributes)
    @classes = classes
    @attributes = attributes
  end

  def call
    content_tag :th, content, **head_html_attributes.deep_merge(@attributes)
  end
end
