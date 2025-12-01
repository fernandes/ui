# frozen_string_literal: true

# LabelComponent - ViewComponent implementation
class UI::DropdownMenuLabelComponent < ViewComponent::Base
  include UI::DropdownMenuLabelBehavior

  def initialize(inset: false, classes: "", **attributes)
    @inset = inset
    @classes = classes
    @attributes = attributes
  end

  def call
    content_tag :div, **dropdown_menu_label_html_attributes.merge(@attributes.except(:data)) do
      content
    end
  end
end
