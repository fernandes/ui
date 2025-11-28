# frozen_string_literal: true

    class UI::CommandSeparator < Phlex::HTML
      include UI::CommandSeparatorBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template
        div(**command_separator_html_attributes.deep_merge(@attributes))
      end
    end
