# frozen_string_literal: true

# MenuItem - Phlex implementation
#
# List item container for a sidebar menu entry.
#
# @example Basic usage
#   render UI::MenuItem.new do
#     render UI::MenuButton.new do
#       render UI::Icon.new(name: "home")
#       plain "Home"
#     end
#   end
#
# @example With action button
#   render UI::MenuItem.new do
#     render UI::MenuButton.new { "Settings" }
#     render UI::MenuAction.new do
#       render UI::Icon.new(name: "ellipsis")
#     end
#   end
class UI::SidebarMenuItem < Phlex::HTML
  include UI::SidebarMenuItemBehavior

  def initialize(classes: "", **attributes)
    @classes = classes
    @attributes = attributes
  end

  def view_template(&block)
    all_attributes = sidebar_menu_item_html_attributes

    if @attributes.key?(:class)
      merged_class = TailwindMerge::Merger.new.merge([
        all_attributes[:class],
        @attributes[:class]
      ].compact.join(" "))
      all_attributes = all_attributes.merge(class: merged_class)
    end

    all_attributes = all_attributes.deep_merge(@attributes.except(:class))

    li(**all_attributes, &block)
  end
end
