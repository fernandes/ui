# frozen_string_literal: true

class UI::ItemHeader < Phlex::HTML
  include UI::ItemHeaderBehavior

  def initialize(classes: "", **attributes)
    @classes = classes
    @attributes = attributes
  end

  def view_template(&block)
    div(**item_header_html_attributes, &block)
  end
end
