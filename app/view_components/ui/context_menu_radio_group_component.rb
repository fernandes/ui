# frozen_string_literal: true

# RadioGroupComponent - ViewComponent implementation
class UI::ContextMenuRadioGroupComponent < ViewComponent::Base
  include UI::ContextMenuRadioGroupBehavior

  def initialize(classes: "", **attributes)
    @classes = classes
    @attributes = attributes
  end

  def call
    attrs = context_menu_radio_group_html_attributes

    content_tag :div, **attrs.merge(@attributes) do
      content
    end
  end
end
