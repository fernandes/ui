# frozen_string_literal: true

# Menu - Phlex implementation
#
# Wrapper for each top-level menu in the menubar.
#
# @example Basic usage
#   render UI::Menu.new(value: "file") do
#     render UI::Trigger.new { "File" }
#     render UI::Content.new { ... }
#   end
class UI::MenubarMenu < Phlex::HTML
  include UI::MenubarMenuBehavior

  # @param value [String] Unique identifier for this menu
  # @param classes [String] Additional CSS classes to merge
  # @param attributes [Hash] Additional HTML attributes
  def initialize(value: nil, classes: "", **attributes)
    @value = value
    @classes = classes
    @attributes = attributes
  end

  def view_template(&block)
    div(**menubar_menu_html_attributes.deep_merge(@attributes)) do
      yield if block_given?
    end
  end
end
