# frozen_string_literal: true

# Rail - Phlex implementation
#
# Invisible rail on the sidebar edge for drag-to-expand interaction.
#
# @example Basic usage
#   render UI::Sidebar.new do
#     render UI::Rail.new
#     # other content...
#   end
class UI::SidebarRail < Phlex::HTML
  include UI::SidebarRailBehavior

  def initialize(classes: "", **attributes)
    @classes = classes
    @attributes = attributes
  end

  def view_template
    all_attributes = sidebar_rail_html_attributes

    if @attributes.key?(:class)
      merged_class = TailwindMerge::Merger.new.merge([
        all_attributes[:class],
        @attributes[:class]
      ].compact.join(" "))
      all_attributes = all_attributes.merge(class: merged_class)
    end

    all_attributes = all_attributes.deep_merge(@attributes.except(:class))

    button(**all_attributes)
  end
end
