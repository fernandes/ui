# frozen_string_literal: true

module UI
  module Dialog
    class Dialog < Phlex::HTML
      include UI::Dialog::DialogBehavior

      def initialize(open: false, close_on_escape: true, close_on_overlay_click: true, classes: nil, **attributes)
        @open = open
        @close_on_escape = close_on_escape
        @close_on_overlay_click = close_on_overlay_click
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        div(**dialog_html_attributes) do
          yield if block_given?
        end
      end
    end
  end
end
