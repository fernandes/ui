# frozen_string_literal: true

module UI
  module InputGroup
    # InputGroupInputComponent - ViewComponent implementation
    #
    # An input element styled for use within input groups.
    # Uses InputGroupInputBehavior concern for shared styling logic.
    #
    # @example Basic input
    #   <%= render UI::InputGroup::InputGroupInputComponent.new(
    #     placeholder: "Enter text",
    #     name: "username"
    #   ) %>
    #
    # @example With type
    #   <%= render UI::InputGroup::InputGroupInputComponent.new(
    #     type: "email",
    #     placeholder: "email@example.com"
    #   ) %>
    class InputGroupInputComponent < ViewComponent::Base
      include InputGroupInputBehavior

      # @param type [String] Input type (default: "text")
      # @param placeholder [String] Placeholder text
      # @param value [String] Input value
      # @param name [String] Input name attribute
      # @param id [String] Input id attribute
      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(type: "text", placeholder: nil, value: nil, name: nil, id: nil, classes: "", **attributes)
        @type = type
        @placeholder = placeholder
        @value = value
        @name = name
        @id = id
        @classes = classes
        @attributes = attributes
      end

      def call
        render partial: "ui/input/input", locals: input_group_input_attributes
      end
    end
  end
end
