# frozen_string_literal: true

    # GroupComponent - ViewComponent implementation
    #
    # Groups multiple keyboard keys together with consistent spacing.
    # Useful for representing keyboard combinations like "Ctrl + B".
    # Uses KbdGroupBehavior concern for shared styling logic.
    #
    # @example Basic usage
    #   <%= render UI::GroupComponent.new do %>
    #     <%= render UI::KbdComponent.new { "Ctrl" } %>
    #     +
    #     <%= render UI::KbdComponent.new { "B" } %>
    #   <% end %>
    class UI::KbdGroupComponent < ViewComponent::Base
      include UI::KbdGroupBehavior

      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def call
        attrs = kbd_group_html_attributes

        content_tag :kbd, **attrs.merge(@attributes) do
          content
        end
      end
    end
