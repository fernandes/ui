# frozen_string_literal: true

    # Separator - Phlex implementation
    #
    # Visual divider to separate sections inside FieldGroup.
    # Uses FieldSeparatorBehavior concern for shared styling logic.
    #
    # @example Basic separator (line only)
    #   render UI::Separator.new
    #
    # @example With label
    #   render UI::Separator.new { "OR" }
    class UI::FieldSeparator < Phlex::HTML
      include UI::FieldSeparatorBehavior

      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
        @block_given = false
      end

      def view_template(&block)
        @block_given = block_given?

        div(**field_separator_html_attributes) do
          if @block_given
            render_with_label(&block)
          else
            render_line_only
          end
        end
      end

      private

      def render_with_label(&block)
        div(class: "border-border bg-background absolute inset-x-0 flex items-center") do
          div(class: "border-border w-full border-t")
        end
        span(class: "bg-background text-muted-foreground relative px-2") do
          yield if block_given?
        end
      end

      def render_line_only
        div(class: "border-border w-full border-t")
      end
    end
