# frozen_string_literal: true

module UI
  module Command
    class InputComponent < ViewComponent::Base
      include InputBehavior

      def initialize(placeholder: "Type a command or search...", classes: "", **attributes)
        @placeholder = placeholder
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag(:div, class: command_input_wrapper_classes) do
          safe_join([
            helpers.lucide_icon("search", class: "mr-2 h-4 w-4 shrink-0 opacity-50"),
            tag.input(**command_input_html_attributes.deep_merge(@attributes))
          ])
        end
      end
    end
  end
end
