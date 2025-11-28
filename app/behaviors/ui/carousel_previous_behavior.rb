# frozen_string_literal: true

require "tailwind_merge"

    # Shared behavior for Carousel Previous button
    module UI::CarouselPreviousBehavior
      # Base CSS classes for previous button (default horizontal positioning)
      def carousel_previous_base_classes
        "absolute size-8 rounded-lg top-1/2 -translate-y-1/2 -left-12"
      end

      # Merge base classes with custom classes
      def carousel_previous_classes
        TailwindMerge::Merger.new.merge([carousel_previous_base_classes, @classes].compact.join(" "))
      end

      # Data attributes for Stimulus action
      def carousel_previous_data_attributes
        {
          action: "click->ui--carousel#scrollPrev",
          ui__carousel_target: "prevButton"
        }
      end

      # Merge user-provided data attributes
      def merged_carousel_previous_data_attributes
        user_data = @attributes&.fetch(:data, {}) || {}
        user_data.merge(carousel_previous_data_attributes)
      end

      # Build complete HTML attributes hash (without class, which is handled separately)
      def carousel_previous_html_attributes
        base_attrs = @attributes&.except(:data, :class) || {}
        base_attrs.merge(
          "aria-label": "Previous slide",
          data: merged_carousel_previous_data_attributes
        )
      end
    end
