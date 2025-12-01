# frozen_string_literal: true

require "tailwind_merge"

# Shared behavior for Carousel Content component
module UI::CarouselContentBehavior
  # Base CSS classes for carousel content wrapper (outer div/viewport)
  def carousel_content_base_classes
    "overflow-hidden"
  end

  # Base CSS classes for flex container (inner div)
  # Includes default horizontal spacing
  def carousel_content_container_base_classes
    "flex -ml-4"
  end

  # Merge base classes with custom classes for outer div
  def carousel_content_classes
    carousel_content_base_classes
  end

  # Merge base classes with custom classes for inner flex container
  # User classes can override the -ml-4 default (e.g., -ml-1 for custom spacing)
  def carousel_content_container_classes
    TailwindMerge::Merger.new.merge([carousel_content_container_base_classes, @classes].compact.join(" "))
  end

  # Data attributes for Stimulus target (outer div)
  def carousel_content_data_attributes
    {
      ui__carousel_target: "viewport"
    }
  end

  # Data attributes for flex container (inner div)
  def carousel_content_container_data_attributes
    {
      ui__carousel_target: "container"
    }
  end

  # Build complete HTML attributes hash for inner container
  def carousel_content_container_html_attributes
    {
      class: carousel_content_container_classes,
      data: carousel_content_container_data_attributes
    }
  end

  # Merge user-provided data attributes
  def merged_carousel_content_data_attributes
    user_data = @attributes&.fetch(:data, {}) || {}
    user_data.merge(carousel_content_data_attributes)
  end

  # Build complete HTML attributes hash
  def carousel_content_html_attributes
    base_attrs = @attributes&.except(:data) || {}
    base_attrs.merge(
      class: carousel_content_classes,
      data: merged_carousel_content_data_attributes
    )
  end
end
