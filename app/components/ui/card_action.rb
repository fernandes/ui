# frozen_string_literal: true

class UI::CardAction < Phlex::HTML
  include UI::CardActionBehavior

  def initialize(classes: "", **attributes)
    @classes = classes
    @attributes = attributes
  end

  def view_template(&)
    div(**card_action_html_attributes.deep_merge(@attributes), &)
  end
end
