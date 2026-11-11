# frozen_string_literal: true

# ResponsiveDialog - Renders Dialog on desktop, Drawer on mobile
# Uses hybrid CSS + Stimulus approach for responsive switching at 768px (md breakpoint)
#
# This component renders BOTH Dialog and Drawer, hiding one with CSS. The
# content block is rendered ONCE (inside the Dialog); the responsive-dialog
# Stimulus controller moves it into whichever variant is visible, keeps the
# open state in sync and hands over when the breakpoint is crossed while open.
# A heading in the content names the dialog (aria-labelledby).
#
# @example Basic usage
#   render UI::ResponsiveDialog.new do |rd|
#     rd.with_trigger { "Edit Profile" }
#     rd.with_content do
#       # Shared content for both Dialog and Drawer
#       render_form
#     end
#   end
class UI::ResponsiveDialog < Phlex::HTML
  include UI::ResponsiveDialogBehavior

  def initialize(
    open: false,
    breakpoint: 768,
    direction: "bottom",
    classes: nil,
    **attributes
  )
    @open = open
    @breakpoint = breakpoint
    @direction = direction
    @classes = classes
    @attributes = attributes
    @trigger_content = nil
    @content_block = nil
  end

  # Builder method for trigger
  def with_trigger(&block)
    @trigger_content = block
  end

  # Builder method for content
  def with_content(&block)
    @content_block = block
  end

  def view_template(&block)
    yield(self) if block_given?

    div(**responsive_dialog_html_attributes) do
      div(**responsive_dialog_variant_attributes(:drawer)) { render_drawer }
      div(**responsive_dialog_variant_attributes(:dialog)) { render_dialog }
    end
  end

  private

  # Children render closed: the controller opens only the visible one
  def render_drawer
    render UI::Drawer.new(open: false, direction: @direction) do
      render UI::DrawerTrigger.new(&@trigger_content) if @trigger_content
      render UI::DrawerOverlay.new
      render UI::DrawerContent.new(direction: @direction) do
        div(**responsive_dialog_slot_attributes(:drawer))
      end
    end
  end

  # The body is rendered once, here; the controller moves it to the drawer
  def render_dialog
    render UI::Dialog.new(open: false) do
      render UI::DialogTrigger.new(&@trigger_content) if @trigger_content
      render UI::DialogOverlay.new do
        render UI::DialogContent.new do
          div(**responsive_dialog_slot_attributes(:dialog)) do
            div(**responsive_dialog_body_attributes) { @content_block&.call }
          end
        end
      end
    end
  end
end
