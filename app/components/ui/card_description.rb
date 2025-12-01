# frozen_string_literal: true

class UI::CardDescription < Phlex::HTML
  include UI::CardDescriptionBehavior

  def initialize(classes: "", **attributes)
    @classes = classes
    @attributes = attributes
  end

  def view_template(&)
    div(**card_description_html_attributes.deep_merge(@attributes), &)
  end
end
