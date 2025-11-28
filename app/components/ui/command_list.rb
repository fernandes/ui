# frozen_string_literal: true

    class UI::CommandList < Phlex::HTML
      include UI::CommandListBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&)
        div(**command_list_html_attributes.deep_merge(@attributes), &)
      end
    end
