# frozen_string_literal: true

# Item - Phlex implementation
#
# A selectable menu item.
#
# @example Basic usage
#   render UI::Item.new { "New Tab" }
#
# @example With shortcut
#   render UI::Item.new do
#     plain "New Tab"
#     render UI::Shortcut.new { "Ctrl+T" }
#   end
#
# @example Destructive variant
#   render UI::Item.new(variant: :destructive) { "Delete" }
class UI::MenubarItem < Phlex::HTML
  include UI::MenubarItemBehavior

  # @param variant [Symbol] :default or :destructive
  # @param inset [Boolean] Add left padding to align with checkbox/radio items
  # @param disabled [Boolean] Disable the item
  # @param classes [String] Additional CSS classes to merge
  # @param attributes [Hash] Additional HTML attributes
  def initialize(variant: :default, inset: false, disabled: false, classes: "", **attributes)
    @variant = variant
    @inset = inset
    @disabled = disabled
    @classes = classes
    @attributes = attributes
  end

  def view_template(&block)
    div(**menubar_item_html_attributes.deep_merge(@attributes)) do
      yield if block_given?
    end
  end
end
