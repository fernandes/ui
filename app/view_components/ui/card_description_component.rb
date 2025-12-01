# frozen_string_literal: true

class UI::CardDescriptionComponent < ViewComponent::Base
  include UI::CardDescriptionBehavior

  def initialize(classes: "", **attributes)
    @classes = classes
    @attributes = attributes
  end

  def call
    render_card_description { content }
  end
end
