# frozen_string_literal: true

    # LabelComponent - ViewComponent implementation
    #
    # Accessible label for form inputs following shadcn/ui design patterns.
    class UI::LabelComponent < ViewComponent::Base
      include UI::LabelBehavior

      # @param for_id [String] The ID of the form element this label is for
      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(for_id: nil, classes: "", **attributes)
        @for_id = for_id
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag :label, **label_html_attributes.merge(@attributes.except(:data)) do
          content
        end
      end
    end
