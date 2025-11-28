# frozen_string_literal: true

    # FieldLabelComponent - ViewComponent implementation
    #
    # Label styled for form fields with disability states.
    # Uses FieldLabelBehavior concern for shared styling logic.
    #
    # @example With block
    #   <%= render UI::FieldLabelComponent.new(for_id: "email") do %>
    #     Email Address
    #   <% end %>
    class UI::FieldLabelComponent < ViewComponent::Base
      include UI::FieldLabelBehavior

      # @param for_id [String] ID of the associated form control
      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(for_id: nil, classes: "", **attributes)
        @for_id = for_id
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag :label, **field_label_html_attributes do
          content
        end
      end
    end
