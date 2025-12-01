# frozen_string_literal: true

# Kbd - Phlex implementation
#
# Displays textual user input from keyboard, helping users understand
# keyboard shortcuts and interactions within applications.
# Uses KbdBehavior concern for shared styling logic.
#
# @example Basic usage
#   render UI::Kbd.new { "Ctrl" }
#
# @example With custom classes
#   render UI::Kbd.new(classes: "text-sm") { "⌘K" }
class UI::Kbd < Phlex::HTML
  include UI::KbdBehavior

  # @param classes [String] Additional CSS classes to merge
  # @param attributes [Hash] Additional HTML attributes
  def initialize(classes: "", **attributes)
    @classes = classes
    @attributes = attributes
  end

  def view_template(&block)
    kbd(**kbd_html_attributes) do
      yield if block_given?
    end
  end
end
