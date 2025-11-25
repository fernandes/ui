# frozen_string_literal: true

module UI
  module Sheet
    class Footer < Phlex::HTML
      include UI::Sheet::SheetFooterBehavior

      def initialize(classes: nil)
        @classes = classes
      end

      def view_template(&block)
        div(**sheet_footer_html_attributes) do
          yield if block_given?
        end
      end
    end
  end
end
