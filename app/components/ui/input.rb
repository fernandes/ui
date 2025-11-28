# frozen_string_literal: true

    class UI::Input < Phlex::HTML
      include UI::InputBehavior

      def initialize(type: "text", placeholder: nil, value: nil, name: nil, id: nil, classes: "", **attributes)
        @type = type
        @placeholder = placeholder
        @value = value
        @name = name
        @id = id
        @classes = classes
        @attributes = attributes
      end

      def view_template
        input(**input_html_attributes.deep_merge(@attributes))
      end
    end
