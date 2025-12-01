# frozen_string_literal: true

# MenuSkeleton - Phlex implementation
#
# Loading skeleton for sidebar menu items.
# Shows animated placeholders for icon and text.
#
# @example Basic usage
#   render UI::MenuSkeleton.new
#
# @example Hide icon placeholder
#   render UI::MenuSkeleton.new(show_icon: false)
#
# @example Multiple skeletons
#   5.times { render UI::MenuSkeleton.new }
class UI::SidebarMenuSkeleton < Phlex::HTML
  include UI::SidebarMenuSkeletonBehavior

  # Random widths for text skeleton to look more natural
  WIDTHS = %w[60% 70% 80% 90% 50%].freeze

  def initialize(show_icon: true, classes: "", **attributes)
    @show_icon = show_icon
    @classes = classes
    @attributes = attributes
  end

  def view_template
    all_attributes = sidebar_menu_skeleton_html_attributes

    if @attributes.key?(:class)
      merged_class = TailwindMerge::Merger.new.merge([
        all_attributes[:class],
        @attributes[:class]
      ].compact.join(" "))
      all_attributes = all_attributes.merge(class: merged_class)
    end

    all_attributes = all_attributes.deep_merge(@attributes.except(:class))

    div(**all_attributes) do
      if @show_icon
        # Icon skeleton
        div(
          class: "size-4 rounded-md bg-sidebar-accent animate-pulse",
          data: {slot: "sidebar-menu-skeleton-icon"}
        )
      end
      # Text skeleton with random width
      div(
        class: "h-4 max-w-[var(--skeleton-width)] flex-1 rounded-md bg-sidebar-accent animate-pulse",
        style: "--skeleton-width: #{random_width}",
        data: {slot: "sidebar-menu-skeleton-text"}
      )
    end
  end

  private

  def random_width
    WIDTHS.sample
  end
end
