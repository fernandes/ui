# frozen_string_literal: true

module UI
  module Dialog
    class Header < Phlex::HTML
      include UI::Dialog::DialogHeaderBehavior

      def initialize(classes: nil)
        @classes = classes
      end

      def view_template(&block)
        div(**dialog_header_html_attributes) do
          yield if block_given?
        end
      end
    end
  end
end
