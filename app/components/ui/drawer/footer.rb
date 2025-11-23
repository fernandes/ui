# frozen_string_literal: true

module UI
  module Drawer
    class Footer < Phlex::HTML
      include UI::Drawer::DrawerFooterBehavior

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
  end
end
