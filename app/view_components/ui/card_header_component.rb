# frozen_string_literal: true

class UI::CardHeaderComponent < ViewComponent::Base
  include UI::CardHeaderBehavior

  def initialize(classes: "", **attributes)
    @classes = classes
    @attributes = attributes
  end

  def call
    render_card_header { content }
  end
end
