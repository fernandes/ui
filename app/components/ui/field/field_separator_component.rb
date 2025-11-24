# frozen_string_literal: true

module UI
  module Field
    # FieldSeparatorComponent - ViewComponent implementation
    #
    # Visual divider to separate sections inside FieldGroup.
    # Uses FieldSeparatorBehavior concern for shared styling logic.
    #
    # @example Basic separator (line only)
    #   <%= render UI::Field::FieldSeparatorComponent.new %>
    #
    # @example With block
    #   <%= render UI::Field::FieldSeparatorComponent.new do %>
    #     OR
    #   <% end %>
    class FieldSeparatorComponent < ViewComponent::Base
      include UI::FieldSeparatorBehavior

      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag :div, **field_separator_html_attributes do
          if content?
            render_with_label
          else
            render_line_only
          end
        end
      end

      private

      attr_reader :classes, :attributes

      def render_with_label
        safe_join([
          content_tag(:div, class: "border-border bg-background absolute inset-x-0 flex items-center") do
            content_tag(:div, "", class: "border-border w-full border-t")
          end,
          content_tag(:span, class: "bg-background text-muted-foreground relative px-2") do
            content
          end
        ])
      end

      def render_line_only
        content_tag(:div, "", class: "border-border w-full border-t")
      end
    end
  end
end
