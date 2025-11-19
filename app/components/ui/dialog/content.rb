# frozen_string_literal: true

module UI
  module Dialog
    class Content < Phlex::HTML
      include UI::Dialog::DialogContentBehavior

      def initialize(classes: nil, **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        div(**dialog_content_html_attributes) do
          yield if block_given?
        end
      end
    end
  end
end
