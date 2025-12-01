# frozen_string_literal: true

# SidebarProvider - Phlex implementation
#
# Root container for sidebar that manages state via Stimulus controller.
# Wraps the entire layout (sidebar + main content).
#
# @example Basic usage
#   render UI::SidebarProvider.new do
#     render UI::Sidebar.new do
#       # Sidebar content
#     end
#     render UI::SidebarInset.new do
#       # Main content
#     end
#   end
#
# @example With custom width
#   render UI::SidebarProvider.new(sidebar_width: "18rem") do
#     # ...
#   end
class UI::SidebarProvider < Phlex::HTML
  include UI::SidebarProviderBehavior

  # @param open [Boolean] Initial open state (default: true)
  # @param collapsible [String] Collapsible mode: "offcanvas", "icon", or "none" (default: "icon")
  # @param side [String] Side position: "left" or "right" (default: "left")
  # @param cookie_name [String] Cookie name for persisting state (default: "sidebar_state")
  # @param sidebar_width [String] Custom sidebar width (default: "16rem")
  # @param sidebar_width_mobile [String] Custom mobile sidebar width (default: "18rem")
  # @param sidebar_width_icon [String] Custom icon-mode width (default: "3rem")
  # @param classes [String] Additional CSS classes
  # @param attributes [Hash] Additional HTML attributes
  def initialize(
    open: true,
    collapsible: "icon",
    side: "left",
    cookie_name: "sidebar_state",
    sidebar_width: "16rem",
    sidebar_width_mobile: "18rem",
    sidebar_width_icon: "3rem",
    classes: "",
    **attributes
  )
    @open = open
    @collapsible = collapsible
    @side = side
    @cookie_name = cookie_name
    @sidebar_width = sidebar_width
    @sidebar_width_mobile = sidebar_width_mobile
    @sidebar_width_icon = sidebar_width_icon
    @classes = classes
    @attributes = attributes
  end

  def view_template(&block)
    all_attributes = sidebar_provider_html_attributes

    # Merge classes with TailwindMerge
    if @attributes.key?(:class)
      merged_class = TailwindMerge::Merger.new.merge([
        all_attributes[:class],
        @attributes[:class]
      ].compact.join(" "))
      all_attributes = all_attributes.merge(class: merged_class)
    end

    # Deep merge other attributes (excluding class)
    all_attributes = all_attributes.deep_merge(@attributes.except(:class))

    div(**all_attributes, &block)
  end
end
