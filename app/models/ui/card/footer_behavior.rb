# frozen_string_literal: true

module UI
  module Card
    # FooterBehavior
    #
    # Shared behavior for CardFooter component across ERB, ViewComponent, and Phlex implementations.
    module FooterBehavior
      def render_card_footer(&content_block)
        all_attributes = card_footer_html_attributes.deep_merge(@attributes)
        content_tag(:div, **all_attributes, &content_block)
      end

      def card_footer_html_attributes
        {
          class: card_footer_classes,
          data: { slot: "card-footer" }
        }
      end

      def card_footer_classes
        classes_value = respond_to?(:classes, true) ? classes : @classes
        TailwindMerge::Merger.new.merge([
          card_footer_base_classes,
          classes_value
        ].compact.join(" "))
      end

      private

      def card_footer_base_classes
        "flex items-center px-6 [.border-t]:pt-6"
      end
    end
  end
end
