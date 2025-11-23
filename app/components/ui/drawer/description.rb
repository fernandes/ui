# frozen_string_literal: true

module UI
  module Drawer
    class Description < Phlex::HTML
      include UI::Drawer::DrawerDescriptionBehavior

      def initialize(classes: nil, **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        p(**drawer_description_html_attributes) do
          yield if block_given?
        end
      end
    end
  end
end
