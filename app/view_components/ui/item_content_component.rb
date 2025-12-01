# frozen_string_literal: true

class UI::ItemContentComponent < ViewComponent::Base
  include UI::ItemContentBehavior

  def initialize(classes: "", **attributes)
    @classes = classes
    @attributes = attributes
  end

  def call
    content_tag :div, content, **item_content_html_attributes
  end

  private

  attr_reader :classes, :attributes
end
