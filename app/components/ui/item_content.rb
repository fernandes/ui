# frozen_string_literal: true

class UI::ItemContent < Phlex::HTML
  include UI::ItemContentBehavior

  def initialize(classes: "", **attributes)
    @classes = classes
    @attributes = attributes
  end

  def view_template(&block)
    div(**item_content_html_attributes, &block)
  end
end
