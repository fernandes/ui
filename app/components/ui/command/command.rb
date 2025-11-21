# frozen_string_literal: true

module UI
  module Command
    class Command < Phlex::HTML
      include CommandBehavior

      def initialize(loop: true, classes: "", **attributes)
        @loop = loop
        @classes = classes
        @attributes = attributes
      end

      def view_template(&)
        div(**command_html_attributes.deep_merge(@attributes), &)
      end
    end
  end
end
