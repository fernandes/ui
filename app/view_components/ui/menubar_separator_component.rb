# frozen_string_literal: true

# SeparatorComponent - ViewComponent implementation
#
# Visual separator between menu items.
#
# @example Basic usage
#   render UI::SeparatorComponent.new
class UI::MenubarSeparatorComponent < ViewComponent::Base
  include UI::MenubarSeparatorBehavior

  def initialize(classes: "", **attributes)
    @classes = classes
    @attributes = attributes
  end

  def call
    content_tag :div, "", **menubar_separator_html_attributes.deep_merge(@attributes)
  end
end
