# frozen_string_literal: true

module UI
  module Drawer
    class Overlay < Phlex::HTML
      include UI::Drawer::DrawerOverlayBehavior

      def initialize(open: false, classes: nil, **attributes)
        @open = open
        @classes = classes
        @attributes = attributes
      end

      def view_template
        div(**drawer_overlay_container_html_attributes) do
          div(**drawer_overlay_html_attributes)
        end
      end
    end
  end
end
