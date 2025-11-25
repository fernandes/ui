# frozen_string_literal: true

module UI
  module Sheet
    class Header < Phlex::HTML
      include UI::Sheet::SheetHeaderBehavior

      def initialize(classes: nil)
        @classes = classes
      end

      def view_template(&block)
        div(**sheet_header_html_attributes) do
          yield if block_given?
        end
      end
    end
  end
end
