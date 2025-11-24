# frozen_string_literal: true

module UI
  module Field
    # Label - Phlex implementation
    #
    # Label styled for form fields with disability states.
    # Uses FieldLabelBehavior concern for shared styling logic.
    #
    # @example Basic usage
    #   render UI::Field::Label.new(for_id: "email") { "Email Address" }
    class Label < Phlex::HTML
      include UI::FieldLabelBehavior

      # @param for_id [String] ID of the associated form control
      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(for_id: nil, classes: "", **attributes)
        @for_id = for_id
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        label(**field_label_html_attributes) do
          yield if block_given?
        end
      end
    end
  end
end
