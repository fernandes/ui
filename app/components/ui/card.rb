# frozen_string_literal: true

class UI::Card < Phlex::HTML
  include UI::CardBehavior

  def initialize(classes: "", **attributes)
    @classes = classes
    @attributes = attributes
  end

  def view_template(&)
    div(**card_html_attributes.deep_merge(@attributes), &)
  end
end
