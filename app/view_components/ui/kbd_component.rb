# frozen_string_literal: true

# KbdComponent - ViewComponent implementation
#
# Displays textual user input from keyboard, helping users understand
# keyboard shortcuts and interactions within applications.
# Uses KbdBehavior concern for shared styling logic.
#
# @example Basic usage
#   <%= render UI::KbdComponent.new { "Ctrl" } %>
#
# @example With custom classes
#   <%= render UI::KbdComponent.new(classes: "text-sm") { "⌘K" } %>
class UI::KbdComponent < ViewComponent::Base
  include UI::KbdBehavior

  # @param classes [String] Additional CSS classes to merge
  # @param attributes [Hash] Additional HTML attributes
  def initialize(classes: "", **attributes)
    @classes = classes
    @attributes = attributes
  end

  def call
    attrs = kbd_html_attributes

    content_tag :kbd, **attrs.merge(@attributes) do
      content
    end
  end
end
