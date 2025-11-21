# frozen_string_literal: true

module UI
  module Command
    class List < Phlex::HTML
      include ListBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&)
        div(**command_list_html_attributes.deep_merge(@attributes), &)
      end
    end
  end
end
