# frozen_string_literal: true

# Group - Phlex implementation
#
# Groups multiple keyboard keys together with consistent spacing.
# Useful for representing keyboard combinations like "Ctrl + B".
# Uses KbdGroupBehavior concern for shared styling logic.
#
# @example Basic usage
#   render UI::Group.new do
#     render UI::Kbd.new { "Ctrl" }
#     plain "+"
#     render UI::Kbd.new { "B" }
#   end
class UI::KbdGroup < Phlex::HTML
  include UI::KbdGroupBehavior

  # @param classes [String] Additional CSS classes to merge
  # @param attributes [Hash] Additional HTML attributes
  def initialize(classes: "", **attributes)
    @classes = classes
    @attributes = attributes
  end

  def view_template(&block)
    kbd(**kbd_group_html_attributes) do
      yield if block_given?
    end
  end
end
