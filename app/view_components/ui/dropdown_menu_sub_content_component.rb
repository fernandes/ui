# frozen_string_literal: true

# SubContentComponent - ViewComponent implementation
class UI::DropdownMenuSubContentComponent < ViewComponent::Base
  include UI::DropdownMenuSubContentBehavior

  def initialize(side: "right", align: "start", classes: "", **attributes)
    @side = side
    @align = align
    @classes = classes
    @attributes = attributes
  end

  def call
    content_tag :div, **dropdown_menu_sub_content_html_attributes.merge(@attributes.except(:data)) do
      content
    end
  end
end
