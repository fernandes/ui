# frozen_string_literal: true

    class UI::Drawer < Phlex::HTML
      include UI::DrawerBehavior

      def initialize(
        open: false,
        direction: "bottom",
        dismissible: true,
        modal: true,
        snap_points: nil,
        active_snap_point: nil,
        fade_from_index: nil,
        snap_to_sequential_point: false,
        handle_only: false,
        reposition_inputs: true,
        classes: nil,
        **attributes
      )
        @open = open
        @direction = direction
        @dismissible = dismissible
        @modal = modal
        @snap_points = snap_points
        @active_snap_point = active_snap_point
        @fade_from_index = fade_from_index
        @snap_to_sequential_point = snap_to_sequential_point
        @handle_only = handle_only
        @reposition_inputs = reposition_inputs
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        div(**drawer_html_attributes) do
          yield if block_given?
        end
      end
    end
