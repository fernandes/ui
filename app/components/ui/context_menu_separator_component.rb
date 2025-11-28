# frozen_string_literal: true

    # SeparatorComponent - ViewComponent implementation
    class UI::ContextMenuSeparatorComponent < ViewComponent::Base
      include UI::ContextMenuSeparatorBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag :div, "", **context_menu_separator_html_attributes.merge(@attributes)
      end
    end
