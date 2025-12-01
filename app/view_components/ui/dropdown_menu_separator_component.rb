# frozen_string_literal: true

# SeparatorComponent - ViewComponent implementation
class UI::DropdownMenuSeparatorComponent < ViewComponent::Base
  include UI::DropdownMenuSeparatorBehavior

  def initialize(classes: "", **attributes)
    @classes = classes
    @attributes = attributes
  end

  def call
    content_tag :div, "", **dropdown_menu_separator_html_attributes.merge(@attributes.except(:data))
  end
end
