# frozen_string_literal: true

module UI
  module Command
    class Empty < Phlex::HTML
      include EmptyBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&)
        div(**command_empty_html_attributes.deep_merge(@attributes), &)
      end
    end
  end
end
