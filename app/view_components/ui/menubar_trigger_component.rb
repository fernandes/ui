# frozen_string_literal: true

# TriggerComponent - ViewComponent implementation
#
# Button that opens a menu.
#
# @example Basic usage
#   render UI::TriggerComponent.new { "File" }
class UI::MenubarTriggerComponent < ViewComponent::Base
  include UI::MenubarTriggerBehavior

  def initialize(first: false, classes: "", **attributes)
    @first = first
    @classes = classes
    @attributes = attributes
  end

  def call
    content_tag :button, **menubar_trigger_html_attributes.deep_merge(@attributes) do
      content
    end
  end
end
