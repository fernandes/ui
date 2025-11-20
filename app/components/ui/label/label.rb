# frozen_string_literal: true

module UI
  module Label
    # Label - Phlex implementation
    #
    # Accessible label for form inputs following shadcn/ui design patterns.
    # Uses LabelBehavior concern for shared styling logic.
    #
    # @example Basic usage
    #   render UI::Label::Label.new(for_id: "email") { "Email address" }
    #
    # @example With custom classes
    #   render UI::Label::Label.new(for_id: "password", classes: "text-destructive") { "Password" }
    class Label < Phlex::HTML
      include UI::LabelBehavior

      # @param for_id [String] The ID of the form element this label is for
      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(for_id: nil, classes: "", **attributes)
        @for_id = for_id
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        label(**label_html_attributes.deep_merge(@attributes)) do
          yield if block_given?
        end
      end
    end
  end
end
