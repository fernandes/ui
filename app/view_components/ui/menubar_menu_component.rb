# frozen_string_literal: true

# MenuComponent - ViewComponent implementation
#
# Container for a single menu (trigger + content).
#
# @example Basic usage
#   render UI::MenuComponent.new do
#     render UI::TriggerComponent.new { "File" }
#     render UI::ContentComponent.new { ... }
#   end
class UI::MenubarMenuComponent < ViewComponent::Base
  include UI::MenubarMenuBehavior

  def initialize(classes: "", **attributes)
    @classes = classes
    @attributes = attributes
  end

  def call
    content_tag :div, **menubar_menu_html_attributes.deep_merge(@attributes) do
      content
    end
  end
end
