# frozen_string_literal: true

    # CardBehavior
    #
    # Shared behavior for Card component across ERB, ViewComponent, and Phlex implementations.
    module UI::CardBehavior
      def render_card(&content_block)
        all_attributes = card_html_attributes.deep_merge(@attributes)
        content_tag(:div, **all_attributes, &content_block)
      end

      def card_html_attributes
        {
          class: card_classes,
          data: { slot: "card" }
        }
      end

      def card_classes
        classes_value = respond_to?(:classes, true) ? classes : @classes
        TailwindMerge::Merger.new.merge([
          card_base_classes,
          classes_value
        ].compact.join(" "))
      end

      private

      def card_base_classes
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm"
      end
    end
