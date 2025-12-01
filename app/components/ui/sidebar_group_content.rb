# frozen_string_literal: true

# GroupContent - Phlex implementation
#
# Container for content within a sidebar group.
# Typically wraps a SidebarMenu.
#
# @example Basic usage
#   render UI::GroupContent.new do
#     render UI::Menu.new { ... }
#   end
#
# @example Inside a collapsible group
#   render UI::CollapsibleContent.new do
#     render UI::GroupContent.new do
#       render UI::Menu.new { ... }
#     end
#   end
class UI::SidebarGroupContent < Phlex::HTML
  include UI::SidebarGroupContentBehavior

  def initialize(classes: "", **attributes)
    @classes = classes
    @attributes = attributes
  end

  def view_template(&block)
    all_attributes = sidebar_group_content_html_attributes

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
