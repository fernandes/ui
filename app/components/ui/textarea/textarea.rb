# frozen_string_literal: true

module UI
  module Textarea
    class Textarea < Phlex::HTML
      include UI::TextareaBehavior

      def initialize(placeholder: nil, value: "", name: nil, id: nil, rows: nil, classes: "", **attributes)
        @placeholder = placeholder
        @value = value
        @name = name
        @id = id
        @rows = rows
        @classes = classes
        @attributes = attributes
      end

      def view_template
        textarea(**textarea_html_attributes.deep_merge(@attributes)) { @value }
      end
    end
  end
end
