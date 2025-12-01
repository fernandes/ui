# frozen_string_literal: true

class UI::ItemSeparatorComponent < ViewComponent::Base
  include UI::ItemSeparatorBehavior

  def initialize(classes: "", **attributes)
    @classes = classes
    @attributes = attributes
  end

  def call
    content_tag :hr, nil, **item_separator_html_attributes
  end

  private

  attr_reader :classes, :attributes
end
