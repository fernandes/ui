# frozen_string_literal: true

module UI
  module Field
    # FieldGroupComponent - ViewComponent implementation
    #
    # Layout wrapper that stacks Field components.
    # Uses FieldGroupBehavior concern for shared styling logic.
    #
    # @example Basic usage
    #   <%= render UI::Field::FieldGroupComponent.new do %>
    #     <%= render UI::Field::FieldComponent.new do %>
    #       Field 1
    #     <% end %>
    #     <%= render UI::Field::FieldComponent.new do %>
    #       Field 2
    #     <% end %>
    #   <% end %>
    class FieldGroupComponent < ViewComponent::Base
      include UI::FieldGroupBehavior

      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag :div, **field_group_html_attributes do
          content
        end
      end
    end
  end
end
