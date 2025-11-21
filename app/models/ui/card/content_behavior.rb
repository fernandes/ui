# frozen_string_literal: true

module UI
  module Card
    # ContentBehavior
    #
    # Shared behavior for CardContent component across ERB, ViewComponent, and Phlex implementations.
    module ContentBehavior
      def render_card_content(&content_block)
        all_attributes = card_content_html_attributes.deep_merge(@attributes)
        content_tag(:div, **all_attributes, &content_block)
      end

      def card_content_html_attributes
        {
          class: card_content_classes,
          data: { slot: "card-content" }
        }
      end

      def card_content_classes
        classes_value = respond_to?(:classes, true) ? classes : @classes
        TailwindMerge::Merger.new.merge([
          card_content_base_classes,
          classes_value
        ].compact.join(" "))
      end

      private

      def card_content_base_classes
        "px-6"
      end
    end
  end
end
