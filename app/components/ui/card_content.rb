# frozen_string_literal: true

class UI::CardContent < Phlex::HTML
  include UI::CardContentBehavior

  def initialize(classes: "", **attributes)
    @classes = classes
    @attributes = attributes
  end

  def view_template(&)
    div(**card_content_html_attributes.deep_merge(@attributes), &)
  end
end
