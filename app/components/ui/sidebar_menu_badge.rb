# frozen_string_literal: true

# MenuBadge - Phlex implementation
#
# Badge that appears at the end of a menu button.
# Used to display counts or status indicators.
#
# @example Basic usage
#   render UI::MenuItem.new do
#     render UI::MenuButton.new do
#       render UI::Icon.new(name: "inbox")
#       span { "Inbox" }
#     end
#     render UI::MenuBadge.new { "24" }
#   end
class UI::SidebarMenuBadge < Phlex::HTML
  include UI::SidebarMenuBadgeBehavior

  def initialize(classes: "", **attributes)
    @classes = classes
    @attributes = attributes
  end

  def view_template(&block)
    all_attributes = sidebar_menu_badge_html_attributes

    if @attributes.key?(:class)
      merged_class = TailwindMerge::Merger.new.merge([
        all_attributes[:class],
        @attributes[:class]
      ].compact.join(" "))
      all_attributes = all_attributes.merge(class: merged_class)
    end

    all_attributes = all_attributes.deep_merge(@attributes.except(:class))

    div(**all_attributes, &block)
  end
end
