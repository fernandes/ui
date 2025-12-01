# frozen_string_literal: true

# SubComponent - ViewComponent implementation
class UI::DropdownMenuSubComponent < ViewComponent::Base
  include UI::DropdownMenuSubBehavior

  def initialize(classes: "", **attributes)
    @classes = classes
    @attributes = attributes
  end

  def call
    content_tag :div, **dropdown_menu_sub_html_attributes.merge(@attributes.except(:data)) do
      content
    end
  end
end
