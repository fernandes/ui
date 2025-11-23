# frozen_string_literal: true

module UI
  module Drawer
    class Title < Phlex::HTML
      include UI::Drawer::DrawerTitleBehavior

      def initialize(classes: nil, **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        div(**drawer_title_html_attributes) do
          yield if block_given?
        end
      end
    end
  end
end
