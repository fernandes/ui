# frozen_string_literal: true

    # HeaderBehavior
    #
    # Shared behavior for CardHeader component across ERB, ViewComponent, and Phlex implementations.
    module UI::CardHeaderBehavior
      def render_card_header(&content_block)
        all_attributes = card_header_html_attributes.deep_merge(@attributes)
        content_tag(:div, **all_attributes, &content_block)
      end

      def card_header_html_attributes
        {
          class: card_header_classes,
          data: { slot: "card-header" }
        }
      end

      def card_header_classes
        classes_value = respond_to?(:classes, true) ? classes : @classes
        TailwindMerge::Merger.new.merge([
          card_header_base_classes,
          classes_value
        ].compact.join(" "))
      end

      private

      def card_header_base_classes
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6"
      end
    end
