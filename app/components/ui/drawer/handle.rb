# frozen_string_literal: true

module UI
  module Drawer
    class Handle < Phlex::HTML
      include UI::Drawer::DrawerHandleBehavior

      def initialize(classes: nil, **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template
        div(**drawer_handle_html_attributes)
      end
    end
  end
end
