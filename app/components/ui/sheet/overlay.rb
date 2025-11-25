# frozen_string_literal: true

module UI
  module Sheet
    class Overlay < Phlex::HTML
      include UI::Sheet::SheetOverlayBehavior

      def initialize(open: false, classes: nil, **attributes)
        @open = open
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        div(**sheet_overlay_container_html_attributes) do
          div(**sheet_overlay_html_attributes)
          yield if block_given?
        end
      end
    end
  end
end
