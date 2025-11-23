# frozen_string_literal: true

module UI
  module Drawer
    class Content < Phlex::HTML
      include UI::Drawer::DrawerContentBehavior

      def initialize(open: false, direction: "bottom", classes: nil, **attributes)
        @open = open
        @direction = direction
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        # Add group class for handle visibility based on direction
        div(class: "group/drawer-content", **drawer_content_html_attributes) do
          yield if block_given?
        end
      end
    end
  end
end
