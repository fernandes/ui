# frozen_string_literal: true

class UI::ItemFooterComponent < ViewComponent::Base
  include UI::ItemFooterBehavior

  def initialize(classes: "", **attributes)
    @classes = classes
    @attributes = attributes
  end

  def call
    content_tag :div, content, **item_footer_html_attributes
  end

  private

  attr_reader :classes, :attributes
end
