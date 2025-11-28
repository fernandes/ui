# frozen_string_literal: true

    class UI::Sheet < Phlex::HTML
      include UI::SheetBehavior

      def initialize(open: false, close_on_escape: true, close_on_overlay_click: true, classes: nil, **attributes)
        @open = open
        @close_on_escape = close_on_escape
        @close_on_overlay_click = close_on_overlay_click
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        div(**sheet_html_attributes) do
          yield if block_given?
        end
      end
    end
