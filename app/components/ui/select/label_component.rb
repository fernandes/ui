# frozen_string_literal: true

module UI
  module Select
    # LabelComponent - ViewComponent implementation
    #
    # Label for a group of select items.
    #
    # @example Basic usage
    #   <%= render UI::Select::LabelComponent.new { "North America" } %>
    class LabelComponent < ViewComponent::Base
      include UI::SelectLabelBehavior

      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag :div, content, **select_label_html_attributes.deep_merge(@attributes)
      end
    end
  end
end
