# frozen_string_literal: true

# Sidebar - Phlex implementation
#
# Main sidebar container with support for variants and collapsible modes.
# Must be used within a SidebarProvider.
#
# Renders the desktop sidebar (hidden below md) and an empty mobile Sheet
# (hidden on md+). The block is rendered once, inside the desktop <aside>;
# on phones the ui--sidebar controller moves that same content into the
# sheet (and back), so ids stay unique and nested controllers run once.
#
# @example Basic usage
#   render UI::Sidebar.new do
#     render UI::Header.new { "Header" }
#     render UI::Content.new { "Content" }
#     render UI::Footer.new { "Footer" }
#   end
#
# @example With variant
#   render UI::Sidebar.new(variant: "floating") do
#     # ...
#   end
class UI::Sidebar < Phlex::HTML
  include UI::SidebarBehavior

  # @param variant [String] Visual variant: "sidebar" (default), "floating", or "inset"
  # @param side [String] Side position: "left" or "right" (default: "left")
  # @param collapsible [String] Collapsible mode: "offcanvas", "icon", or "none" (default: "icon")
  # @param classes [String] Additional CSS classes
  # @param attributes [Hash] Additional HTML attributes
  def initialize(
    variant: "sidebar",
    side: "left",
    collapsible: "icon",
    classes: "",
    **attributes
  )
    @variant = variant
    @side = side
    @collapsible = collapsible
    @classes = classes
    @attributes = attributes
  end

  def view_template(&block)
    # Render mobile Sheet (visible only below md breakpoint); the controller
    # moves the content into it on phones
    render_mobile_sheet

    # Render desktop sidebar (visible only at md+ breakpoint)
    render_desktop_sidebar(&block)
  end

  private

  def render_mobile_sheet
    # Mobile Sheet - slides in from left/right based on side
    sheet_side = (@side.to_s == "right") ? "right" : "left"

    render UI::Sheet.new(
      classes: "md:hidden",
      data: {ui__sidebar_target: "mobileSheet"}
    ) do
      # The content goes inside the overlay's container: the modal session
      # keeps that container interactive and makes everything else inert
      render UI::SheetOverlay.new do
        render UI::SheetContent.new(
          side: sheet_side,
          show_close: false,
          classes: "bg-sidebar text-sidebar-foreground w-[var(--sidebar-width-mobile)] p-0",
          data: {ui__sidebar_target: "mobileContent"}
        ) do
          # Screen reader only header for accessibility
          render UI::SheetHeader.new(classes: "sr-only") do
            render UI::SheetTitle.new { "Sidebar" }
            render UI::SheetDescription.new { "Navigation sidebar" }
          end
        end
      end
    end
  end

  def render_desktop_sidebar(&block)
    all_attributes = sidebar_html_attributes

    # Merge classes with TailwindMerge
    if @attributes.key?(:class)
      merged_class = UI::ClassMerger.merge([
        all_attributes[:class],
        @attributes[:class]
      ].compact.join(" "))
      all_attributes = all_attributes.merge(class: merged_class)
    end

    # Deep merge other attributes (excluding class)
    all_attributes = all_attributes.deep_merge(@attributes.except(:class))

    aside(**all_attributes) do
      # Inner container with flex layout
      div(class: "flex h-full w-full flex-col", data: {ui__sidebar_target: "content"}, &block)
    end
  end
end
