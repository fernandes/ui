# frozen_string_literal: true

# ResponsiveDialog component (ViewComponent)
# Combines Dialog (desktop) and Drawer (mobile) with responsive switching
#
# Hybrid CSS + Stimulus approach:
# - Renders both Dialog and Drawer
# - CSS hides one based on breakpoint (md:hidden / md:block)
# - Stimulus controller syncs state between them
#
# @example Basic usage
#   <%= render UI::ResponsiveDialogComponent.new do %>
#     <!-- Content will be rendered in both Dialog and Drawer -->
#     <form>...</form>
#   <% end %>
#
# @example With custom breakpoint
#   <%= render UI::ResponsiveDialogComponent.new(
#     breakpoint: 1024,
#     direction: "right"
#   ) do %>
#     <!-- Content -->
#   <% end %>
class UI::ResponsiveDialogComponent < ViewComponent::Base
  include UI::ResponsiveDialogBehavior

  # Trigger content, rendered in both variants (only one is visible)
  renders_one :trigger

  def initialize(
    open: false,
    breakpoint: 768,
    direction: "bottom",
    classes: "",
    attributes: {}
  )
    @open = open
    @breakpoint = breakpoint
    @direction = direction
    @classes = classes
    @attributes = attributes
  end

  def call
    content_tag :div, **responsive_dialog_html_attributes do
      content_tag(:div, **responsive_dialog_variant_attributes(:drawer)) { render_drawer } +
        content_tag(:div, **responsive_dialog_variant_attributes(:dialog)) { render_dialog }
    end
  end

  private

  # Children render closed: the controller opens only the visible one
  def render_drawer
    render UI::DrawerComponent.new(open: false, direction: @direction) do
      safe_join([
        (render(UI::DrawerTriggerComponent.new.with_content(trigger.to_s)) if trigger?),
        render(UI::DrawerOverlayComponent.new),
        render(UI::DrawerContentComponent.new(direction: @direction)) do
          content_tag(:div, "", **responsive_dialog_slot_attributes(:drawer))
        end
      ].compact)
    end
  end

  # The body (content) is rendered once, here; the controller moves it to the drawer
  def render_dialog
    render UI::DialogComponent.new(open: false) do
      safe_join([
        (render(UI::DialogTriggerComponent.new.with_content(trigger.to_s)) if trigger?),
        render(UI::DialogOverlayComponent.new) do
          render(UI::DialogContentComponent.new) do
            content_tag(:div, **responsive_dialog_slot_attributes(:dialog)) do
              content_tag(:div, content, **responsive_dialog_body_attributes)
            end
          end
        end
      ].compact)
    end
  end
end
