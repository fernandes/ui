# frozen_string_literal: true

# MenuSubButton - Phlex implementation
#
# Interactive button within a sidebar submenu item.
# Smaller than MenuButton, designed for nested navigation.
#
# @example Basic usage
#   render UI::MenuSubButton.new { "Sub Item" }
#
# @example As a link with asChild
#   render UI::MenuSubButton.new(as_child: true) do |attrs|
#     a(**attrs, href: "/documents/report") { "Report.pdf" }
#   end
#
# @example Active state
#   render UI::MenuSubButton.new(active: true) { "Current Page" }
class UI::SidebarMenuSubButton < Phlex::HTML
  include UI::SidebarMenuSubButtonBehavior

  def initialize(size: :md, active: false, as_child: false, classes: "", **attributes)
    @size = size.to_sym
    @active = active
    @as_child = as_child
    @classes = classes
    @attributes = attributes
  end

  def view_template(&block)
    if @as_child
      yield sidebar_menu_sub_button_html_attributes.deep_merge(@attributes)
    else
      all_attributes = sidebar_menu_sub_button_html_attributes

      if @attributes.key?(:class)
        merged_class = TailwindMerge::Merger.new.merge([
          all_attributes[:class],
          @attributes[:class]
        ].compact.join(" "))
        all_attributes = all_attributes.merge(class: merged_class)
      end

      all_attributes = all_attributes.deep_merge(@attributes.except(:class))

      a(**all_attributes, &block)
    end
  end
end
