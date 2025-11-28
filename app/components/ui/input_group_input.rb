# frozen_string_literal: true

    # Input - Phlex implementation
    #
    # An input element styled for use within input groups.
    # Uses both InputBehavior and InputGroupInputBehavior for styling.
    #
    # @example Basic input
    #   render UI::Input.new(
    #     placeholder: "Enter text",
    #     name: "username"
    #   )
    #
    # @example With type
    #   render UI::Input.new(
    #     type: "email",
    #     placeholder: "email@example.com"
    #   )
    class UI::InputGroupInput < Phlex::HTML
      include UI::InputGroupInputBehavior

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

      def view_template
        # Render the base Input component with InputGroup classes and attributes
        render UI::Input.new(**input_group_input_attributes)
      end
    end
