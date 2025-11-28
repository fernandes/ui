# frozen_string_literal: true

    class UI::DrawerFooter < Phlex::HTML
      include UI::DrawerFooterBehavior

      def initialize(classes: nil, **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        div(**drawer_footer_html_attributes) do
          yield if block_given?
        end
      end
    end
