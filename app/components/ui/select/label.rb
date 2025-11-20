# frozen_string_literal: true

module UI
  module Select
    # Select Label - Phlex implementation
    #
    # Label for a group of select items.
    # Supports asChild pattern for composition.
    #
    # @example Basic usage
    #   render UI::Select::Label.new { "North America" }
    class Label < Phlex::HTML
      include UI::SelectLabelBehavior
      include UI::Shared::AsChildBehavior

      # @param as_child [Boolean] When true, yields attributes to block instead of rendering div
      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(as_child: false, classes: "", **attributes)
        @as_child = as_child
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        label_attrs = select_label_html_attributes.deep_merge(@attributes)

        if @as_child
          # asChild mode: yield attributes to block
          yield(label_attrs) if block_given?
        else
          # Default mode: render as div
          div(**label_attrs, &block)
        end
      end
    end
  end
end
