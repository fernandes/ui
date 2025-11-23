# frozen_string_literal: true

module UI
  module ResponsiveDialog
    # ResponsiveDialog - Renders Dialog on desktop, Drawer on mobile
    # Uses hybrid CSS + Stimulus approach for responsive switching at 768px (md breakpoint)
    #
    # This component renders BOTH Dialog and Drawer, hiding one with CSS.
    # The responsive-dialog Stimulus controller handles state synchronization.
    #
    # @example Basic usage
    #   render UI::ResponsiveDialog::ResponsiveDialog.new do |rd|
    #     rd.with_trigger { "Edit Profile" }
    #     rd.with_content do
    #       # Shared content for both Dialog and Drawer
    #       render_form
    #     end
    #   end
    class ResponsiveDialog < Phlex::HTML
      include UI::ResponsiveDialog::ResponsiveDialogBehavior

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
        # Allow block-based API
        yield(self) if block_given?

        div(**responsive_dialog_html_attributes) do
          # Mobile: Drawer (hidden on md and up)
          div(class: "md:hidden", data: { ui__responsive_dialog_target: "drawer" }) do
            render_drawer
          end

          # Desktop: Dialog (hidden below md)
          div(class: "hidden md:block", data: { ui__responsive_dialog_target: "dialog" }) do
            render_dialog
          end
        end
      end

      private

      def render_drawer
        render UI::Drawer::Drawer.new(open: @open, direction: @direction) do
          render_trigger_for(:drawer)
          render UI::Drawer::Overlay.new(open: @open)
          render UI::Drawer::Content.new(open: @open, direction: @direction) do
            render_shared_content
          end
        end
      end

      def render_dialog
        render UI::Dialog::Dialog.new(open: @open) do
          render_trigger_for(:dialog)
          render UI::Dialog::Overlay.new(open: @open)
          render UI::Dialog::Content.new do
            render_shared_content
          end
        end
      end

      def render_trigger_for(component_type)
        return unless @trigger_content

        if component_type == :drawer
          render UI::Drawer::Trigger.new(&@trigger_content)
        else
          render UI::Dialog::Trigger.new(&@trigger_content)
        end
      end

      def render_shared_content
        @content_block&.call
      end
    end
  end
end
