# frozen_string_literal: true

# ContextMenu - Phlex implementation
#
# Container for context menus triggered by right-click.
# Uses ContextMenuBehavior concern for shared styling logic.
#
# @example Basic usage
#   render UI::ContextMenu.new do
#     render UI::Trigger.new { "Right-click me" }
#     render UI::Content.new do
#       render UI::Item.new { "Menu Item" }
#     end
#   end
class UI::ContextMenu < Phlex::HTML
  include UI::ContextMenuBehavior

  # @param classes [String] Additional CSS classes to merge
  # @param attributes [Hash] Additional HTML attributes
  def initialize(classes: "", **attributes)
    @classes = classes
    @attributes = attributes
  end

  def view_template(&block)
    div(**context_menu_html_attributes.deep_merge(@attributes)) do
      yield if block_given?
    end
  end
end
