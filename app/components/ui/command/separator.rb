# frozen_string_literal: true

module UI
  module Command
    class Separator < Phlex::HTML
      include SeparatorBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template
        div(**command_separator_html_attributes.deep_merge(@attributes))
      end
    end
  end
end
