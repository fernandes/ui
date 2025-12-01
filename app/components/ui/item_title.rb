# frozen_string_literal: true

class UI::ItemTitle < Phlex::HTML
  include UI::ItemTitleBehavior

  def initialize(classes: "", **attributes)
    @classes = classes
    @attributes = attributes
  end

  def view_template(&block)
    div(**item_title_html_attributes, &block)
  end
end
