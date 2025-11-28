# frozen_string_literal: true

    # InputGroupTextareaComponent - ViewComponent implementation
    #
    # A textarea element styled for use within input groups.
    # Uses InputGroupTextareaBehavior concern for shared styling logic.
    #
    # @example Basic textarea
    #   <%= render UI::InputGroupTextareaComponent.new(
    #     placeholder: "Enter your message",
    #     rows: 3
    #   ) %>
    #
    # @example With name
    #   <%= render UI::InputGroupTextareaComponent.new(
    #     placeholder: "Description",
    #     name: "description"
    #   ) %>
    class UI::InputGroupTextareaComponent < ViewComponent::Base
      include UI::InputGroupTextareaBehavior

      # @param placeholder [String] Placeholder text
      # @param value [String] Textarea value
      # @param name [String] Textarea name attribute
      # @param id [String] Textarea id attribute
      # @param rows [Integer] Number of visible text lines
      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(placeholder: nil, value: nil, name: nil, id: nil, rows: nil, classes: "", **attributes)
        @placeholder = placeholder
        @value = value
        @name = name
        @id = id
        @rows = rows
        @classes = classes
        @attributes = attributes
      end

      def call
        render partial: "ui/textarea", locals: input_group_textarea_attributes
      end
    end
