# frozen_string_literal: true

    class UI::DrawerHandle < Phlex::HTML
      include UI::DrawerHandleBehavior

      def initialize(classes: nil, **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template
        div(**drawer_handle_html_attributes)
      end
    end
