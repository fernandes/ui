# frozen_string_literal: true

module UI
  module Dialog
    class Overlay < Phlex::HTML
      include UI::Dialog::DialogOverlayBehavior

      def initialize(open: false, classes: nil, **attributes)
        @open = open
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        div(**dialog_overlay_container_html_attributes) do
          div(**dialog_overlay_html_attributes)
          yield if block_given?
        end
      end
    end
  end
end
