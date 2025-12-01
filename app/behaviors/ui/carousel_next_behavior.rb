# frozen_string_literal: true

require "tailwind_merge"

# Shared behavior for Carousel Next button
module UI::CarouselNextBehavior
  # Base CSS classes for next button (default horizontal positioning)
  def carousel_next_base_classes
    "absolute size-8 !rounded-full top-1/2 -translate-y-1/2 -right-12"
  end

  # Merge base classes with custom classes
  def carousel_next_classes
    TailwindMerge::Merger.new.merge([carousel_next_base_classes, @classes].compact.join(" "))
  end

  # Data attributes for Stimulus action
  def carousel_next_data_attributes
    {
      action: "click->ui--carousel#scrollNext",
      ui__carousel_target: "nextButton"
    }
  end

  # Merge user-provided data attributes
  def merged_carousel_next_data_attributes
    user_data = @attributes&.fetch(:data, {}) || {}
    user_data.merge(carousel_next_data_attributes)
  end

  # Build complete HTML attributes hash (without class, which is handled separately)
  def carousel_next_html_attributes
    base_attrs = @attributes&.except(:data, :class) || {}
    base_attrs.merge(
      "aria-label": "Next slide",
      data: merged_carousel_next_data_attributes
    )
  end
end
