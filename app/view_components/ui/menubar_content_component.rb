# frozen_string_literal: true

# ContentComponent - ViewComponent implementation
#
# Container for menu items.
#
# @example Basic usage
#   render UI::ContentComponent.new do
#     render UI::ItemComponent.new { "Item" }
#   end
class UI::MenubarContentComponent < ViewComponent::Base
  include UI::MenubarContentBehavior

  def initialize(align: "start", side: "bottom", classes: "", **attributes)
    @align = align
    @side = side
    @classes = classes
    @attributes = attributes
  end

  def call
    content_tag :div, **menubar_content_html_attributes.deep_merge(@attributes) do
      content
    end
  end
end
