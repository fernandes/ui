# frozen_string_literal: true

# RadioGroupComponent - ViewComponent implementation
class UI::DropdownMenuRadioGroupComponent < ViewComponent::Base
  include UI::DropdownMenuRadioGroupBehavior

  def initialize(classes: "", **attributes)
    @classes = classes
    @attributes = attributes
  end

  def call
    content_tag :div, **dropdown_menu_radio_group_html_attributes.merge(@attributes.except(:data)) do
      content
    end
  end
end
