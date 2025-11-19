# frozen_string_literal: true

module UI
  module Dialog
    class Footer < Phlex::HTML
      include UI::Dialog::DialogFooterBehavior

      def initialize(classes: nil)
        @classes = classes
      end

      def view_template(&block)
        div(**dialog_footer_html_attributes) do
          yield if block_given?
        end
      end
    end
  end
end
