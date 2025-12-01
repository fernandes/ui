# frozen_string_literal: true

# Group - Phlex implementation
#
# Container for grouping related sidebar items.
# Can be made collapsible using UI::Collapsible.
#
# @example Basic usage (non-collapsible)
#   render UI::Group.new do
#     render UI::GroupLabel.new { "Section" }
#     render UI::GroupContent.new do
#       render UI::Menu.new { ... }
#     end
#   end
#
# @example Collapsible group (using UI::Collapsible)
#   render UI::Collapsible.new(open: true, as_child: true) do |collapsible_attrs|
#     render UI::Group.new(**collapsible_attrs) do
#       render UI::CollapsibleTrigger.new(as_child: true) do |trigger_attrs|
#         render UI::GroupLabel.new(**trigger_attrs) { "Section" }
#       end
#       render UI::CollapsibleContent.new do
#         render UI::GroupContent.new do
#           render UI::Menu.new { ... }
#         end
#       end
#     end
#   end
class UI::SidebarGroup < Phlex::HTML
  include UI::SidebarGroupBehavior

  def initialize(classes: "", **attributes)
    @classes = classes
    @attributes = attributes
  end

  def view_template(&block)
    all_attributes = sidebar_group_html_attributes

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
