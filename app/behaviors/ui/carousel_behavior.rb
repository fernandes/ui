# frozen_string_literal: true

require "tailwind_merge"

# UI::CarouselBehavior
#
# @ui_component Carousel
# @ui_category data-display
#
# @ui_anatomy Carousel - Root container with state management (required)
# @ui_anatomy Content - Main content container (required)
# @ui_anatomy Item - Individual item element
# @ui_anatomy Next - Navigate to next item
# @ui_anatomy Previous - Navigate to previous item
#
# @ui_feature Custom styling with Tailwind classes
# @ui_feature ARIA attributes for accessibility
# @ui_feature Keyboard navigation with arrow keys
#
# @ui_aria_pattern Carousel
# @ui_aria_reference https://www.w3.org/WAI/ARIA/apg/patterns/carousel/
# @ui_aria_attr aria-roledescription
# @ui_aria_attr role="region"
#
# @ui_keyboard ArrowDown Moves focus to next item
# @ui_keyboard ArrowUp Moves focus to previous item
# @ui_keyboard ArrowLeft Moves focus left or decreases value
# @ui_keyboard ArrowRight Moves focus right or increases value
#
# @ui_related scroll_area
#
module UI::CarouselBehavior
  # Base CSS classes for carousel container
  def carousel_base_classes
    "relative"
  end

  # Merge base classes with custom classes
  def carousel_classes
    TailwindMerge::Merger.new.merge([carousel_base_classes, @classes].compact.join(" "))
  end

  # Data attributes for Stimulus controller
  def carousel_data_attributes
    attrs = {
      controller: "ui--carousel",
      ui__carousel_orientation_value: @orientation || "horizontal"
    }

    # Add options if provided
    if @opts
      attrs[:ui__carousel_opts_value] = @opts.to_json
    end

    # Add plugins if provided
    if @plugins
      attrs[:ui__carousel_plugins_value] = @plugins.to_json
    end

    attrs
  end

  # Merge user-provided data attributes
  def merged_carousel_data_attributes
    user_data = @attributes&.fetch(:data, {}) || {}
    user_data.merge(carousel_data_attributes)
  end

  # Build complete HTML attributes hash
  def carousel_html_attributes
    base_attrs = @attributes&.except(:data) || {}
    base_attrs.merge(
      class: carousel_classes,
      role: "region",
      "aria-roledescription": "carousel",
      data: merged_carousel_data_attributes
    )
  end
end
