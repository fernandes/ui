# frozen_string_literal: true

    # Group - Phlex implementation
    #
    # Layout wrapper that stacks Field components.
    # Uses FieldGroupBehavior concern for shared styling logic.
    #
    # @example Basic usage
    #   render UI::Group.new do
    #     render UI::Field.new { "Field 1" }
    #     render UI::Field.new { "Field 2" }
    #   end
    class UI::FieldGroup < Phlex::HTML
      include UI::FieldGroupBehavior

      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        div(**field_group_html_attributes) do
          yield if block_given?
        end
      end
    end
