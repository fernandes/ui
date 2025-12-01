# frozen_string_literal: true

require "tailwind_merge"

# Shared behavior for Carousel Item component
module UI::CarouselItemBehavior
  # Base CSS classes for carousel item (slide)
  def carousel_item_base_classes
    "min-w-0 shrink-0 grow-0 basis-full pl-4"
  end

  # Merge base classes with custom classes
  def carousel_item_classes
    TailwindMerge::Merger.new.merge([carousel_item_base_classes, @classes].compact.join(" "))
  end

  # Build complete HTML attributes hash
  def carousel_item_html_attributes
    base_attrs = @attributes || {}
    base_attrs.merge(
      class: carousel_item_classes,
      role: "group",
      "aria-roledescription": "slide"
    )
  end
end
