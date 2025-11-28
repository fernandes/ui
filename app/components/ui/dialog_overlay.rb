# frozen_string_literal: true

    class UI::DialogOverlay < Phlex::HTML
      include UI::DialogOverlayBehavior

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
